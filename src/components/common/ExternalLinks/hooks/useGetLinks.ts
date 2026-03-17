export interface ILink {
  id: string;
  name: string;
  url: string;
  description?: string;
}

export const getLinksKey = `/links`;

export default function useGetLinks() {
  return {
    data: [] as ILink[],
    isLoading: false,
  };
}
