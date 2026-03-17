import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function D6(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[14, 20, 600]} {...props} />;
}
