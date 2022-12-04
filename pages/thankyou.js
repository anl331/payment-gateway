import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Player } from "@lottiefiles/react-lottie-player";

function Thankyou() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    // router.replace("/thankyou", undefined, { shallow: true })
  }, [router, router.isReady])

  return <div className="flex justify-center items-center h-[100svh] sm:h-screen">
    <Player
      autoplay
      keepLastFrame
      src="https://lottie.host/ba779155-bd2f-459f-bd04-edb2a6fc02fb/IsKgFNVTsc.json"
      style={{ height: '600px', width: '600px' }}
    ></Player>
  </div>;
}

export default Thankyou;
