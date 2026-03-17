import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function D2(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[24, 32, 600]} {...props} />;
}
