import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from "react-router-dom";
import SnippetList from "./SnippetList";

type RouteParams = {
  id: string,
}

const SnippetsPage = () => {
  const { id } = useParams<RouteParams>();

  const navigate = useNavigate();

  const [cookies,] = useCookies(['token']);

  useEffect(() => {
    if (!cookies.token) {
      navigate({
        pathname: '/rater-registration',
        search: `?next=/datasets/${id}/snippets`,
      });
    }
  }, [cookies.token, id, navigate]);

  return (
    <SnippetList />
  )
}

export default SnippetsPage;