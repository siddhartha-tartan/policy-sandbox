const MessageIconSVG = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_2729_415)">
      <path
        d="M2.5 4.375H17.5V15C17.5 15.1658 17.4342 15.3247 17.3169 15.4419C17.1997 15.5592 17.0408 15.625 16.875 15.625H3.125C2.95924 15.625 2.80027 15.5592 2.68306 15.4419C2.56585 15.3247 2.5 15.1658 2.5 15V4.375Z"
        stroke="url(#paint0_linear_2729_415)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 4.375L10 11.25L2.5 4.375"
        stroke="url(#paint1_linear_2729_415)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_2729_415"
        x1={2.5}
        y1={2.8125}
        x2={28.1917}
        y2={5.87609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3762DD" />
        <stop offset={1} stopColor="#1D3577" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2729_415"
        x1={2.5}
        y1={3.42014}
        x2={27.6013}
        y2={8.31808}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3762DD" />
        <stop offset={1} stopColor="#1D3577" />
      </linearGradient>
      <clipPath id="clip0_2729_415">
        <rect width={20} height={20} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default MessageIconSVG;
