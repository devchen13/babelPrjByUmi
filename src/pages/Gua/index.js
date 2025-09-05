import React from "react";
import decimalToBinaryString from "@utils/helper";
import generateTrueRandom from "@utils/generateRadom";
import {
  SIXTY_FOUR_GUA_ENUM_KEY_MAP,
  SIXTY_FOUR_GUA_JICI_ENUM,
} from "@constants";

const Gua = () => {
  const handleClick = () => {
    console.log("起");
    const gua = generateTrueRandom(1, 64);
    const binaryString = decimalToBinaryString(gua);
    const curGua = SIXTY_FOUR_GUA_ENUM_KEY_MAP[binaryString];
    console.log(curGua, SIXTY_FOUR_GUA_JICI_ENUM[curGua.id]);
  };
  
  return (
    <div>
      <div onClick={handleClick}>起</div>
    </div>
  );
};

export default Gua;
