import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function D3(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[20, 28, 600]} {...props} />;
}
