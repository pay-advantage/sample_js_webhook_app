# Pay Advantage Setup Project

Hi! It's great that you have chosen Pay Advantage for your payment provider for application integration. This is a sample project that will help you get started quickly. Since this is a sample project there are some things that you will be required to implement. 

 1. Storing webhook data in a database
 2. Ensuring the webhook secrets are stored in a safe location
 3. Storing data received in a database such as customers and payment links

This application is written in Node.js running on express. It is designed to show how our Pay Advantage API's are easy to use and get you developing faster. This example also shows how to set up and register webhooks. Webhooks are great for receiving updates on the progress of your payments. It allows Pay Advantage to send the updates directly to your server.

# Structure

 - src
	 - middleware 
		 - my-authentication.js (This is the file to add your own application's authentication)
		 - pa-authentication.js (This is the file that allows you to store the Pay Advantage token and will also update the token when expired)
	 - routes
		 - customer.js (This is the file for taking customer requests and creating a customer in Pay Advantage)
		 - payment-request.js (This is the file for taking payment requests and creating a payment request in Pay Advantage)
		 - webhook.js (This is the file for receiving webhooks sent by Pay Advantage)
	 - webhook
		 - setUpWebhook.js (This file help you understand how to set up webhooks, to receive updates from Pay Advantage)
		 - webhookSecrets.js (This is the file that will store the webhook secret key. It should be replaced by a database in your application)
	 - app.js (This is the root file which loads the server and the routes for this application)
 - .env


## Getting Started

 1. Download this repository on your local server 
 2. Run `npm install` to install the NPM repositories
 3. Update the .env file with your `API_USERNAME` and `API_PASSWORD` [Need help setting these up?](https://help.payadvantage.com.au/hc/en-us/articles/203572556-Setup-Authentication)
 4. Run `npm start` to run the server
 5. The server will wait 15 seconds and start to receive the webhook registration. Once the webhooks are registered you are able to create customers and payment requests. You will receive a webhook event when a customer is created or a payment is completed. (There are no webhook requests for creating the payment request, the link needs to be followed and completed before the webhook is sent)

## Using the API

WARNING: With the sample project the my-authetication.js fie is only a proxy so there is no authentication required. You need to implement authentication in your application to ensure unauthorized people cannot use your application.

### Customers API

To create a customer send a request to your server. If you are running this locally, it will be http://localhost:3000

   {
        "email": "mj@mj.com",
	    "firstName": "michael",
	    "lastName": "jordan",
	    "phoneNumber": "0400000000"
   }

This creates a very basic customer. In the file customer.js you will see that some of the fields are defaulted such as CountryISO. Refer to [Customer documentation](https://help.payadvantage.com.au/hc/en-us/articles/360000279455-Customers-BPAY-Reference) for more detail on the available fields when creating a customer.
 

### Payment Request API

To create a payment request link for a customer send a request to your server. If you are running this locally, it will be http://localhost:3000

  {
	"customerCode":"SQPN6A",
	"description":"This is a payment description",
	"externalID":"ABC123",
	"amount":"39.90"
}

This creates a very basic payment. In the file payment.js you will see that some of the fields are defaulted such sendintialLink. This is a handy feature as your customer will instantly receie an email and SMS asking them for the payment, however, you may prefer to share the link yourself, in which case this field will need to be set to false. Refer to [Payment request documentation](https://help.payadvantage.com.au/hc/en-us/articles/4453569613967-Payment-Request-Links) for more detail on the available fields when creating a payment request.


### Webhooks

To receive a webhook to your server. Simply create a customer, or complete a payment request link. More information on testing cards are found [here](https://help.payadvantage.com.au/hc/en-us/articles/360000408995-Sandbox-Testing): 
This example writes the output of the webhook to the console. For best practice you should write the webhook information to your database and then respond with a 202 success. If the webhook endpoint a different response that is not a success response then it will try to send the webhooks again.
This example also deletes old webhooks when it is stopped and started. Storing the webhook secret will allow you to start and stop the server without needing to create a new webhook endpoint. 
Refer to [Webhook documentation](https://help.payadvantage.com.au/hc/en-us/articles/360002909095-Webhooks) for more detail.

