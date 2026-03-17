const AIAgentIcon = ({ ...props }) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Robot head / AI Agent */}
    <rect
      x="4"
      y="6"
      width="16"
      height="14"
      rx="3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Antenna */}
    <path
      d="M12 6V3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="2" r="1" fill="currentColor" />
    {/* Left eye */}
    <circle cx="9" cy="12" r="1.5" fill="currentColor" />
    {/* Right eye */}
    <circle cx="15" cy="12" r="1.5" fill="currentColor" />
    {/* Mouth/speaker grille */}
    <path
      d="M8 16.5H16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Side panels */}
    <path
      d="M4 10H2.5C2.22386 10 2 10.2239 2 10.5V13.5C2 13.7761 2.22386 14 2.5 14H4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 10H21.5C21.7761 10 22 10.2239 22 10.5V13.5C22 13.7761 21.7761 14 21.5 14H20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AIAgentIcon;

