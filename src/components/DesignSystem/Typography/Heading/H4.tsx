import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function H4(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[16, 24, 500]} {...props} />;
}
