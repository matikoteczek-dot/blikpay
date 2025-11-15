const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.static('public'));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { price = 4900, name = 'Produkt' } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // na start tylko 'card'
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: { name },
            unit_amount: price
          },
          quantity: 1
        }
      ],
      success_url: 'https://blik-pay.onrender.com',
      cancel_url: 'https://blik-pay.onrender.com'
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd tworzenia sesji na stronie', details: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
