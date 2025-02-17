import React from "react";

const LoadingDots = () => {

  const text = "...";
  const letters = text.split("");
  const totalLetters = letters.length;
  const delayPerLetter = 1 / totalLetters; // Calculate delay per letter

  return (
    <div>
      <span>
        Loading
        {letters.map((letter, index) => (
          <LetterWave
            key={index}
            index={index}
            delayPerLetter={delayPerLetter}
            char={letter}
          />
        ))}
      </span>
    </div>
  );
};

const LetterWave = ({ index, delayPerLetter, char }) => {
  const waveStyle = {
    display: "inline-block",
    animation: `letterWave 1s infinite`,
    animationDelay: `${index * delayPerLetter}s`,
    marginLeft: "2px",
  };

  return <span style={waveStyle}>{char}</span>;
};

const letterWave = `
@keyframes letterWave {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.2rem);
  }
  100% {
    transform: translateY(0);
  }
}
`;

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(letterWave, styleSheet.cssRules.length);

export default LoadingDots;
