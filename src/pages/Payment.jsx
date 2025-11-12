import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);
const ADMIN = import.meta.env.VITE_ADMIN_API_URL; // e.g. http://localhost:3000 or your Vercel admin URL

export default function Payment() {
  const [clientSecret, setClientSecret] = useState(null);
  const [amount] = useState(800); // $8 for test

  useEffect(() => {
    // create PaymentIntent on your admin API
    fetch(`${ADMIN}/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: "usd" }),
    })
      .then((r) => r.json())
      .then((d) => setClientSecret(d.clientSecret))
      .catch((err) => console.error("Create PI error:", err));
  }, [amount]);

  if (!clientSecret) return <div>Setting up payment…</div>;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: "stripe" },
      }}
    >
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setStatus(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // no browser redirect for test
    });

    if (error) {
      setStatus(`❌ ${error.message}`);
    } else if (paymentIntent) {
      setStatus(`✅ ${paymentIntent.status} — ${paymentIntent.id}`);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handlePay} style={{ maxWidth: 420 }}>
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        style={{ marginTop: 12, padding: "8px 14px" }}
      >
        {loading ? "Processing…" : "Pay $8.00"}
      </button>
      {status && <div style={{ marginTop: 10 }}>{status}</div>}
      <p style={{ fontSize: 12, marginTop: 12 }}>
        Use test card <b>4242 4242 4242 4242</b>, any future exp, any CVC/ZIP.
      </p>
    </form>
  );
}
