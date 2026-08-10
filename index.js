require("dotenv").config();
const axios = require("axios");

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/orbit-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/orbit-ping - Check bot latency
/orbit-catfact - Get a cat fact
/orbit-joke - Get a joke from Orbit
/orbit-delayed-ping - delayes the ping to orbit by a set amount in ms`
  });
});

app.command("/orbit-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/orbit-delayed-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  const pingDelay = parseInt(command.text, 10);
  if(isNaN(pingDelay)) 
    {
      return respond('Please provide a valid number.');
    }
  await delay(pingDelay);
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/orbit-random-int", async ({ command, ack, respond }) => {
  await ack();
  const Number = parseInt(command.text, 10);
  await respond({ text: `Your number is: ${(Math.random() * Number)}` });
});

app.command("/orbit-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/orbit-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();