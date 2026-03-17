import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { InviteCustomerFieldsEnum } from "../utils/config";

export const getTestRuleFieldsKey = "/required-fields?request_id={requestId}";

interface IResponse {
  status_code: string;
  data: {
    required_fields: string[];
  };
  error?: string;
}

export default function useGetTestRuleFieldsMapper() {
  const requestId = new URLSearchParams(location.search).get("code_request_id");
  const [formFields, setFormFields] = useState<
    Record<InviteCustomerFieldsEnum, boolean>
  >({
    [InviteCustomerFieldsEnum.BORROWER_PAN]: false,
    [InviteCustomerFieldsEnum.CO_BORROWER_PAN]: false,
    [InviteCustomerFieldsEnum.GST]: false,
  });
  const fetchFields = async () => {
    const endpoint =
      API_BASE_URL +
      getTestRuleFieldsKey.replace("{requestId}", requestId || "");

    const axios = getProtectedAxios();
    return axios.get(endpoint).then(({ data }) => data as IResponse);
  };

  const { data, isLoading, refetch } = useQuery(
    [getTestRuleFieldsKey],
    () => fetchFields(),
    {
      onError() {
        return;
      },
      enabled: !!requestId,
      retry: 0,
    }
  );

  useEffect(() => {
    if (data?.data?.required_fields) {
      const reqFields = data?.data?.required_fields;
      const isBorrowerPan = reqFields?.includes(
        InviteCustomerFieldsEnum.BORROWER_PAN
      );
      const isCoBorrowerPan = reqFields?.includes(
        InviteCustomerFieldsEnum.CO_BORROWER_PAN
      );
      const temp =
        isBorrowerPan && isCoBorrowerPan
          ? 2
          : isBorrowerPan || isCoBorrowerPan
          ? 1
          : 0;
      const updatedFields = {
        [InviteCustomerFieldsEnum.BORROWER_PAN]: isBorrowerPan,
        [InviteCustomerFieldsEnum.CO_BORROWER_PAN]: isCoBorrowerPan,
        [InviteCustomerFieldsEnum.GST]: reqFields?.length > temp,
      };
      setFormFields(updatedFields);
    }
  }, [data]);

  return {
    data: formFields,
    isLoading,
    requiredFields: data?.data?.required_fields || [],
    refetch,
  };
}
