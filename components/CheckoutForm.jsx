import React, { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements, AddressElement } from "@stripe/react-stripe-js";
import { getBaseUrl } from "nextjs-url";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player";

export default function CheckoutForm({ amount, description }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const baseUrl = getBaseUrl().href;

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${baseUrl}/thankyou`,
      },
    });

    // This point will only be reached if there is an immediate error when confirming the payment.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
    paymentMethodOrder: ["card", "apple_pay", "google_pay"],
  };

  // if () {
  //   return <Player autoplay loop src="https://assets8.lottiefiles.com/packages/lf20_okD3jdAzed.json" style={{ height: "150px", width: "150px" }}></Player>;
  // }

  return (
    <form className="w-screen sm:w-[512px] max-w-lg  p-5 rounded-lg overflow-y" onSubmit={handleSubmit}>
      {enabled ? (
        <div className=" bg-[#2D3139] my-5 p-3 rounded-lg  divide-y divide-yellow-500 space-y-2">
          <div>
            <h1 className="text-base font-bold sm:font-normal sm:text-lg">{description ? "Payment for " + description : "No services selected..."} </h1>
          </div>
          <div className="flex items-center justify-between pt-2">
            <h1 className="text-base">{amount && description ? `Total: $${amount}` : "Total: $0.00"}</h1>
            <h1 className="text-xs">{amount && description ? `Payable to ${process.env.NEXT_PUBLIC_USER}` : null}</h1>
          </div>
        </div>
      ) : null}

      {/* <AddressElement options={{ mode: "billing" }} /> */}

      <PaymentElement options={paymentElementOptions} onReady={() => setEnabled(true)} />

      <div className="relative text-red-500 italic top-2 text-sm">{message && <span>{message}</span>}</div>

      {enabled ? (
        <>
          <button className="bg-yellow-500 text-white font-bold  h-[40px] w-full mt-4 rounded-lg" disabled={isLoading || !stripe || !elements}>
            <span id="button-text">{isLoading ? <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 rounded-full" /> : "Pay now"}</span>
          </button>
          <div className="text-xs pt-3 float-right flex space-x-[0.35rem]">
            <p className=" ">Powered By</p>
            <Image src="/img/stripe.png" height={10} width={38} alt="Stripe logo" />
          </div>
        </>
      ) : null}
    </form>
  );
}
