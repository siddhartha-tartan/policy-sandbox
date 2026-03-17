import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function P3(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[14, 20, 400]} {...props} />;
}
