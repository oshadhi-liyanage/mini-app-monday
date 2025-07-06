import React from "react";
import { Wheel } from "react-custom-roulette";

const data = [
  { option: "0", style: { backgroundColor: "green", textColor: "black" } },
  { option: "1", style: { backgroundColor: "white" } },
  { option: "2" },
];

export default function Routte() {
  return (
    <>
      <Wheel
        mustStartSpinning={true}
        prizeNumber={1}
        data={data}
        backgroundColors={["#3e3e3e", "#df3428"]}
        textColors={["#ffffff"]}
      />
    </>
  );
}
