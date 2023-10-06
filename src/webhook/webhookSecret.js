let WEBHOOK_SECRET = null;

function setWebhookSecret(secret) {
  WEBHOOK_SECRET = secret;
}

function getWebhookSecret() {
  return WEBHOOK_SECRET;
}

module.exports = {
  setWebhookSecret,
  getWebhookSecret
};