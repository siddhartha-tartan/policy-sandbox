export interface ILink {
  id: string;
  link_name: string;
  url: string;
  description: string;
  is_active: boolean;
  edit?: boolean;
}

export const getLinksKey = `/links`;

export default function useGetLinks() {
  return {
    data: [] as ILink[],
    isLoading: false,
  };
}
