// as we needed to set the x-auth-token header as the jwt every time here we check for a token in localstorage and set it as a global header

import axios from 'axios';

// store our JWT in LS and set axios headers if we do have a token

const setAuthToken = (token) => {
  if (token) {
		axios.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
    console.log('token set from setAuthToken ', token)
  } else {
		delete axios.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

export default setAuthToken;
