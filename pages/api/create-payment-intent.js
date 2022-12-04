const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);


export default async function handler(req, res) {
  const { amount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  try {
	  const paymentIntent = await stripe.paymentIntents.create({
	    amount: amount ? `${amount}00` : 1, 
	    currency: "usd",
	    automatic_payment_methods: {
	      enabled: true,
	    },
	  });
	
	  res.send({
	    clientSecret: paymentIntent.client_secret,
	  });   
} catch (err) {
  console.log(err);
	return  {error: { message: err.message }}
}
};