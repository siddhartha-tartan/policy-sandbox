import { chakra } from "@chakra-ui/system";

const CheckedGreenIcon = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0.833008" y="0.5" width="16" height="16" rx="6" fill="#27A376" />
      <path
        d="M5.72266 8.49957L7.94488 10.7218L12.3893 6.27734"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default chakra(CheckedGreenIcon);
