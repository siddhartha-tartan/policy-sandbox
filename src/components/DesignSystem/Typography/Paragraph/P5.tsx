import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function P5(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[10, 12, 400]} {...props} />;
}
