import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function D1(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[32, 40, 600]} {...props} />;
}
