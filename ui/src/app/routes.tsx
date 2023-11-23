import CategoryIcon from '@mui/icons-material/Category';
import LoginIcon from '@mui/icons-material/Login';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import DatasetsPage from "../pages/DatasetsPage";
import DemographicQuestionGroupPage from '../pages/DemographicQuestionGroupPage';
import SignInPage from '../pages/SignInPage';
import SnippetsPage from '../pages/SnippetsPage';
import DemographicQuestionPage from '../pages/DemographicQuestionPage';
import RaterRegistrationPage from '../pages/RaterRegistrationPage';

const routes = [
  {
    key: 'datasets',
    path: '/datasets',
    title: 'Datasets',
    element: (<DatasetsPage />),
    icon: (<TextSnippetIcon />),
    inDrawer: true,
    drawerPathPrefix: '/datasets',    // Determine whether a drawer is selected
    protected: true,
  },
  {
    key: 'datasetSnippets',
    path: '/datasets/:id/snippets',
    title: 'Datasets',
    element: (<SnippetsPage />),
    inDrawer: false,
    drawerPathPrefix: '/datasets',
    protected: false,
  },
  {
    key: 'demographicQuestionGroups',
    path: '/demographic-question-groups',
    title: 'Demograhpic Question Group',
    element: (<DemographicQuestionGroupPage />),
    icon: (<CategoryIcon />),
    inDrawer: true,
    drawerPathPrefix: '/demographic-question-groups',    // Determine whether a drawer is selected
    protected: true,
  },
  {
    key: 'demographicQuestions',
    path: '/demographic-questions',
    title: 'Demographic Question',
    element: (<DemographicQuestionPage />),
    icon: (<PsychologyAltIcon />),
    inDrawer: true,
    drawerPathPrefix: '/demographic-questions',    // Determine whether a drawer is selected
    protected: true,
  },
  {
    key: 'signIn',
    path: '/sign-in',
    title: 'Sign In',
    element: (<SignInPage />),
    icon: (<LoginIcon />),
    drawerPathPrefix: '/sign-in',
  },
  {
    key: 'raterRegistration',
    path: '/rater-registration',
    title: 'Rater Registration',
    element: (<RaterRegistrationPage />),
    drawerPathPrefix: '/rater-registration',
  },
];

export default routes;