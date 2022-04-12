import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';
import Spinner from '../layouts/Spinner';

const Profiles = ({ getAllProfiles, profile: { profiles, loading } }) => {
	useEffect(() => {
		getAllProfiles();
	}, [getAllProfiles]);

	return(
    <section className='container'>
		{ loading ? 
			<Spinner /> :
			<Fragment>
				<h1 className='large text-primary'>Developers</h1>
				<p className='lead'>
					<i className='fab fa-connectdevelop' /> Browse and connect with
					developers
				</p>
				<div className='profiles'>  
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <ProfileItem key={profile._id} profile={profile} />
          ))
        ): (
              <h4>No profiles found...</h4>
            )}
				</div>
        {console.log('here2')}
			</Fragment>
	}
  </section>
  )
}

Profiles.propTypes = {
	getAllProfiles: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
});
export default connect(mapStateToProps, { getAllProfiles })(Profiles);



 // profiles.map((profile) => (
              //   <ProfileItem key={profile._id} profile={profile} />
              // ))