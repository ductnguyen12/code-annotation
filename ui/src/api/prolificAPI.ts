import axios from "axios";

export const completeRatingInProlific = async (datasetId: number): Promise<void> => {
  const response = await axios.get(`/api/v1/datasets/${datasetId}/prolific-completion`, { withCredentials: true });
  window.location.href = response.data;
}