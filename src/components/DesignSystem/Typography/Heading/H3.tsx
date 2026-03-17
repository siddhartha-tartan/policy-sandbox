import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function H3(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[18, 26, 500]} {...props} />;
}
