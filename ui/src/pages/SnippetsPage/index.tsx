import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppSelector } from '../../app/hooks';
import { selectAuthState } from '../../slices/authSlice';
import SnippetList from "./SnippetList";

type RouteParams = {
  id: string,
}

const PROLIFIC_PID_KEY = 'PROLIFIC_PID';

const SnippetsPage = () => {
  const { id } = useParams<RouteParams>();
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
        search: `?next=/datasets/${id}/snippets${searchParams.has(PROLIFIC_PID_KEY)
          ? '&prolificId=' + searchParams.get(PROLIFIC_PID_KEY) : ''}`,
      });
    }
  }, [authenticated, cookies.token, id, searchParams, navigate]);

  return (authenticated || cookies.token) && (
    <SnippetList />
  )
}

export default SnippetsPage;