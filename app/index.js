import React, { useState } from "react";
import Client from "./client";
import { Admin } from "./admin";
import { Check } from "./check";

export default function App() {
  const [isClient, setIsClient] = useState(null);
  return isClient === null ? (
    <Check setIsClient={setIsClient} />
  ) : isClient ? (
    <Client setIsClient={setIsClient} />
  ) : (
    <Admin setIsClient={setIsClient} />
  );
}
