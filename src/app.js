const express = require('express');
const app = express();
const customerRoute = require('./routes/customer');
const webhookRoute = require('./routes/webhook');
const paymentRequestRoute = require('./routes/payment-request');
const {authenticate} = require('./middleware/my-authentication');
const {registerWebhook}= require('./webhook/setUpWebhook');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(authenticate);

app.use(
  express.json({
    limit: '5mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use('/customer', customerRoute);
app.use('/webhook', webhookRoute);
app.use('/payment-request', paymentRequestRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

registerWebhook();

