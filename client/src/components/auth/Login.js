import {React, useState} from 'react'
import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../../actions/auth'
import PropTypes from 'prop-types'

const Login = ({ login, isAuthenticated }) => {

  const [formData, setForm] = useState({
    email:'',
    password:'',
  })

  const { email,password } = formData;

  const onChange = (e) => { setForm({...formData, [e.name]:e.value })}

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }


  return (
    <div className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Log IntoYour Account</p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={(e)=>{onChange(e.target)}} />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password} onChange={(e)=>{onChange(e.target)}}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign In</Link>
      </p>
    </div>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};


const mapStatetoProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStatetoProps,{login})(Login)
