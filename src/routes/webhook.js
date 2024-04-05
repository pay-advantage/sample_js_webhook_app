const express = require('express');
const app = express();
require('dotenv').config();
const crypto = require('crypto');
const {getWebhookSecret} = require('../webhook/webhookSecret');

const router = express.Router();
router.use(express.json());

function validateWebhookSchema(item){
  return item.hasOwnProperty("Code") && item.hasOwnProperty("DateCreated") && item.hasOwnProperty("DateUpdated")  && item.hasOwnProperty("Event") && item.hasOwnProperty("Status") && item.hasOwnProperty("ResourceCode") && item.hasOwnProperty("ResourceUrl") && item.hasOwnProperty("MerchantCode") && item.hasOwnProperty("EndpointCode") && item.hasOwnProperty("EndpointUrl")
}

function computeHMAC(rawContent, secret) {

    const contentBytes = Buffer.from(rawContent, 'utf8');
    const hmac = crypto.createHmac('sha256', secret);
    const hash = hmac.update(contentBytes).digest();
    return hash.toString('base64');
  }

router.post('/', async (req, res) => {

    const secret = `${getWebhookSecret()}`;
    const hmac = crypto.createHmac('sha256', secret);

      hmac.update(JSON.stringify(req.body));
      const hmacSignature = computeHMAC(JSON.stringify(req.body), secret);
      console.log(`Signatures should match = ${req.headers['x-payadvantage-signature']} & ${hmacSignature}`);

      if (!req.body || req.body ===  null || req.body.length === 0){
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end();
      } else if (!req.headers['x-payadvantage-signature'] || req.headers['x-payadvantage-signature'] === ""){
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end();
       } else if (req.body.filter(item => validateWebhookSchema(item)).length !== req.body.length) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end();
      } else if (req.headers['x-payadvantage-signature'] !== hmacSignature){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'text/plain');
        res.end();
      } else {
        // Handle the data from the webhook here
        console.log('Webhook data: ',req.body);
        res.statusCode = 202;
        res.setHeader('Content-Type', 'text/plain');
        res.end();
      }
      
    //});
});

module.exports = router;    
