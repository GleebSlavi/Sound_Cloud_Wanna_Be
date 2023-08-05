import axios from "axios";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import SubscriptionForm from "./subscription_form/SubscriptionForm";
import MessageWindow from "../message_window/MessageWindow";

const SubscriptionSection = () => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    (async () => {
      try {
      const data = {
        stripeSecretKey: process.env.REACT_APP_STRIPE_SECRET_API_KEY!
      }

      const response = await axios.post(
        `${process.env.REACT_APP_PAYMENTS_ENDPOINT}`,
        data,
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        }
      });

      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.log(error);
    }
  })();
}, []);

const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: 'rgb(70, 0, 70)',
    borderRadius: '5px',
    colorDanger: 'rgb(70, 0, 70)',
    fontFamily: 'Press Start 2P'
  },
  rules: {
    '.Label': {

    }
  }
};

const options: StripeElementsOptions = {
  clientSecret,
  appearance,
};

  return (
    <section className="section subscription-section">
      {clientSecret && 
        <Elements options={options} stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_API_KEY!)}>
          <SubscriptionForm clientSecret={clientSecret}/>
        </Elements>
      } 
    </section>
  )
}

export default SubscriptionSection;