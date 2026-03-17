import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function D4(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[18, 26, 600]} {...props} />;
}
