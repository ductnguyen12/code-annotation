import CategoryIcon from '@mui/icons-material/Category';
import LoginIcon from '@mui/icons-material/Login';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import DatasetsPage from "../pages/DatasetsPage";
import QuestionSetPage from '../pages/QuestionSetPage';
import SignInPage from '../pages/SignInPage';
import SnippetsPage from '../pages/SnippetsPage';

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
    key: 'questionSets',
    path: '/question-sets',
    title: 'Question Set',
    element: (<QuestionSetPage />),
    icon: (<CategoryIcon />),
    inDrawer: true,
    drawerPathPrefix: '/question-sets',    // Determine whether a drawer is selected
    protected: true,
  },
  {
    key: 'raterQuestions',
    path: '/rater-questions',
    title: 'Rater Question',
    element: (<></>),
    icon: (<PsychologyAltIcon />),
    inDrawer: true,
    drawerPathPrefix: '/rater-questions',    // Determine whether a drawer is selected
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
];

export default routes;