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
      src="https://assets4.lottiefiles.com/packages/lf20_VKF83wmv1k.json"
      style={{ height: '600px', width: '600px' }}
    ></Player>
  </div>;
}

export default Thankyou;
