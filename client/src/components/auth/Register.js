import {React, useState} from 'react'
import { Link,Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import setAlert from '../../actions/alert'
import {register} from '../../actions/auth'
import PropTypes from 'prop-types'
const Register = ({ setAlert,register,auth:{isAuthenticated} }) => {

  const [formData, setForm] = useState({
    name:'',
    email:'',
    password:'',
    password2:''
  })

  const { name,email,password,password2 } = formData;


  const onChange = (e) => { setForm({...formData, [e.name]:e.value })}



  const submitForm = async (e) =>{
    e.preventDefault()
    if(password !== password2){
      setAlert('Passwords do not match','danger');
    }else{
      register(formData);
    }
    <Navigate to='/dashboard' />
  }
  if(isAuthenticated){
    console.log('hahamisis')
  }
  if (isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={submitForm}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" value={name} onChange={(e)=>{onChange(e.target)}} />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={(e)=>{onChange(e.target)}} />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
           
            value={password} onChange={(e)=>{onChange(e.target)}}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
           
            value={password2} onChange={(e)=>{onChange(e.target)}}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  )
}


Register.prototype = {
  setAlert:PropTypes.func.isRequired
}
Register.prototype = {
  register:PropTypes.func.isRequired
}

const mapStatetoProps = state => ({
  auth: state.auth
})
export default connect(mapStatetoProps,{setAlert,register})(Register)
    