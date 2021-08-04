const express = require("express");
const Dialogflow = require("@google-cloud/dialogflow");
const { v4: uuid } = require("uuid");
const Path = require("path");
const { cleanUpSingle, cleanUpMultiple, parsePossibleFollowUp } = require("./utils/parseDialogFlow");

const app = express();

app.post("/message", async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    const err = new Error("Message is required");
    err.status = 400;
    next(err);
  }

  const sessionClient = new Dialogflow.SessionsClient({
    keyFilename: Path.join(__dirname, "./key.json"),
  });

  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.PROJECT_ID,
    uuid()
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "en",
      },
    },
  };

  try {
    const clientResponses = await sessionClient.detectIntent(request);

    const preferredClientResponse = clientResponses[0];

    const response = {
      queryText: preferredClientResponse.queryResult.queryText,
      response:
        preferredClientResponse.queryResult.fulfillmentMessages.length === 1
          ? [cleanUpSingle(preferredClientResponse)]
          : cleanUpMultiple(preferredClientResponse),
      followUp: parsePossibleFollowUp(preferredClientResponse),
    };

    res.status(200).send({ ...response });
  } catch (e) {
    res.status(400).send({ e });
  }
});

module.exports = app;
