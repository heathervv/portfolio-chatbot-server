const cleanUpSingle = (response) =>
  response.queryResult.fulfillmentMessages[0].text.text[0];

const cleanUpMultiple = (response) => {
  const initialValues = response.queryResult.fulfillmentMessages[1].payload.fields.response.listValue.values;

  return initialValues.map((value) => value.stringValue);
};

const parsePossibleFollowUp = (response) => {
  const hasDetailedResponse = response.queryResult.fulfillmentMessages[1];
  const moreOptions = hasDetailedResponse ? response.queryResult.fulfillmentMessages[1].payload.fields.moreOptions : null;

  if (!moreOptions) return null;

  return moreOptions.listValue.values.map((value) => value.stringValue);
}

module.exports = {
  cleanUpSingle,
  cleanUpMultiple,
  parsePossibleFollowUp,
};
