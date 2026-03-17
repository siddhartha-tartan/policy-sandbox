const ModifySVG = ({ ...props }) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx={12}
      cy={12}
      r={12}
      fill="url(#paint0_linear_668_9283)"
      fillOpacity={0.1}
    />
    <path
      d="M6.66669 16.8334V15.1534L15.4534 6.35876C15.5222 6.29787 15.5978 6.25076 15.68 6.21742C15.7622 6.18409 15.8482 6.1672 15.938 6.16676C16.0278 6.16631 16.1145 6.18054 16.198 6.20942C16.2825 6.23742 16.3602 6.28809 16.4314 6.36142L17.1427 7.07742C17.216 7.14809 17.2662 7.22587 17.2934 7.31076C17.32 7.3952 17.3334 7.47965 17.3334 7.56409C17.3334 7.65476 17.3182 7.74142 17.288 7.82409C17.2574 7.90631 17.2089 7.98165 17.1427 8.05009L8.34602 16.8334H6.66669ZM15.6694 8.55942L16.6667 7.57409L15.926 6.83342L14.9414 7.83076L15.6694 8.55942Z"
      fill="url(#paint1_linear_668_9283)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_668_9283"
        x1={-1.48881e-7}
        y1={-3.33333}
        x2={41.3605}
        y2={0.365661}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3762DD" />
        <stop offset={1} stopColor="#1D3577" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_668_9283"
        x1={6.66669}
        y1={4.68527}
        x2={25.0491}
        y2={6.32926}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3762DD" />
        <stop offset={1} stopColor="#1D3577" />
      </linearGradient>
    </defs>
  </svg>
);
export default ModifySVG;
