const kafka = require("kafka-node");

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" }); // Replace with your Kafka broker address

const producer = new kafka.Producer(client);

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
