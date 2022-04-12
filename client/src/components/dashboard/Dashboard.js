import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProfile,deleteAccount } from '../../actions/profile';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import Spinner from '../layouts/Spinner';
import PropTypes from 'prop-types'
import { Fragment } from 'react';
const Dashboard = ({
	auth: { user },
	deleteAccount,
	profile: { loading, profile },
	getProfile,
}) => {
	useEffect(() => {
		getProfile();
	}, [getProfile]);

	return loading && profile === null ? (
		<Spinner />
	) : (
		<Fragment>
			<div className='container'>
				<h1 className='large text-primary'>Dashboard</h1>
				<p className='lead'>
					<i className='fas fa-user' /> Welcome {user && user.name}
				</p>
			</div>
			{profile!== null ? (
				<Fragment>
					<DashboardActions />
					<Experience experience={profile.experience} />
					<Education education={profile.education} />
				</Fragment>
			) : (
				<Fragment>
					<div className='container2'>
						<p>You have not yet setup a profile, please add some info</p>
						<Link to='/create-profile' className='btn btn-primary my-1'>
							Create Profile
						</Link>
					</div>
				</Fragment>
			)}
				<div className="container">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
		</Fragment>
	);
};

Dashboard.propTypes = {
  getProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	profile: state.profile,
});
export default connect(mapStateToProps, { getProfile,deleteAccount })(Dashboard);
