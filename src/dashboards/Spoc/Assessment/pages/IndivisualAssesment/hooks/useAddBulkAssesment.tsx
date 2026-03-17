import { useAtom, useSetAtom } from "jotai";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../../auth";
import { queryClient } from "../../../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../../utils/queryErrorHandler";
import { bulkUploadQuestionsAtom, bulkUploadType } from "../../../atom";
import { getAssesmentById } from "./useGetAssesment";

export const addBulkAssessmentKey = "/assessment/:assessment_id/questions";

export default function useAddBulkAssessment() {
  const { id } = useParams<{ id: string }>();
  const [bulkQuestions, setBulkQuestions] = useAtom(bulkUploadQuestionsAtom);
  const setUploadType = useSetAtom(bulkUploadType);
  async function addBulkAssessment() {
    if (!id) return Promise.reject(new Error("Assessment ID is required"));
    const endpoint = `${API_BASE_URL}${addBulkAssessmentKey.replace(
      ":assessment_id",
      id || ""
    )}`;
    const axios = getProtectedAxios();
    return axios.post(endpoint, {
      questions: bulkQuestions?.map((row) => {
        const correctedAnswer = row?.correctOption;
        const correctedAnswerId =
          correctedAnswer === "A"
            ? 0
            : correctedAnswer === "B"
            ? 1
            : correctedAnswer === "C"
            ? 2
            : 3;
        return {
          question_text: row?.question,
          marks: 1,
          options: row?.options?.map((col, id) => {
            return {
              option_text: col?.label,
              is_correct: correctedAnswerId === id,
            };
          }),
        };
      }),
    });
  }

  const { mutate, isLoading } = useMutation(() => addBulkAssessment(), {
    onError(err) {
      queryErrorHandler(err);
    },
    onSuccess() {
      setBulkQuestions([]);
      setUploadType("manual");
      queryClient.invalidateQueries(getAssesmentById);
    },
  });

  return { mutate, isLoading };
}
