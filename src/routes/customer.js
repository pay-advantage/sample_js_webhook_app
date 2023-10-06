const express = require('express');
const axios = require('axios');
const { authenticate } = require('../middleware/pa-authentication');

const router = express.Router();
router.use(express.json());

router.post('/', authenticate, async (req, res) => {
    try {
        const payload = {
            "IsConsumer": true,
            "Email": req.body.email,
            "FirstName": req.body.firstName,
            "LastName": req.body.lastName,
            "MobileNumber": {
                "CountryISO": "AU", //This assumes you only have Australian customers
                "Number": req.body.phoneNumber
            }
        }
        const response = await axios.post(`${process.env.API_URL}/v3/customers`, payload, {
            headers: {'Authorization': req.headers.Authorization}
        });

        //You may like to store the customer information in your own database here.

        res.json(response.data);
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch data.' });
    }
});

router.get('/', authenticate, async (req, res) => {
    try {
        const searchCode = req.params.code
        const response = await axios.get(`${process.env.API_URL}/customers/${searchCode}`,{
            headers: req.headers.Authorization
        });
        res.json(response.data);
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch data.' });
    }
});

module.exports = router;    