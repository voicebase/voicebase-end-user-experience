import React from 'react';
import { shallowRender } from '../../src/common/Test'

import { LoginForm, validateLogin } from '../../src/components/LoginForm'
import {FormControl, Checkbox, Button, Alert} from 'react-bootstrap'

describe('LoginForm component', function () {
  let component;
  let options = {
    fields: {
      username: {
        touched: false,
        error: '',
        value: 'user'
      },
      password: {
        touched: false,
        error: '',
        value: 'pass'
      }
    },
    handleSubmit: function () {},
    handleRemember: function () {},
    isRemember: true,
    errorMessage: '',
    isPending: false
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return shallowRender(
      <LoginForm fields={props.fields}
                 handleSubmit={props.handleSubmit}
                 handleRemember={props.handleRemember}
                 isRemember={props.isRemember}
                 errorMessage={props.errorMessage}
                 isPending={props.isPending}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
  });

  it('Check type', function() {
    assert.equal(component.type, 'div');
  });

  it('Check empty error message', function() {
    assert.equal(component.props.children[0], '');
  });

  it('Check error message', function() {
    component = getComponent({errorMessage: 'error'});
    let errMsg = component.props.children[0];
    assert.equal(errMsg.type, Alert);
    assert.equal(errMsg.props.bsStyle, 'danger');
  });

  describe('Check form', function () {
    let form;

    let getForm = function () {
      return component.props.children[1];
    };

    beforeEach(function () {
      form = getForm();
    });

    it('Check form type', function() {
      assert.equal(form.type, 'form');
    });

    it('check onSubmit() is called', function() {
      const handleSubmit = sinon.spy();
      component = getComponent({handleSubmit});
      form = getForm();
      form.props.onSubmit();
      assert.isTrue(handleSubmit.calledOnce);
    });

    it('check UserName input', function() {
      let formGroup = form.props.children[0];
      let userField = formGroup.props.children[1];
      let userError = formGroup.props.children[3];
      assert.equal(userField.props.type, 'text');
      assert.equal(userField.props.name, 'username');
      assert.equal(userField.props.label, 'Email');
      assert.equal(userField.props.placeholder, 'Email');
      assert.equal(userField.props.value, 'user');
      assert.equal(userError, null);
    });

    it('check error for UserName input', function() {
      let props = {
        ...options,
        fields: {
          ...options.fields,
          username: {
            ...options.fields.username,
            touched: true,
            error: 'error',
            value: ''
          }
        }
      };
      component = getComponent(props);
      form = getForm();
      let formGroup = form.props.children[0];
      let userError = formGroup.props.children[3];
      assert.equal(userError.props.children, 'error');
    });

    it('check Password input', function() {
      let formGroup = form.props.children[1];
      let passwordField = formGroup.props.children[1];
      let passwordError = formGroup.props.children[3];
      assert.equal(passwordField.props.type, 'password');
      assert.equal(passwordField.props.name, 'password');
      assert.equal(passwordField.props.label, 'Password');
      assert.equal(passwordField.props.placeholder, 'Password');
      assert.equal(passwordField.props.value, 'pass');
      assert.equal(passwordError, null);
    });

    it('check error for Password input', function() {
      let props = {
        ...options,
        fields: {
          ...options.fields,
          password: {
            ...options.fields.password,
            touched: true,
            error: 'error',
            value: ''
          }
        }
      };
      component = getComponent(props);
      form = getForm();
      let formGroup = form.props.children[1];
      let passwordError = formGroup.props.children[3];
      assert.equal(passwordError.props.children, 'error');
    });

    it('check Remember me checkbox', function() {
      let checkboxField = form.props.children[2];
      assert.equal(checkboxField.type, Checkbox);
      assert.equal(checkboxField.props.checked, options.isRemember);
    });

    it('check changing Remember me', function() {
      const handleRemember = sinon.spy();
      component = getComponent({handleRemember});
      form = getForm();
      let checkboxField = form.props.children[2];
      let mockEvent = {target: {checked: false}};
      checkboxField.props.onChange(mockEvent);
      assert.isTrue(handleRemember.calledOnce);
    });

    it('check submit Button', function() {
      let btn = form.props.children[4];
      assert.equal(btn.type, Button);
      assert.equal(btn.props.type, 'submit');
      assert.equal(btn.props.disabled, false);
      assert.equal(btn.props.children, 'Sign In');
    });

    it('check submit Button if form pending', function() {
      component = getComponent({
        ...options,
        isPending: true
      });
      form = getForm();
      let btn = form.props.children[4];
      assert.equal(btn.props.disabled, true);
      assert.equal(btn.props.children, 'Signing In...');
    });

    it('check click submit button', function() {
      const handleSubmit = sinon.spy();
      component = getComponent({handleSubmit});
      form = getForm();
      let btn = form.props.children[4];
      btn.props.onClick();
      assert.isTrue(handleSubmit.calledOnce);
    });

  });

  describe('validateLogin function', function () {
    it('without errors', function() {
      let res = validateLogin({
        username: 'user',
        password: 'password'
      });
      expect(res).to.eql({});
    });

    it('require Username', function() {
      let res = validateLogin({
        username: '',
        password: 'pass'
      });
      expect(res).to.eql({username: 'Email is required'});
    });

    it('require Password', function() {
      let res = validateLogin({
        username: 'user',
        password: ''
      });
      expect(res).to.eql({password: 'Password is required'});
    });

    it('require Password and Username', function() {
      let res = validateLogin({
        username: '',
        password: ''
      });
      expect(res).to.eql({
        username: 'Email is required',
        password: 'Password is required'
      });
    });

  });
});

