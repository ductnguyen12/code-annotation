import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { Rater } from '../../interfaces/rater.interface';
import { loadDatasetSnippetsAsync } from "../../slices/snippetsSlice";
import RaterRegistrationDialog from './RaterRegistrationDialog';
import SnippetList from "./SnippetList";

type RouteParams = {
  id: string,
}

const SnippetsPage = () => {
  const { id } = useParams<RouteParams>();

  const dispatch = useAppDispatch();

  const [cookies, setCookie] = useCookies(['token']);
  const [openRegistration, setOpenRegistration] = React.useState(false);

  useEffect(() => {
    if (!cookies.token && !openRegistration) {
      setOpenRegistration(true);
    }
  }, [cookies.token, openRegistration]);

  const onRegisteredRater = (rater: Rater) => {
    if (id) {
      setCookie('token', rater.id, { path: '/', maxAge: 2 << 24, secure: true });   // maxAge ~ 388 days
      dispatch(loadDatasetSnippetsAsync(parseInt(id)));
    }
  }

  return !cookies.token ? (
    <RaterRegistrationDialog
      open={openRegistration}
      setOpen={setOpenRegistration}
      onRegistered={onRegisteredRater}
    />
  ) : (
    <SnippetList />
  )
}

export default SnippetsPage;