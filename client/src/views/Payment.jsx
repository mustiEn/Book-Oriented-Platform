import React, { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

const Payment = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const isFetched = useRef(false);
  const pk =
    "pk_test_51Ql7I6HBAbJebqsaIs1iGyq45FEAQKG2PaoCa0MS5xwBSyTuZctrg6xrByrFGTj4nZqsGWM8Q6F2Jfw2KYLeb5XQ00l7RZTTSV";
  const appearance = {
    theme: "night",
  };
  const loader = "auto";

  useEffect(() => {
    setStripePromise(loadStripe(pk));
  }, []);

  useEffect(() => {
    console.log("sds", isFetched);

    if (isFetched.current) return;
    isFetched.current = true;

    (async () => {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      console.log(clientSecret);
    })();
    console.log("client secret got");
  }, []);
  return (
    <>
      <div>Payment</div>
      {clientSecret && stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance, loader }}
        >
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default Payment;
