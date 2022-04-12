import axios from 'axios';
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, CLEAR_PROFILE,GET_PROFILES, GET_REPOS } from './types';
import setAlert from './alert'
import setAuthToken from '../utils/setAuthToken';



// Get Profile

export const getProfile = () => async (dispatch) => {
	try {
		const token = localStorage.getItem('token')
		setAuthToken(token)
    console.log('token set from profile actions ', token)

		const res = await axios.get('http://localhost:5000/api/profile/me');

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
		});
	}
};


// Get all profiles

export const getAllProfiles = () => async dispatch => {

	dispatch({ type: CLEAR_PROFILE });
	try {
		const res = await axios.get('http://localhost:5000/api/profile');

		dispatch({
			type: GET_PROFILES,
			payload: res.data
		});
	} catch (err) {
		console.log('inside getallprofiles', err.message)
		dispatch({
			type: PROFILE_ERROR,
		});
	}
};


// GET PROFILE BY USERID

export const getprofilebyID = (userID) => async dispatch => {

	try {
		const res = await axios.get(`http://localhost:5000/api/profile/user/${userID}`);

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
		});
	}
};


// GET REPOS

export const getRepos = userName => async dispatch =>{
	try {
			const res = axios.get(`http://localhost:5000/api/profile/${userName}`)
			dispatch({
				type:GET_REPOS,
				payload:res.data
			})
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
		});
	}
}


// Create/Update Profile

export const createprofile = (formData, navigate,edit=false) => async dispatch => {

	try {
			const config = {
				headers:{
					'Content-yype':'application/json'
				}
			}
			const res = axios.post('http://localhost:5000/api/profile',formData,config)
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			});

			dispatch(setAlert(edit?'Profile Updated':'Profile Created', 'success'))
				navigate('/dashboard')		

	} catch (err) {
		console.log("inside error")
		const errors = err.response.data.errors;
			if (errors) {
				errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
			}
		dispatch({
			type: PROFILE_ERROR,
		});
	}

}


// Add Experience

export const addExperience = (formData, navigate)=> async dispatch => {

	try {
			const res = axios.put('http://localhost:5000/api/profile/experience',formData)
			dispatch({
				type: UPDATE_PROFILE,
				payload: res.data
			});

			dispatch(setAlert('Experience Added', 'success'))
				navigate('/dashboard')		
			// we cannot use <Navigate> inside actions

	} catch (err) {
		console.log("inside error")
		const errors = err.response.data.errors;
			if (errors) {
				errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
			}
		dispatch({
			type: PROFILE_ERROR,
		});
	}
}


// Add Education

export const addEducation = (formData, navigate )=> async dispatch => {
	try {
			const res = axios.put('http://localhost:5000/api/profile/education',formData)
			dispatch({
				type: UPDATE_PROFILE,
				payload: res.data
			});

			dispatch(setAlert('Education Added', 'success'))
				navigate('/dashboard')		

	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: PROFILE_ERROR,
		});
	}
}


// Delete Education

export const deleteEducation = id => async dispatch => {
	try {
		
		const res = await axios.delete(`http://localhost:5000/api/profile/education/${id}`)
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		})
		console.log('deleted')
		dispatch(setAlert('Education Deleted', 'success'))

	} catch (err) {
		const errors = err.response.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: PROFILE_ERROR,
		});
	}
}


// Delete Experience

export const deleteExperience = id => async dispatch => {
	try {
		const res = await axios.delete(`http://localhost:5000/api/profile/experience/${id}`)
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		})
		dispatch(setAlert('Experience Deleted', 'success'))

	} catch (err) {
		const errors = err.response.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: PROFILE_ERROR,
		});
	}
}


// Delete Account

export const deleteAccount = () => async dispatch => {
	if(window.confirm('Are you sure you want to delete your account? This cannot be undone!')){
		try{
			const res = await axios.delete('http://localhost:5000/api/profile')
			dispatch({
				type: CLEAR_PROFILE,
				payload: res.data
			})
			dispatch({
				type:ACCOUNT_DELETED,
			})
			dispatch(setAlert('Account Deleted'))
	
		} catch (err) {
			const errors = err.response.errors;
			if (errors) {
				errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
			}
			dispatch({
				type: PROFILE_ERROR,
			});
		}
	}
}