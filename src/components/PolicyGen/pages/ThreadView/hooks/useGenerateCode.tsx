import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import { PolicyGenDataResponse } from "../../../hooks/useGetPolicyGenData";
import { codeRequestIdAtom } from "../threadAtom";
import { PolicyGenParamsEnum } from "../utils/constant";

export const generateCodeKey = `/agents/codify/files/:fileId`;

export enum CodeLanguage {
  DROOLS = "drools",
  PYTHON = "python",
  JSONATA = "jsonata",
  JAVA = "java",
}

export default function useGenerateCode() {
  const { fileId } = useParams<{
    fileId: string;
  }>();
  const setRequestId = useSetAtom(codeRequestIdAtom);
  const navigate = useNavigate();

  const appendQueryParam = (key: string, value: string) => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set(key, value);
    navigate(`?${currentParams.toString()}`, { replace: false });
  };

  const generateCode = async (
    codeLanguage: CodeLanguage
  ): Promise<PolicyGenDataResponse> => {
    const endpoint = API_BASE_URL + generateCodeKey.replace(":fileId", fileId!);
    const path = `${endpoint}?code_lang=${codeLanguage}`;
    const axios = getProtectedAxios();
    return axios.post(path).then(({ data }) => data?.data);
  };
  const { mutate, isLoading, data } = useMutation(
    [generateCodeKey],
    ({ codeLanguage }: { codeLanguage: CodeLanguage }) =>
      generateCode(codeLanguage),
    {
      onError: queryErrorHandler,
    }
  );

  useEffect(() => {
    const requestId = data?.id;
    if (requestId) {
      appendQueryParam(PolicyGenParamsEnum.CODE_ID, requestId);
      setRequestId(requestId);
    }
  }, [data]);

  return { mutate, isLoading, data };
}
