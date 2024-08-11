const { GetQuote, BuyOrSell } = require("../../utils/price");
const { Connection } = require("@solana/web3.js");
const config = require("../../config");
const kafka = require("kafka-node");
const {
  createTransaction,
} = require("../../repositories/transactionRepository");

// Set up Kafka client
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" }); // Replace with your Kafka broker address

// Set up the Kafka consumer
const consumer = new kafka.Consumer(
  client,
  [{ topic: "test-topic", partition: 0 }],
  {
    autoCommit: false, // Disable auto-commit for manual offset management
    autoOffsetReset: "latest",
  }
);

const SOLANA_CONNECTION = new Connection(config.QUICKNODE_RPC);

client.on("connect", () => {
  console.log("Kafka Consumer is ready.");
});

consumer.on("message", async (message) => {
  try {
    console.log("Kafka Consumer received a message:", message);
    const messageValue = JSON.parse(message.value);
    const tokenAddress = messageValue.tokenAddress;
    const solanAddress = "So11111111111111111111111111111111111111112";

    if (tokenAddress) {
      // Process the message asynchronously
      const BuyOrSellResponse = await BuyOrSell(tokenAddress, solanAddress);
      const balance = await getTokenBalanceWeb3(
        SOLANA_CONNECTION,
        tokenAddress
      );

      // Insert data into the database
      await createTransaction({
        tokenAddress,
        tokenBuyPrice: 0.1 / balance,
        tokenBalance: balance,
      });

      console.log(`Processed tokenAddress: ${tokenAddress}`);
    } else {
      console.warn("No tokenAddress found in the message.");
    }

    // Commit the offset after processing
    consumer.commitOffsets(
      [
        {
          topic: message.topic,
          partition: message.partition,
          offset: Number(message.offset) + 1,
        },
      ],
      (err, data) => {
        if (err) {
          console.error("Failed to commit offset:", err);
        } else {
          console.log("Offset committed:", data);
        }
      }
    );

    // Log message details
    console.log(
      `Received message: ${message.value.toString()} (Partition: ${
        message.partition
      }, Offset: ${message.offset})`
    );
  } catch (error) {
    console.error("Error processing message:", error);
  }
});

consumer.on("error", (err) => {
  console.error("Kafka Consumer encountered an error:", err);
});

client.on("error", (err) => {
  console.error("Kafka client encountered an error:", err);
});

module.exports = client;
