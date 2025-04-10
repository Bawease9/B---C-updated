require('dotenv').config(); // this loads the .env variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { amount, song1, song2, name, dedication } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Tip for song request: ${song1 || ''} / ${song2 || ''}`,
              description: dedication || 'No dedication',
            },
            unit_amount: amount * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://brady-and-caroline-requests.netlify.app/thankyou.html',
      cancel_url: 'https://brady-and-caroline-requests.netlify.app/index.html',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    };
  }
};

