import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form';
import {Input, Button} from 'react-bootstrap'

class NumbersForm extends React.Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  cancel () {
    this.props.resetForm();
    this.props.onCancel();
  }

  render () {
    const {
      fields: { displayName, description, isDefault },
      handleSubmit,
      pristine
    } = this.props;

    return (
      <div>
        <form className="form-settings" onSubmit={handleSubmit}>
          <Input type="text" name="name" placeholder="Number Name" {...displayName} />
          {displayName.touched && displayName.error && <div className="login-field-error">{displayName.error}</div>}

          <Input type="textarea" name="description" placeholder="Description (Optional)" {...description} />
          <Input type="checkbox" name="isDefault" label="Default number format" {...isDefault} />
          <div className="buttons">
            <Button type="submit" bsStyle="success" disabled={pristine}>Save</Button>
            <Button bsStyle="link" onClick={this.cancel.bind(this)}>Cancel</Button>
          </div>
        </form>
      </div>
    )
  }
}

const validate = values => {
  const errors = {};
  if (!values.displayName) {
    errors.displayName = 'Number name is required';
  }
  return errors;
};

NumbersForm = reduxForm({
  form: 'numbers',
  fields: ['displayName', 'description', 'isDefault'],
  validate: validate
})(NumbersForm);

export default NumbersForm
