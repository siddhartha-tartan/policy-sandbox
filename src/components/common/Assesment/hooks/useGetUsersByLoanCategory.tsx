import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { userStore } from "../../../../store/userStore";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { getLoanCategoryTypeById } from "../../../../utils/helpers/loanCategoryHelpers";

export const getUserByLoanCategoryKey = `/users/:loan_category_id`;
export default function useGetUsersByLoanCategory(loan_category_id: string) {
  async function fetchUser() {
    const endpont =
      API_BASE_URL +
      getUserByLoanCategoryKey.replace(":loan_category_id", loan_category_id);
    const axios = getProtectedAxios();

    return axios.post(endpont).then(({ data }) => data?.data);
  }
  const [users, setUsers] = useState<any[]>([]);
  const [emailToUserMapping, setEmailToUserMapping] = useState<
    Record<string, string>
  >({});
  const { data, isLoading } = useQuery(
    [getUserByLoanCategoryKey, loan_category_id],
    () => fetchUser(),
    {
      onError(err) {
        queryErrorHandler(err);
      },
    }
  );

  const { loanCategories } = userStore();
  useEffect(() => {
    if (data && loanCategories) {
      const usersTemp: any = data?.map((row: any) => {
        return {
          id: row?.id,
          name: row?.first_name,
          role: row?.user_type,
          date_added: "2023-11-15",
          loan_category: getLoanCategoryTypeById(
            loan_category_id,
            loanCategories
          ),
          mobile: row?.phone_number,
          email: row?.email,
        };
      });
      setUsers(usersTemp);
      const emailMapping = data?.reduce(
        (acc: Record<string, string>, item: any) => {
          if (item?.email && item?.id) {
            acc[item.email] = item.id;
          }
          return acc;
        },
        {}
      );

      setEmailToUserMapping(emailMapping);
    }
  }, [data, loanCategories]);

  return {
    data: users,
    emailToUserMapping,
    isLoading,
  };
}
