import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./subscription_form.css"
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import MessageWindow from "../../message_window/MessageWindow";

interface Props {
  clientSecret: string;
}

const SubscriptionForm = ({
  clientSecret,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!stripe || !clientSecret) {
          return;
        }

        const { paymentIntent } = await stripe.retrievePaymentIntent(
          clientSecret
        );
        switch (paymentIntent?.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            console.log("1");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            console.log("2");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            console.log("3");
            break;
          default:
            setMessage("Something went wrong.");
            console.log("4");
            break;
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [stripe, clientSecret]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "if_required",
      },
    });
    

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message!); 
    } else {
      setMessage("Payment successful");
      setRedirect(true);
    }

    setIsVisible(true);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs"
  }

  return (
    <div className="container subscription-field">
      <form className="container subscription-form" onSubmit={handleSubmit}>
        <div className="container subscription-field-container">
          <PaymentElement className="payment-element" options={paymentElementOptions}/>
        </div>
        <div className="container subscription-button-container">
          <button className="button-bar-button subscription-button">Subscribe</button>
        </div>
      </form>
      <MessageWindow isVisible={isVisible} setIsVisible={setIsVisible} message={message} profileButtonPage={redirect} />
    </div>
  );
};

export default SubscriptionForm;
