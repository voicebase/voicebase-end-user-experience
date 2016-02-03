import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form';
import {Input, Button} from 'react-bootstrap'

class PredictionForm extends React.Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  cancel () {
    this.props.resetForm();
    this.props.onCancel();
  }

  render () {
    const {
      fields: { name, description, isDefault },
      handleSubmit
    } = this.props;

    return (
      <div>
        <form className="form-settings" onSubmit={handleSubmit}>
          <Input type="text" name="name" placeholder="Prediction Name" {...name} />
          {name.touched && name.error && <div className="login-field-error">{name.error}</div>}

          <Input type="textarea" name="description" placeholder="Description (Optional)" {...description} />
          <Input type="checkbox" name="isDefault" label="Default prediction model" {...isDefault} />
          <div className="buttons">
            <Button type="submit" bsStyle="success">Save</Button>
            <Button onClick={this.cancel.bind(this)}>Cancel</Button>
          </div>
        </form>
      </div>
    )
  }
}

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Prediction name is required';
  }
  return errors;
};

PredictionForm = reduxForm({
  form: 'prediction',
  fields: ['name', 'description', 'isDefault'],
  validate: validate
})(PredictionForm);

export default PredictionForm
