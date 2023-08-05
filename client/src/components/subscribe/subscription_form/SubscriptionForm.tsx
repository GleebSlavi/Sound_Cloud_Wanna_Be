import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import "./subscription_form.css"
import { StripeCardElementOptions } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import MessageWindow from "../../message_window/MessageWindow";
import { error } from "console";
import axios from "axios";

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
        const response = await axios.get(
          `${process.env.REACT_APP_USERS_ENDPOINT}/${localStorage.getItem("id")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )

        if (response.data.isPremium) {
          setMessage("You are already a premium user!");
          setRedirect(true);
          setIsVisible(true);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const setPremium = async () => {
    try {
      const data = {
        isPremium: true,
      }

      await axios.patch(
        `${process.env.REACT_APP_USERS_ENDPOINT}/${localStorage.getItem("id")}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!
      }
    });
    
    const error = payload.error;
    if (payload.paymentIntent?.status === "succeeded") {
      setPremium();
      setMessage("Payment successful!");
      setRedirect(true);

    } else if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message!);
    } else {
      setMessage("")
    }

    setIsVisible(true);
  };

  const cardElementOptions: StripeCardElementOptions = {
    style: {
      
    }
  }

  return (
    <div className="container subscription-field">
      <form className="container subscription-form" onSubmit={handleSubmit}>
        <div className="container subscription-field-container">
          <CardElement className="card-element" />
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
