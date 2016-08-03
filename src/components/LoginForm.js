import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form';
import {FormGroup, FormControl, ControlLabel, HelpBlock, Checkbox, Button, Alert} from 'react-bootstrap'

export class LoginForm extends React.Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleRemember: PropTypes.func.isRequired,
    isRemember: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    isPending: PropTypes.bool.isRequired
  };

  hasFieldError (field) {
    return field.touched && field.error;
  }

  getValidState (field) {
    if (!field.touched) return undefined;
    const hasError = this.hasFieldError(field);
    return (!hasError) ? 'success' : 'error';
  }

  onChangeRemember = (event) => {
    this.props.handleRemember(event.target.checked);
  };

  getErrorMessage (field) {
    if (!(this.hasFieldError(field))) return null;
    return (
      <HelpBlock>{field.error}</HelpBlock>
    )
  }

  render () {
    const {
      fields: { username, password },
      handleSubmit
    } = this.props;

    const emailValid = this.getValidState(username);
    const passwordValid = this.getValidState(password);

    return (
      <div>
        {this.props.errorMessage &&
          <Alert bsStyle="danger">
            The API Key or Password you entered are incorrect. Please try again (make sure your caps lock is off).
          </Alert>
        }
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="name" validationState={emailValid}>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              type="text"
              name="username"
              label="Email"
              placeholder="Email"
              {...username}
            />
            <FormControl.Feedback />
            {this.getErrorMessage(username)}
          </FormGroup>

          <FormGroup controlId="password" validationState={passwordValid}>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type="password"
              name="password"
              label="Password"
              placeholder="Password"
              {...password}
            />
            <FormControl.Feedback />
            {this.getErrorMessage(password)}
          </FormGroup>

          <Checkbox checked={this.props.isRemember} onChange={this.onChangeRemember}>
            Remember me
          </Checkbox>
          <hr />
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
