import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function P1(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[18, 26, 400]} {...props} />;
}
