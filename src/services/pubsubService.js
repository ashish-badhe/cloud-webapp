import { PubSub } from "@google-cloud/pubsub";

export async function pubsubService(pubsubData, topicId, subscriptionId) {
  const pubsub = new PubSub();

  let [topic] = await pubsub.topic(topicId).exists();
  if (!topic) {
    [topic] = await pubsub.createTopic(topicId);
  }

  const fetchedTopic = pubsub.topic(topicId);

  let [subscription] = await pubsub.subscription(subscriptionId).exists();
  if (!subscription) { 
    [subscription] = await fetchedTopic.createSubscription(subscriptionId);
  }

  const fetchedSubscription = pubsub.subscription(subscriptionId);
  fetchedSubscription.on("message", (message) => {
    console.log("Received message:", message.data.toString());
  });

  fetchedSubscription.on("error", (error) => {
    console.error("Received error:", error);
  });

  // Send a message to the topic
  fetchedTopic.publishMessage({ data: pubsubData });
}
