require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: { name: 'Produkt 1 zł' },
            unit_amount: 200, // 2 zł = 200 groszy
          },
          quantity: 1,
        }
      ],
      success_url: `http://localhost:4242/success.html`,
      cancel_url: `http://localhost:4242/cancel.html`,
    });

    res.json({ id: session.id });

  } catch (error) {
    console.error("Błąd Stripe:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(4242, () => console.log("Serwer działa pod adresem: http://localhost:4242"));
