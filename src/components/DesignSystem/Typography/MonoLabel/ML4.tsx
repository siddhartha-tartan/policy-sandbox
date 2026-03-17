import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function ML4(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[12, 18, 500]} {...props} />;
}
