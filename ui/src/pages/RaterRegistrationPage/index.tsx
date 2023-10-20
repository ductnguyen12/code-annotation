import Typography from '@mui/material/Typography';

import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { selectRaterRegState, setRater } from "../../slices/raterRegSlice";
import DemographicQuestions from "./DemographicQuestions";
import { selectQuestionSetState } from '../../slices/questionSetSlice';
import { selectDemographicQuestionState } from '../../slices/demographicQuestionSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';

const RaterRegistrationPage = () => {
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    status: questionSetsLoading,
  } = useAppSelector(selectQuestionSetState);

  const {
    status: questionsLoading,
  } = useAppSelector(selectDemographicQuestionState);

  const {
    status,
    rater,
  } = useAppSelector(selectRaterRegState);

  const [cookies, setCookie] = useCookies(['token']);
  useEffect(() => {
    if (!cookies.token && rater?.id) {
      setCookie('token', rater.id, { path: '/', maxAge: 2 << 24, secure: true });   // maxAge ~ 388 days
    } else if (cookies.token && !rater?.id) {
      dispatch(setRater({ id: cookies.token }))
    }
    if (rater?.id) {
      navigate(searchParams.get('next') as string);
    }
  }, [rater, cookies.token, setCookie, navigate, searchParams, dispatch]);

  return (
    <>
      <LoadingBackdrop open={[status, questionSetsLoading, questionsLoading].includes('loading')} />
      <DemographicQuestions />
    </>
  );
}

export default RaterRegistrationPage;