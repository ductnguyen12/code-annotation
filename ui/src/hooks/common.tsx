import { useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export const useIdFromPath = (): number | undefined => {
  const { id } = useParams<{ id: string | undefined }>();
  try {
    return id ? parseInt(id) : undefined;
  } catch (e) {
    console.log('id path variable is not a number', id)
    return undefined;
  }
};

export const useNextQueryParam = (): string | null => {
  const [searchParams,] = useSearchParams();
  return searchParams.get('next');
};

export const usePage = (): [number, (page: number) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setPage = useCallback((page: number) => {
    searchParams.set('page', (page + 1).toString());
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);
  try {
    if (!!searchParams.get('page')) {
      return [
        parseInt(searchParams.get('page') as string) - 1,
        setPage,
      ];
    }
  } catch (e) {
    console.error('Unknow page query params: ', searchParams.get('page'));
  }
  return [0, setPage];
};