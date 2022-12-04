import React, { useEffect, useState } from "react";
import Head from 'next/head'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from 'next/router'
import axios from "axios";

import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Home() {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState("0")
  const [description, setDescription] = useState("")



  useEffect(() => {
    if (!router.isReady) return;
    setAmount(router.query.amount)
    setDescription(router.query.description)

  }, [router.isReady, router.query, amount]);

  useEffect(() => {
    axios.post('/api/create-payment-intent', {
      amount
    })
      .then(async (res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.log(err.message);
        return {error: {message: err.message}};
      });

  }, [amount]);

  const itemData = {
    amount,
    description
  }


  const appearance = {
    theme: 'none',
    variables: {
      colorPrimary: '#EAB308',
      fontFamily: ' "Gill Sans", sans-serif',
      fontLineHeight: '1.5',
      borderRadius: '10px',
      colorBackground: '#2C313A',
      colorText: '#ffffff',
      colorDanger: '#EF4444',
    },
    rules: {
      '.Input:focus': {
        outline: '0px solid transparent',
        boxShadow:' 0 0 0 1px var(--colorPrimary)',
        transition: 'box-shadow .5s'
      },
      '.CheckboxInput':{
        border: '1px solid var(--colorPrimary)',
      }
    }
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="p-10 flex flex-col items-center justify-center h-[100svh] sm:h-screen text-white bg-[#282C34]">
      <Head>
        <title>Payment Gateway</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#282C34"></meta>
      </Head>

      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm {...itemData} />
        </Elements>
      )}
    </div>
  );
}
