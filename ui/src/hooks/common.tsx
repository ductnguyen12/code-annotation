import { useParams } from "react-router-dom";

export const useIdFromPath = (): number | undefined => {
  const { id } = useParams<{ id: string | undefined }>();
  try {
    return id ? parseInt(id) : undefined;
  } catch (e) {
    console.log('id path variable is not a number', id)
    return undefined;
  }
};