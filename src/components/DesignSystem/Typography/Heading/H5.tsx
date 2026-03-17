import CustomText from "../CustomText";
import { ITypographyProps } from "../types";

export default function H5(props: Readonly<ITypographyProps>) {
  return <CustomText stylearr={[14, 20, 500]} {...props} />;
}
