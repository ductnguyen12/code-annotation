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