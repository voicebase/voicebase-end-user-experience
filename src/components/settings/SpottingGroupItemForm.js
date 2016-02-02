import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form';
import {Input, Button} from 'react-bootstrap'

class SpottingGroupItemForm extends React.Component {

  static propTypes = {
    formId: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    isPending: PropTypes.bool
  };

  render () {
    const {
      fields: { name, description, isDefault },
      handleSubmit
    } = this.props;

    return (
      <div>
        <form className="form-settings" onSubmit={handleSubmit}>
          <Input type="text" name="name" placeholder="Group Name (Mandatory)" {...name} />
          {name.touched && name.error && <div className="login-field-error">{name.error}</div>}
          <Input type="textarea" name="description" placeholder="Description (Optional)" {...description} />
          <Input type="checkbox" name="isDefault" label="Default phrase spotting group" {...isDefault} />
          <div className="buttons">
            <Button type="submit" bsStyle="success">Save</Button>
            <Button>Cancel</Button>
          </div>
        </form>
      </div>
    )
  }
}

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Group name is required';
  }
  return errors;
};

SpottingGroupItemForm = reduxForm({
  form: 'group',
  fields: ['name', 'description', 'isDefault'],
  validate: validate
})(SpottingGroupItemForm);

export default SpottingGroupItemForm
