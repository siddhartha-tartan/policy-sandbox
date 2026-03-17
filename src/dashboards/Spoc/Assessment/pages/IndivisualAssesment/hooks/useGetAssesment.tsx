import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../../auth";
import { IAssesment } from "../../../../../../components/common/Assesment/hooks/useGetAllAssesment";
import { API_BASE_URL } from "../../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../../utils/queryErrorHandler";

export interface IUsers {
  usersData: IUser[];
  totalPages: number;
}

export interface IAssesmentDetails extends IAssesment {
  questions: IQuestions[];
  users?: IUsers;
  total_questions: number;
}

export interface IUser {
  name: string;
  date: number;
  score: string;
  attempted: string;
  status: string;
  id: string;
}

export interface IOption {
  type?: string;
  label: string;
  value: string;
}

export interface IQuestions {
  question: string;
  options: IOption[];
  id: string;
  correctedAnswer: string;
  correctOption?: string;
  type?: "new" | "delete" | "";
}

export const getAssesmentById = "/assessment/:assessment_id";

export default function useGetAssesment() {
  const { id } = useParams<{ id: string }>();
  async function fetch() {
    const axios = getProtectedAxios();
    const endpoint =
      API_BASE_URL + `${getAssesmentById.replace(":assessment_id", id || "")}`;

    return axios.get(endpoint).then(({ data }) => data?.data);
  }

  const { data, isLoading } = useQuery([getAssesmentById, id], () => fetch(), {
    onError(err) {
      queryErrorHandler(err);
    },
    enabled: !!id,
  });
  const [details, setDetails] = useState<IAssesmentDetails | null>(null);

  useEffect(() => {
    if (data) {
      const questions =
        data?.questions?.map((row: any) => {
          const correctedAnswer = row?.options?.filter(
            (option: any) => option?.is_correct
          )?.[0]?.id;
          const options = row?.options?.map((option: any) => {
            return {
              label: option?.option_text,
              value: option?.id,
            };
          });
          return {
            question: row?.question_text,
            options: options,
            id: row?.id,
            correctedAnswer: correctedAnswer,
          };
        }) || [];
      const temp = {
        name: data?.assessment_name,
        start_date: new Date(data?.start_date).getTime(),
        end_date: new Date(data?.end_date).getTime(),
        passing_score: data?.passing_score,
        participants_count: data?.attempts_allowed,
        status: data?.status?.current_status,
        description: data?.description,
        loanCategory: data?.loan_category_id,
        id: data?.id,
        questions: questions,
        total_questions: questions?.length,
      };
      setDetails(temp);
    }
  }, [data]);

  return { data: details, isLoading };
}
