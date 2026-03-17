const ViewPolicySVG = ({ ...props }) => (
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
      fill="url(#paint0_linear_668_9274)"
      fillOpacity={0.1}
    />
    <path
      d="M17.3538 9.14625L13.8538 5.64625C13.8073 5.59983 13.7521 5.56303 13.6914 5.53793C13.6307 5.51284 13.5657 5.49995 13.5 5.5H7.5C7.23478 5.5 6.98043 5.60536 6.79289 5.79289C6.60536 5.98043 6.5 6.23478 6.5 6.5V17.5C6.5 17.7652 6.60536 18.0196 6.79289 18.2071C6.98043 18.3946 7.23478 18.5 7.5 18.5H16.5C16.7652 18.5 17.0196 18.3946 17.2071 18.2071C17.3946 18.0196 17.5 17.7652 17.5 17.5V9.5C17.5001 9.43432 17.4872 9.36927 17.4621 9.30858C17.437 9.24788 17.4002 9.19272 17.3538 9.14625ZM14 7.20688L15.7931 9H14V7.20688ZM16.5 17.5H7.5V6.5H13V9.5C13 9.63261 13.0527 9.75979 13.1464 9.85355C13.2402 9.94732 13.3674 10 13.5 10H16.5V17.5Z"
      fill="url(#paint1_linear_668_9274)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_668_9274"
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
        id="paint1_linear_668_9274"
        x1={6.5}
        y1={3.69445}
        x2={25.4997}
        y2={5.13223}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3762DD" />
        <stop offset={1} stopColor="#1D3577" />
      </linearGradient>
    </defs>
  </svg>
);
export default ViewPolicySVG;
