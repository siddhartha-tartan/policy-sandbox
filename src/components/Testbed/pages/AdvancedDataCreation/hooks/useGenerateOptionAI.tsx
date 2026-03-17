import { useState } from "react";
import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import usePolicyGenPolling from "../../../../../components/PolicyGen/hooks/usePolicyGenPolling";

interface GenerateOptionsRequest {
  number_of_options: number;
}

interface GenerateOptionsResponse {
  status_code: string;
  message: string;
  data: {
    id: string;
    agent_id: string;
    context_id: string | null;
    request: string;
    metadata: string;
    status: "Pending" | "Successful" | "Failed";
    response: string;
  };
}

const generateOptionsEndpoint = "/agents/generate-options/variables";

export default function useGenerateOptionAI() {
  const [options, setOptions] = useState<string[]>([]);
  const { mutate: startPolling, isLoading: isPolling } = usePolicyGenPolling();

  const generateOptions = async ({
    variableId,
    numberOfOptions,
  }: {
    variableId: string;
    numberOfOptions: number;
  }): Promise<string[]> => {
    const axios = getProtectedAxios();
    const endpoint = `${API_BASE_URL}${generateOptionsEndpoint}/${variableId}`;
    
    const payload: GenerateOptionsRequest = {
      number_of_options: numberOfOptions,
    };

    const { data } = await axios.post<GenerateOptionsResponse>(endpoint, payload);
    
    if (data.data.status === "Successful") {
      // If already successful, parse and return options
      return JSON.parse(data.data.response);
    }
    
    // If pending, start polling
    return new Promise((resolve, reject) => {
      startPolling({
        requestId: data.data.id,
      }, {
        onSuccess: (result) => {
          if (result && result.response) {
            const formattedData = result.response.replace(/'/g, '"');
            const parsedOptions = JSON.parse(formattedData);
            resolve(parsedOptions);
          } else {
            reject(new Error("Failed to get options"));
          }
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  };

  const { mutate, isLoading, error } = useMutation(
    generateOptions,
    {
      onSuccess: (data) => {
        setOptions(data);
      },
      onError: queryErrorHandler,
    }
  );

  return {
    generateOptions: (variableId: string, numberOfOptions: number) => 
      mutate({ variableId, numberOfOptions }),
    options,
    isLoading: isLoading || isPolling,
    error,
  };
}