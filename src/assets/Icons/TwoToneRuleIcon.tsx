import { chakra } from "@chakra-ui/system";

const TwoToneRuleIcon = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.7837 9.1651L10.8337 6.2151L12.0087 5.0401L13.7753 6.80677L17.3087 3.27344L18.4837 4.44844L13.7837 9.1651ZM9.16699 5.83177H1.66699V7.49844H9.16699V5.83177ZM17.5003 11.1734L16.3253 9.99844L14.167 12.1568L12.0087 9.99844L10.8337 11.1734L12.992 13.3318L10.8337 15.4901L12.0087 16.6651L14.167 14.5068L16.3253 16.6651L17.5003 15.4901L15.342 13.3318L17.5003 11.1734ZM9.16699 12.4984H1.66699V14.1651H9.16699V12.4984Z"
        fill="black"
      />
    </svg>
  );
};

export default chakra(TwoToneRuleIcon);
