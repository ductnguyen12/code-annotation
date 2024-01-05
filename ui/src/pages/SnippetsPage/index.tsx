import { useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from '../../app/hooks';
import { useIdFromPath } from '../../hooks/common';
import { selectAuthState } from '../../slices/authSlice';
import { selectRaterRegState } from '../../slices/raterRegSlice';
import SnippetList from "./SnippetList";

const PROLIFIC_PID_KEY = 'PROLIFIC_PID';

const SnippetsPage = () => {
  const datasetId = useIdFromPath();
  const [searchParams,] = useSearchParams();

  const {
    authenticated,
  } = useAppSelector(selectAuthState);

  const {
    rater,
  } = useAppSelector(selectRaterRegState);

  const navigate = useNavigate();

  useEffect(() => {
    const prolificId = searchParams.get(PROLIFIC_PID_KEY);

    if (!authenticated && (
      (prolificId && prolificId !== rater?.externalId)
      || !rater?.id
      || rater?.currentDatasetId !== datasetId
    )) {
      navigate({
        pathname: '/rater-registration',
        search: `?next=/datasets/${datasetId}/snippets${prolificId ? `&prolificId=${prolificId}` : ''}`,
      });
    }
  }, [authenticated, rater, datasetId, searchParams, navigate]);

  return (authenticated || (rater?.id && rater?.currentDatasetId === datasetId))
    ? (
      <SnippetList />
    )
    : <></>
}

export default SnippetsPage;