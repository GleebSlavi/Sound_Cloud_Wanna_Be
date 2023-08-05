import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import "./subscription_form.css";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import MessageWindow from "../../message_window/MessageWindow";
import { error } from "console";
import axios from "axios";

interface Props {
  clientSecret: string;
}

const SubscriptionForm = ({ clientSecret }: Props) => {
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
          `${process.env.REACT_APP_USERS_ENDPOINT}/${localStorage.getItem(
            "id"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

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
      };

      await axios.patch(
        `${process.env.REACT_APP_USERS_ENDPOINT}/${localStorage.getItem("id")}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message!);
      setIsVisible(true);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {},
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message!);
    } else {
      setPremium();
      setMessage("Payment successful.");
      setRedirect(true);
    }

    setIsVisible(true);
  };

  const options: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    },
  }

  return (
    <div className="container payment-container">
      <div className="button-bar-field subscription-field">
        <div className="container button-bar-header-container">
          <h2 className="button-bar-header subscription-header">Card Info</h2>
        </div>
        <form className="container button-bar-form" onSubmit={handleSubmit}>
          <div className="container subscription-field-container">
            <PaymentElement
              className="card-element"
              options={options}
            />
          </div>
          <div className="container subscription-button-container">
            <button className="button-bar-button">Subscribe</button>
          </div>
        </form>
      </div>
      <MessageWindow
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        message={message}
        profileButtonPage={redirect}
      />
    </div>
  );
};

export default SubscriptionForm;
