import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form';
import {Input, Button} from 'react-bootstrap'

class LoginForm extends React.Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render () {
    const {
      fields: { username, password },
      handleSubmit,
      submitting
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Input type="text" name="username" label="Email" placeholder="Email" {...username}/>
        {username.touched && username.error && <div>{username.error}</div>}
        <Input type="password" name="password" label="Password" placeholder="Password" {...password}/>
        {password.touched && password.error && <div>{password.error}</div>}
        <Input type="checkbox" label="Remember me"/>
        <hr/>
        <Button type="submit" bsStyle="primary" className="pull-left" disabled={submitting} onClick={handleSubmit}>Login</Button>
        <Button bsStyle="link" className="pull-right">Forgot details</Button>
      </form>
    )
  }
}

const validateLogin = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Email is required';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  return errors;
};

LoginForm = reduxForm({
  form: 'login',
  fields: ['username', 'password'],
  validate: validateLogin
})(LoginForm);

export default LoginForm
