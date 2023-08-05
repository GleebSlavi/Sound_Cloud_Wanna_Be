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
  theme: 'flat',
  variables: {
    fontFamily: 'Press Start 2P',
    fontSizeBase: '16px',
    colorDanger: 'rgb(100, 0, 100)',
    colorWarning: 'rgb(100, 0, 100)',
    spacingGridRow: "20px"
  },
  rules: {
    '.Input::placeholder': {
      color: 'black',
      fontSize: '1.3rem',
    },
    '.Input': {
      color: 'black',
      border: '2px solid darkmagenta',
      textIndent: '2px',
      fontSize:  '1.3rem',
    },
    '.Input:hover': {
      boxShadow: '1px 1px 5px rgba(70, 0, 70, 0.6)',
      borderWidth: '3px'
    },
    '.Input:focus::placeholder': {
      color: 'transparent'
    },
    '.Label': {
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    '.Error': {
      fontSize: '1.3rem',
      fontWeight: 'bold',
    },
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