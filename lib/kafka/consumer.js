const kafka = require("kafka-node");
import { GetQuote, BuyOrSell } from "../../utils/price";
import { QUICKNODE_RPC } from "../../config";

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" }); // Replace with your Kafka broker address

const consumer = new kafka.Consumer(
  client,
  [{ topic: "test-topic", partition: 0 }],
  {
    autoCommit: true,
  }
);
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
consumer.on("message", async (message) => {
  try {
    console.log("Kafka Consumer received a message:", message);
    // Parse the message value
    const messageValue = JSON.parse(message.value.toString());
    const tokenAddress = messageValue["tokenAddress"];
    const solanAddress = "So11111111111111111111111111111111111111112";
    if (tokenAddress) {
      // Process the message asynchronously
      const BuyOrSellResponse = await BuyOrSell(tokenAddress, solanAddress);
      const balance = await getTokenBalanceWeb3(
        SOLANA_CONNECTION,
        tokenAddress
      );
      // Insert data into the database
      await insertIntoDatabase(tokenAddress, balance, 0.1 / balance);

      console.log(`Processed tokenAddress: ${tokenAddress}`);
    } else {
      console.warn("No tokenAddress found in the message.");
    }
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

module.exports = consumer;
