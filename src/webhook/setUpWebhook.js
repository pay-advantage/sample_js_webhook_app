const express = require('express');
const axios = require('axios');
const { login } = require('../middleware/pa-authentication');
const app = express();
const { setWebhookSecret } = require('./webhookSecret');
require('dotenv').config();

async function registerWebhook() {
    try {

        const token = await login();

        if (token !== undefined) {
            const currentWebhooks = await axios.get(`${process.env.API_URL}/v3/webhook_endpoints`, {
                headers: { 'Authorization': `${token.tokenType} ${token.authToken}` }
            });

            
            //This deletes existing webhooks so a new one is generated.
            //This is due to the webhook secret being stored in memory
            //You need to store this webhook secret in your database

            if (currentWebhooks.data.Records.length > 0) {
                currentWebhooks.data.Records.forEach(async (webhook) => {
                    await axios.delete(`${process.env.API_URL}/v3/webhook_endpoints/${webhook.Code}`, {
                        headers: { 'Authorization': `${token.tokenType} ${token.authToken}` }
                    })
                })

            }

            const payload = {
                "Url": 'http://localhost:3000/webhook'
            }

            const response = await axios.post(`${process.env.API_URL}/v3/webhook_endpoints`, payload, {
                headers: { 'Authorization': `${token.tokenType} ${token.authToken}` }
            });

            //The secret needs to be stored in your application database. 
            //Since there is no database wired up this service is adding it to a local store;
            setWebhookSecret(response.data.Secret);
            console.log(response.data.Secret);

            return response.data;
        } else {
            throw new Error('Cannot login to Pay Advantage API')
        }




    } catch (error) {
        console.error('Failed to register webhook.', error);
    }
}

module.exports = {
    registerWebhook
};