import axios from 'axios';
import { env } from '../env';
import * as authAPI from './authAPI';
import * as datasetAPI from './datasetAPI';
import * as demographicQuestionAPI from './demographicQuestionAPI';
import * as prolificAPI from './prolificAPI';
import * as raterAPI from './raterAPI';
import * as snippetAPI from './snippetAPI';

axios.defaults.baseURL = env.REACT_APP_BACKEND;

const api = {
  ...datasetAPI,
  ...snippetAPI,
  ...authAPI,
  ...raterAPI,
  ...demographicQuestionAPI,
  ...prolificAPI,
}

export default api;