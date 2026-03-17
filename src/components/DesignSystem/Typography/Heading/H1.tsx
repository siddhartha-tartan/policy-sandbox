import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function H1(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[24, 32, 500]} {...props} />;
}
