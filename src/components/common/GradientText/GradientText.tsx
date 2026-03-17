import React from "react";

interface GradientTextProps extends React.HTMLProps<HTMLSpanElement> {
  text: string;
  gradient: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  text,
  gradient,
  ...props
}) => {
  const gradientStyle = {
    background: gradient,
    WebkitBackgroundClip: "text",
    color: "transparent",
    display: "inline",
  };

  return (
    <span style={gradientStyle} {...props}>
      {text}
    </span>
  );
};

export default GradientText;
