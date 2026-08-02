import React from "react";
import Confetti from "react-confetti";

const CelebrationPage = ({ message, onEnd }) => {
  const { innerWidth: width, innerHeight: height } = window;

  return (
    <div>
      <Confetti width={width} height={height} />
    </div>
  );
};

export default CelebrationPage;
