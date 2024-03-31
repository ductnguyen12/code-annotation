import axios from 'axios';
import { env } from '../env';
import * as authAPI from './authAPI';
import * as datasetAPI from './datasetAPI';
import * as demographicQuestionAPI from './demographicQuestionAPI';
import * as modelAPI from './modelAPI';
import * as prolificAPI from './prolificAPI';
import * as raterAPI from './raterAPI';
import * as snippetAPI from './snippetAPI';
import * as snippetQuestionAPI from './snippetQuestionAPI';
import * as submissionAPI from './submissionAPI';

axios.defaults.baseURL = env.REACT_APP_BACKEND;

const api = {
  ...authAPI,
  ...datasetAPI,
  ...demographicQuestionAPI,
  ...modelAPI,
  ...prolificAPI,
  ...raterAPI,
  ...snippetAPI,
  ...snippetQuestionAPI,
  ...submissionAPI,
}

export default api;