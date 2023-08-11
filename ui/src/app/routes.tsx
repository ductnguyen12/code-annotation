import LoginIcon from '@mui/icons-material/Login';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import DatasetsPage from "../pages/DatasetsPage";
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
    key: 'signIn',
    path: '/sign-in',
    title: 'Sign In',
    element: (<SignInPage />),
    icon: (<LoginIcon />),
    drawerPathPrefix: '/sign-in',
  },
];

export default routes;