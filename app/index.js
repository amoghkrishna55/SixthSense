import React, { useState } from "react";
import Client from "./client";
import { Admin } from "./admin";
import { Check } from "./check";
import Toast from "react-native-toast-message";

export default function App() {
  const [isClient, setIsClient] = useState(false);
  return (
    <>
      {isClient === null ? (
        <Check setIsClient={setIsClient} />
      ) : isClient ? (
        <Client setIsClient={setIsClient} />
      ) : (
        <Admin setIsClient={setIsClient} />
      )}
      <Toast />
    </>
  );
}
