
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { selectDemographicQuestionState } from '../../slices/demographicQuestionSlice';
import { selectQuestionSetState } from '../../slices/questionSetSlice';
import { selectRaterRegState, setRater } from "../../slices/raterRegSlice";
import DemographicQuestions from "./DemographicQuestions";

const RaterRegistrationPage = () => {
  const [searchParams,] = useSearchParams();
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
      // TODO: set secure to cookies after having https domain
      setCookie('token', rater.id, { path: '/', maxAge: 2 << 24 });   // maxAge ~ 388 days
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