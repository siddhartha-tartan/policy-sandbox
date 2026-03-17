const SuccessUserIcon = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={40}
    viewBox="0 0 48 40"
    fill="none"
    {...props}
  >
    <g filter="url(#filter0_d_4005_26527)">
      <path
        d="M8.92296 9.38492C8.92296 7.09997 9.83065 4.90862 11.4464 3.29292C13.062 1.67722 15.2534 0.769531 17.5383 0.769531C19.8233 0.769531 22.0146 1.67722 23.6303 3.29292C25.246 4.90862 26.1537 7.09997 26.1537 9.38492C26.1537 11.6699 25.246 13.8612 23.6303 15.4769C22.0146 17.0926 19.8233 18.0003 17.5383 18.0003C15.2534 18.0003 13.062 17.0926 11.4464 15.4769C9.83065 13.8612 8.92296 11.6699 8.92296 9.38492ZM2.46143 33.232C2.46143 26.6022 7.83258 21.2311 14.4624 21.2311H20.6143C27.2441 21.2311 32.6153 26.6022 32.6153 33.232C32.6153 34.3359 31.7201 35.2311 30.6162 35.2311H4.46046C3.35662 35.2311 2.46143 34.3359 2.46143 33.232ZM44.5287 12.683L35.9133 21.2984C35.2807 21.9311 34.2576 21.9311 33.6316 21.2984L29.3239 16.9907C28.6912 16.358 28.6912 15.3349 29.3239 14.709C29.9566 14.083 30.9797 14.0763 31.6057 14.709L34.7691 17.8724L42.2403 10.3945C42.873 9.76184 43.896 9.76184 44.522 10.3945C45.148 11.0272 45.1547 12.0503 44.522 12.6763L44.5287 12.683Z"
        fill="url(#paint0_linear_4005_26527)"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_4005_26527"
        x={0.30758}
        y={0.769531}
        width={47.3846}
        height={38.7686}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={2.15385} />
        <feGaussianBlur stdDeviation={1.07692} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0.105324 0 0 0 0 0.203467 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_4005_26527"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_4005_26527"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_4005_26527"
        x1={23.7277}
        y1={0.769531}
        x2={23.7277}
        y2={35.2311}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset={1} stopColor="#B6DCFF" />
      </linearGradient>
    </defs>
  </svg>
);
export default SuccessUserIcon;
