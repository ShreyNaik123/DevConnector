import { GET_PROFILE,GET_PROFILES, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE } from "../actions/types";

const initialState = {
  profile:null,
  profiles:[],
  loading:true,
  error:{}
}

function profileReducer(state=initialState, action) {
  const { payload,type } = action

  switch(type){
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return{
        ...state,
        loading:false,
        profile:payload
      }
    case GET_PROFILES:
      return {
        ...state,
        profiles:payload,
        loading:false
      }
     case PROFILE_ERROR:
       return {
         ...state,
         loading:false,
         profile:null
       }
     case CLEAR_PROFILE:
       return {
         ...state,
         loading:false,
         profile:null
       }  
      default:
        return state 
  }
  
}
export default profileReducer