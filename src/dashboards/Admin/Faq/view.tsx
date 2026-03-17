import { getFaqPermissions } from "../../../components/common/Faq/utils/data";
import FaqView from "../../../components/common/Faq/view";
import useGetUserType from "../../../hooks/useGetUserType";

const Faq = () => {
  const userType = useGetUserType();
  const faqPermissions = getFaqPermissions(userType);

  return <FaqView permissions={faqPermissions} />;
};

export default Faq;
