import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function P4(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[12, 18, 400]} {...props} />;
}
