import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from '../../app/hooks';
import { selectAuthState } from '../../slices/authSlice';
import SnippetList from "./SnippetList";

type RouteParams = {
  id: string,
}

const SnippetsPage = () => {
  const { id } = useParams<RouteParams>();

  const {
    authenticated,
  } = useAppSelector(selectAuthState);

  const navigate = useNavigate();

  const [cookies,] = useCookies(['token']);

  useEffect(() => {
    if (!authenticated && !cookies.token) {
      navigate({
        pathname: '/rater-registration',
        search: `?next=/datasets/${id}/snippets`,
      });
    }
  }, [authenticated, cookies.token, id, navigate]);

  return (authenticated || cookies.token) && (
    <SnippetList />
  )
}

export default SnippetsPage;