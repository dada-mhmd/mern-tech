import { Stripe } from 'stripe';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeUtils = (app) => {
  app.post('/create-checkout-session', async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: req.body.map((item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.qty,
        })),
        success_url: `${process.env.CLIENT_URL}success-screen`,
        cancel_url: `${process.env.CLIENT_URL}/place-order`,
      });
      res.json({ url: session.url });
    } catch (error) {
      console.log(error.message);
      res.status(500);
      throw new Error(error.message);
    }
  });
};

export default stripeUtils;
