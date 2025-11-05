import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_12345"); // Replace with your Stripe publishable key

function CheckoutForm({ onApproved }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    // Simulate payment approval
    if (onApproved) onApproved();
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe} className="mt-4 px-4 py-2 bg-lime-600 text-white rounded">Pay</button>
    </form>
  );
}

export default function StripeDemoForm({ onApproved }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onApproved={onApproved} />
    </Elements>
  );
}
