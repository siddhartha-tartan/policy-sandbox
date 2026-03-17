import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function H2(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[20, 28, 500]} {...props} />;
}
