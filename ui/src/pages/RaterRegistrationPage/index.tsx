
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { selectAuthState } from '../../slices/authSlice';
import { selectDemographicQuestionState } from '../../slices/demographicQuestionSlice';
import { selectQuestionSetState } from '../../slices/questionSetSlice';
import { getCurrentRaterAsync, getRaterByExternalInfoAsync, selectRaterRegState } from "../../slices/raterRegSlice";
import DemographicQuestions from "./DemographicQuestions";

const RaterRegistrationPage = () => {
  const [searchParams,] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    authenticated,
  } = useAppSelector(selectAuthState);

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

  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    if (authenticated) {
      navigate(searchParams.get('next') as string);
      return;
    }
    const prolificId = searchParams.get('prolificId');
    if (prolificId && prolificId !== rater?.externalId) {
      if (cookies.token)
        removeCookie('token', { path: '/' });
      dispatch(getRaterByExternalInfoAsync({ externalSystem: 'prolific', externalId: prolificId }));
      return;
    }
    if (!cookies.token && rater?.id) {
      // TODO: set secure to cookies after having https domain
      setCookie('token', rater.id, { path: '/', maxAge: 2 << 24 });   // maxAge ~ 388 days
    } else if (cookies.token && !rater?.id) {
      dispatch(getCurrentRaterAsync());
      return;
    }
    if (rater?.id) {
      navigate(searchParams.get('next') as string);
    }
  }, [authenticated, rater, cookies.token, setCookie, removeCookie, navigate, searchParams, dispatch]);

  return (
    <>
      <LoadingBackdrop open={[status, questionSetsLoading, questionsLoading].includes('loading')} />
      <DemographicQuestions
        externalId={searchParams.get('prolificId') || undefined}
        externalSystem={searchParams.has('prolificId') ? 'prolific' : undefined}
      />
    </>
  );
}

export default RaterRegistrationPage;