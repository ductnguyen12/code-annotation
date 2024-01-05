
import { useCallback, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { useNextQueryParam } from '../../hooks/common';
import { selectAuthState } from '../../slices/authSlice';
import { selectDemographicQuestionGroupState } from '../../slices/demographicQuestionGroupSlice';
import { selectDemographicQuestionState } from '../../slices/demographicQuestionSlice';
import { getCurrentRaterAsync, getRaterByExternalInfoAsync, selectRaterRegState } from "../../slices/raterRegSlice";
import DemographicQuestions from "./DemographicQuestions";

const RaterRegistrationPage = () => {
  const [searchParams,] = useSearchParams();
  const nextPage = useNextQueryParam();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    authenticated,
  } = useAppSelector(selectAuthState);

  const {
    status: questionGroupsLoading,
  } = useAppSelector(selectDemographicQuestionGroupState);

  const {
    status: questionsLoading,
  } = useAppSelector(selectDemographicQuestionState);

  const {
    status,
    rater,
  } = useAppSelector(selectRaterRegState);

  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  const getDatasetId = useCallback((): number | undefined => {
    if (!searchParams.has('next')) {
      console.log('There is not next param in query params');
      return undefined;
    }
    const subpaths = (searchParams.get('next') as string).split('/');
    if (subpaths.length < 3) {
      console.log('Unexpected navigation path', searchParams.get('next'));
      return undefined;
    }
    try {
      return parseInt(subpaths[2]);
    } catch (e) {
      console.log('Not supported datasetId', subpaths[2]);
      return undefined;
    }
  }, [searchParams]);

  useEffect(() => {
    if (authenticated) {
      navigate(nextPage || '/datasets');
      return;
    }
    const datasetId = getDatasetId();
    const prolificId = searchParams.get('prolificId');
    if (prolificId && (prolificId !== rater?.externalId || datasetId !== rater?.currentDatasetId)) {
      if (cookies.token)
        removeCookie('token', { path: '/' });
      dispatch(getRaterByExternalInfoAsync({
        externalSystem: 'prolific',
        externalId: prolificId,
        datasetId: datasetId as number,
      }));
      return;
    }
    if (!cookies.token && rater?.id && datasetId === rater?.currentDatasetId) {
      // TODO: set secure to cookies after having https domain
      setCookie('token', rater.id, { path: '/', maxAge: 2 << 24 });   // maxAge ~ 388 days
    } else if (cookies.token && !rater?.id) {
      dispatch(getCurrentRaterAsync(datasetId as number));
      return;
    }
    if (rater?.id && datasetId === rater.currentDatasetId) {
      navigate(nextPage || '/datasets');
    }
  }, [
    authenticated, rater, cookies.token, searchParams, nextPage,
    setCookie, removeCookie, navigate, getDatasetId, dispatch,
  ]);

  return (
    <>
      <LoadingBackdrop open={[status, questionGroupsLoading, questionsLoading].includes('loading')} />
      <DemographicQuestions
        datasetId={getDatasetId()}
        raterId={cookies.token}
        externalId={searchParams.get('prolificId') || undefined}
        externalSystem={searchParams.has('prolificId') ? 'prolific' : undefined}
      />
    </>
  );
}

export default RaterRegistrationPage;