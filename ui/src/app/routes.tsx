import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import CategoryIcon from '@mui/icons-material/Category';
import LoginIcon from '@mui/icons-material/Login';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import { DatasetOverviewPage } from '../pages/DatasetOverviewPage';
import DatasetsPage from "../pages/DatasetsPage";
import DemographicQuestionGroupPage from '../pages/DemographicQuestionGroupPage';
import DemographicQuestionPage from '../pages/DemographicQuestionPage';
import ModelManagementPage from '../pages/ModelManagementPage';
import RaterRegistrationPage from '../pages/RaterRegistrationPage';
import SignInPage from '../pages/SignInPage';
import SnippetsPage from '../pages/SnippetsPage';
import SurveyCompletePage from '../pages/SurveyCompletePage';

const routes = [
  {
    key: 'datasets',
    path: '/datasets',
    title: 'Datasets',
    element: (<DatasetsPage />),
    icon: (<TextSnippetIcon />),
    inDrawer: true,
    protected: true,
    pattern: /\/datasets/,
  },
  {
    key: 'dataset',
    path: '/datasets/:id/overview',
    title: 'Dataset',
    element: (<DatasetOverviewPage />),
    inDrawer: false,
    pattern: /\/datasets\/\d\/overview/,
    protected: true,
  },
  {
    key: 'datasetSnippets',
    path: '/datasets/:id/snippets',
    title: 'Dataset Annotation',
    element: (<SnippetsPage />),
    inDrawer: false,
    pattern: /\/datasets\/\d\/snippets/,
    protected: false,
  },
  {
    key: 'surveyComplete',
    path: '/datasets/:id/survey-complete',
    title: 'Survey Complete',
    element: (<SurveyCompletePage />),
    pattern: /\/datasets\/\d\/survey-complete/,
  },
  {
    key: 'demographicQuestionGroups',
    path: '/demographic-question-groups',
    title: 'Demograhpic Question Group',
    element: (<DemographicQuestionGroupPage />),
    icon: (<CategoryIcon />),
    inDrawer: true,
    pattern: /\/demographic-question-groups/,
    protected: true,
  },
  {
    key: 'demographicQuestions',
    path: '/demographic-questions',
    title: 'Demographic Question',
    element: (<DemographicQuestionPage />),
    icon: (<PsychologyAltIcon />),
    inDrawer: true,
    pattern: /\/demographic-questions/,
    protected: true,
  },
  {
    key: 'modelManagement',
    path: '/model-management',
    title: 'Model Management',
    element: (<ModelManagementPage />),
    icon: (<BatchPredictionIcon />),
    inDrawer: true,
    pattern: /\/model-management/,
    protected: true,
  },
  {
    key: 'signIn',
    path: '/sign-in',
    title: 'Sign In',
    element: (<SignInPage />),
    icon: (<LoginIcon />),
    pattern: /\/sign-in/,
  },
  {
    key: 'raterRegistration',
    path: '/rater-registration',
    title: 'Rater Registration',
    element: (<RaterRegistrationPage />),
    pattern: /\/rater-registration/,
  },
];

export default routes;