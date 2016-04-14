import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form';
import {Input, Button, Alert} from 'react-bootstrap'

export class LoginForm extends React.Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleRemember: PropTypes.func.isRequired,
    isRemember: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    isPending: PropTypes.bool.isRequired
  };

  hasFieldError(field) {
    return !(field.touched && field.error) ? 'success' : 'error';
  }

  hasBsStyleAttr(field) {
    if (field.touched) {
      field.bsStyle = this.hasFieldError(field);
    }
  }

  onChangeRemember(event) {
    this.props.handleRemember(event.target.checked);
  }

  render () {
    const {
      fields: { username, password },
      handleSubmit
    } = this.props;

    this.hasBsStyleAttr(username);
    this.hasBsStyleAttr(password);

    return (
      <div>
        {this.props.errorMessage && <Alert bsStyle="danger">The API Key or Password you entered are incorrect. Please try again (make sure your caps lock is off).</Alert>}
        <form onSubmit={handleSubmit}>
          <Input type="text" hasFeedback name="username" label="Email" placeholder="Email" {...username}/>
          {username.touched && username.error && <div className="login-field-error">{username.error}</div>}

          <Input type="password" hasFeedback name="password" label="Password" placeholder="Password" {...password}/>
          {password.touched && password.error && <div className="login-field-error">{password.error}</div>}

          <Input type="checkbox" label="Remember me" checked={this.props.isRemember} onChange={this.onChangeRemember.bind(this)}/>
          <hr/>
          <Button type="submit" bsStyle="primary" className="pull-left" disabled={this.props.isPending} onClick={handleSubmit}>
            {this.props.isPending ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </div>
    )
  }
}

export const validateLogin = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Email is required';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  return errors;
};

const LoginFormDecorate = reduxForm({
  form: 'login',
  fields: ['username', 'password'],
  validate: validateLogin
})(LoginForm);

export default LoginFormDecorate
