const kafka = require("kafka-node");

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" }); // Replace with your Kafka broker address

const producer = new kafka.Producer(client, {
  requireAcks: 1, // Ensure that the leader broker acknowledges the message
  ackTimeoutMs: 100, // Set the acknowledgment timeout
  partitionerType: 0, // Default partitioner
  // Enable idempotence settings
  // Note: kafka-node does not support `enableIdempotence` directly.
  // Instead, we handle idempotence by setting reliable configurations.
  retries: 5, // Number of retries on failure
  retryMaxTimeout: 10000, // Max time to retry sending messages
});
producer.on("ready", () => {
  console.log("Kafka Producer is ready");
});

producer.on("error", (err) => {
  console.error("Kafka Producer encountered an error:", err);
});

const sendMessage = (topic, messages) => {
  const payloads = [{ topic, messages }];
  producer.send(payloads, (err, data) => {
    if (err) {
      console.error("Failed to send message:", err);
    } else {
      console.log("Message sent successfully:", data);
    }
  });
};

module.exports = {
  producer,
  sendMessage,
};
