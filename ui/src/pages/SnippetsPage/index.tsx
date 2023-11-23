import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from '../../app/hooks';
import { useIdFromPath } from '../../hooks/common';
import { selectAuthState } from '../../slices/authSlice';
import SnippetList from "./SnippetList";

const PROLIFIC_PID_KEY = 'PROLIFIC_PID';

const SnippetsPage = () => {
  const datasetId = useIdFromPath();
  const [searchParams,] = useSearchParams();

  const {
    authenticated,
  } = useAppSelector(selectAuthState);

  const navigate = useNavigate();

  const [cookies,] = useCookies(['token']);

  useEffect(() => {
    if (!authenticated && (!cookies.token || searchParams.has(PROLIFIC_PID_KEY))) {
      navigate({
        pathname: '/rater-registration',
        search: `?next=/datasets/${datasetId}/snippets${searchParams.has(PROLIFIC_PID_KEY)
          ? '&prolificId=' + searchParams.get(PROLIFIC_PID_KEY) : ''}`,
      });
    }
  }, [authenticated, cookies.token, datasetId, searchParams, navigate]);

  return (authenticated || cookies.token) && (
    <SnippetList />
  )
}

export default SnippetsPage;