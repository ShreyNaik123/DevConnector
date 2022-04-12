import './App.css';
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import PrivateRoute from './components/routing/PrivateRoute';
import Profiles from './components/profiles/Profiles';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';



const App = () => {
  
  useEffect(() => {
    
		const token = localStorage.getItem('token')

		// check for token in LS when app first runs
    if (token) {
      // if there is a token set axios headers for all requests
      setAuthToken(token);
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    store.dispatch(loadUser());
  }, []);

	return (
    <Provider store={store}>
			<Router>
				<Navbar />
				<Alert />
				<Routes>
					<Route exact path='/' element={<Landing />} />
					<Route exact path='/register' element={<Register />} />
					<Route exact path='/login' element={<Login />} />
          <Route exact path='/profiles' element={<Profiles />}></Route>
					<Route
            exact path="/dashboard"
            element={<PrivateRoute component={Dashboard} />}
          />
					<Route
            exact path="/create-profile"
            element={<PrivateRoute component={CreateProfile} />}
          />
					<Route
            exact path="/edit-profile"
            element={<PrivateRoute component={EditProfile} />}
          />
					<Route
            exact path="/add-experience"
            element={<PrivateRoute component={AddExperience} />}
          />
					<Route
            exact path="/add-education"
            element={<PrivateRoute component={AddEducation} />}
          />
				</Routes>
			</Router>
      </Provider>
	);
};
export default App;
