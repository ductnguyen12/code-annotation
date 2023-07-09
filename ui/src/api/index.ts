import axios from 'axios';
import * as datasetAPI from './datasetAPI';
import * as snippetAPI from './snippetAPI';
import * as authAPI from './authAPI';

axios.defaults.baseURL = 'http://localhost:8080';

const api = {
  ...datasetAPI,
  ...snippetAPI,
  ...authAPI,
}

export default api;