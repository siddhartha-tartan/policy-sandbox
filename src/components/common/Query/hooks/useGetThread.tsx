import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export interface IComments {
  author: string;
  type?: string;
  comment: string;
  created_at: string;
}

export interface IThread {
  author: string;
  type?: string;
  question: string;
  created_at: number;
  comments?: IComments[];
  id: string;
}

export const getThreadKey = "/category/{category_id}/discussion";

export default function useGetThread(id: string) {
  async function fetch() {
    const endpoint = API_BASE_URL + getThreadKey.replace("{category_id}", id);
    const axios = getProtectedAxios();
    return axios.get(endpoint).then(({ data }) => data?.data);
  }
  const [discussions, setDiscussions] = useState<IThread[] | null>(null);
  const { data, isLoading } = useQuery([getThreadKey, id], () => fetch(), {
    onError(err) {
      queryErrorHandler(err);
    },
  });

  useEffect(() => {
    if (data) {
      const temp: IThread[] = data?.map((row: any) => {
        const init = row?.messages?.[row?.messages?.length - 1];
        const comments = row?.messages
          ?.reverse()
          ?.map((col: any, id: number) => {
            if (id == 0) return null;
            return {
              author: col?.user?.name,
              type: "",
              comment: col?.content,
              created_at: col?.created_at,
            };
          })
          .filter((e: any) => e);
        return {
          id: row?.id,
          author: init?.user?.name,
          type: "",
          question: init?.content,
          created_at: init?.created_at,
          comments: comments,
        };
      });
      setDiscussions(temp);
    }
  }, [data]);

  return { data: discussions, isLoading };
}
