import { useState } from "react";
import yayJpg from "../assets/yay.jpg";
import testFun from "./test";

export default function HomePage() {
  const [state, setState] = useState("");
  return (
    <div>
      <h2
        onClick={() => {
          console.log("hello world");
          setState(testFun());
        }}
      >
        Yay! Welcome to umi!
      </h2>
      <p>
        <img src={yayJpg} width="388" />
      </p>
      <p>
        To get started, edit <code>pages/index.tsx</code> and save to reload.
      </p>

      <div>{state || ""}</div>
    </div>
  );
}
