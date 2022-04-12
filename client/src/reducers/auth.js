import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  ACCOUNT_DELETED
} from '../actions/types'

const initialState = {
  token:localStorage.getItem('token'),
  isAuthenticated:false,
  loading:true,
  user:null
}

export default function authentiate(state=initialState, action){
  const { type,payload } = action
  switch(type){
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:   
    localStorage.setItem('token',payload.token)
      return {
        ...state,
        isAuthenticated:true,
        loaded:false,
        user:payload
      }
    case REGISTER_FAIL:
    case AUTH_ERROR:   
    case LOGIN_FAIL:
    case LOGOUT: 
    case CLEAR_PROFILE: 
    case ACCOUNT_DELETED:
    localStorage.removeItem('token')
      return {
        ...state,
        isAuthenticated:false,
        loading:false
      }
     default:
       return state 

  }
}