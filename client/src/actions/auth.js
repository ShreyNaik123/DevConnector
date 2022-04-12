import axios from 'axios';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_PROFILE
} from './types';
import setAlert from './alert';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async (dispatch) => {
	const token = localStorage.getItem('token');

	if (token) {
		setAuthToken(token);
	}
	try {
		const res = await axios.get('http://localhost:5000/api/auth');
		dispatch({
			type: USER_LOADED,
			payload: res.data,
		});
	} catch (err) {
		console.log('Err.message:', err.message);
		dispatch({
			type: AUTH_ERROR,
		});
	}
};

export const register =
	({ name, email, password }) =>
	async (dispatch) => {
		try {

			const formData = {
				name,
				email,
				password
			}
			const res = await axios.post(
				'http://localhost:5000/api/users',
				formData
			);	
				console.log('register success')
			setAlert('Register Success')

			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data,
			});
		} catch (err) {
			console.log(err.message)
			const errors = err.response.data.errors;
			if (errors) {
				errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
			}

			dispatch({
				type: REGISTER_FAIL,
			});
		}
	};

export const login =
	(email, password) =>
	async (dispatch) => {
		const config = {
			headers: {
				'Content-type': 'application/json',
			},
		};

		const body = JSON.stringify({ email, password });

		try {
			const res = await axios.post(
				'http://localhost:5000/api/auth',
				body,
				config
			);
			dispatch({
				type: LOGIN_SUCCESS,
				payload: res.data,
			});
		} catch (err) {
			const errors = err.response.data.errors;
			if (errors) {
				errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
			}

			dispatch({
				type: CLEAR_PROFILE,
			});
			dispatch({
				type: LOGIN_FAIL,
			});
		}
	};


export const logout = () => dispatch => {
	dispatch({
		type:LOGOUT
	})
}