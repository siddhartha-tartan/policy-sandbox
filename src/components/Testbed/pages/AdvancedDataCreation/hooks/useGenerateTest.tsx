import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import { userStore } from "../../../../../store/userStore";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import { ruleConfigsAtom, testDataAtom } from "../advancedDataCreationAtom";

export interface TestDataResponse {
  [key: string]: string | boolean | number | null;
}

interface GenerateTestDataResponse {
  status_code: number;
  message: string;
  data: TestDataResponse[];
}

export interface TestData {
  [key: string]: any;
}

interface IntegerField {
  datatype: "integer";
  min: number;
  max: number;
}

interface FloatField {
  datatype: "float";
  min: number;
  max: number;
  precision: number;
}

interface BooleanField {
  datatype: "boolean";
}

interface EnumField {
  datatype: "enum";
  values: string[];
}

type FieldDefinition = IntegerField | FloatField | BooleanField | EnumField;

interface GenerateTestDataRequest {
  [key: string]: FieldDefinition;
}

const generateTestDataEndpoint = "/generate_data";

export default function useGenerateTest() {
  const setTestData = useSetAtom(testDataAtom);
  const rulesConfig = useAtomValue(ruleConfigsAtom);
  const generateTestData = async (numRecords: number): Promise<TestData[]> => {
    const axios = getProtectedAxios();
    const endpoint = `${API_BASE_URL}${generateTestDataEndpoint}?num_records=${numRecords}`;
    const payload: GenerateTestDataRequest = rulesConfig;

    const { data } = await axios.post<GenerateTestDataResponse>(
      endpoint,
      payload
    );

    if (data.status_code === 200) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  };

  const { mutate, isLoading, error, data } = useMutation(generateTestData, {
    onError: queryErrorHandler,
  });

  const navigate = useNavigate();
  const { categoryId, policyId, fileId } = useParams();
  const { userType } = userStore();
  useEffect(() => {
    if (data) {
      const testData = data?.map((item, index) => ({
        ...item,
        expected_output: "fail",
        id: index.toString(),
        sno: index + 1,
      }));

      setTestData(testData);
      navigate(
        `${BASE_ROUTES[userType]}/testbed/advanced-data-creation/${categoryId}/${policyId}/${fileId}/test`
      );
    }
  }, [data]);

  return {
    generateTestData: (numRecords: number) => mutate(numRecords),
    isLoading,
    error,
  };
}
