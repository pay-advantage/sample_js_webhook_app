const express = require('express');
const axios = require('axios');
const { authenticate } = require('../middleware/pa-authentication');

const router = express.Router();
router.use(express.json());

router.post('/', authenticate, async (req, res) => {
    try {
        
        const payload = {
            "Customer":{"Code":req.body.customerCode},
            "Description":req.body.description,
            "ExternalID":req.body.externalID,
            "Amount":req.body.amount,
            "OnchargeFees":true,
            "ExpiryDays":30,
            "PaymentOptions":["credit_card"], 
            "SendInitialLink":true, 
            "SendReminders":true
          }
        const response = await axios.post(`${process.env.API_URL}/v3/payment_requests`, payload, {
            headers: {'Authorization': req.headers.Authorization}
        });

        //You may like to store the payment information in your own database here.
        //The reponse will contain a Links.Url URL where your customer is invited to pay the requested amount via Credit Card

        res.json(response.data);
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to create payment link.' });
    }
});

module.exports = router;    