import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function D5(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[16, 24, 600]} {...props} />;
}
