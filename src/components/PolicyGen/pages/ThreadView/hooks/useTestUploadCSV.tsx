import { useAtomValue } from "jotai";
import { useMutation } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import { csvFileAtom } from "../threadAtom";

export const testUploadCSVKey = `/category/{category_id}/policy/{policy_id}/file/{file_id}/test-rules`;

export interface ICSVResponse {
  status_code: string;
  data: {
    session_id: string;
    chat_id: string;
    request_id: string;
  };
  message: string;
}

export default function useTestUploadCSV() {
  const { policyId, categoryId, fileId } = useParams<{
    policyId: string;
    categoryId: string;
    fileId: string;
  }>();
  const file = useAtomValue(csvFileAtom) as File;
  const location = useLocation();
  const requestId = new URLSearchParams(location.search).get("code_request_id");
  const uploadCSV = async () => {
    const endpoint =
      API_BASE_URL +
      testUploadCSVKey
        .replace("{category_id}", categoryId!)
        .replace("{policy_id}", policyId!)
        .replace("{file_id}", fileId!) +
      `?request_id=${requestId}`;

    const axios = getProtectedAxios();
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data as ICSVResponse;
  };

  const { mutate, isLoading, data, error } = useMutation(() => uploadCSV(), {
    onError: queryErrorHandler,
  });

  return { mutate, isLoading, data: data as ICSVResponse, error };
}
