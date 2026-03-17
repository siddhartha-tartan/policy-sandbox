import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { userStore } from "../../../../store/userStore";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
export interface IResponseFaq {
  query_text: string;
  answer_text: string;
  category_id: string;
  is_active: boolean;
  id: string;
}
export const getAllFaqKey = "/faq/get-faqs";
export const getAllFaqEndpoint = "/faq";
export const useGetFaqs = () => {
  const { userType } = userStore();
  const [categoryId, setCategoryId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<IResponseFaq[] | null>(null);
  const getAllFaqs = async () => {
    let queryParams: string[] = [];
    if (categoryId)
      queryParams.push(`category_id=${encodeURIComponent(categoryId)}`);
    if (searchQuery)
      queryParams.push(`faq_name=${encodeURIComponent(searchQuery)}`);
    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const endpoint = API_BASE_URL + `${getAllFaqEndpoint}${queryString}`;
    const axios = getProtectedAxios();
    return axios.get(endpoint).then(({ data }) => data?.data);
  };
  const { data: faqsData, isLoading } = useQuery(
    [getAllFaqKey, categoryId, searchQuery, userType],
    () => getAllFaqs(),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {},
    }
  );

  //@ts-ignore
  const setFaqsHelper = (faqs) => {
    const temp: IResponseFaq[] = faqs?.data?.map((row: any) => {
      return {
        query_text: row?.query_text,
        answer_text: row?.answer_text,
        category_id: row?.category_id,
        is_active: row?.is_active,
        id: row?.id,
      };
    });
    setData(temp);
  };

  useEffect(() => {
    if (faqsData) {
      setFaqsHelper(faqsData);
    }
  }, [faqsData]);
  return {
    data,
    isLoading,
    setCategoryId,
    setSearchQuery,
  };
};
