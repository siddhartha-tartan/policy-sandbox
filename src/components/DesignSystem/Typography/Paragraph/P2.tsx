import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function P2(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[16, 24, 400]} {...props} />;
}
