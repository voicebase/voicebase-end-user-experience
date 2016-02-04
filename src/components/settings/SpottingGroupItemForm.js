import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form';
import {Input, Button} from 'react-bootstrap'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

class SpottingGroupItemForm extends React.Component {

  static propTypes = {
    keywordsSelectValue: PropTypes.array.isRequired,
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
      fields: { name, description, isDefault, keywords },
      handleSubmit,
      pristine
    } = this.props;

    return (
      <div>
        <form className="form-settings" onSubmit={handleSubmit}>
          <Input type="text" name="name" placeholder="Group Name (Mandatory)" {...name} />
          {name.touched && name.error && <div className="login-field-error">{name.error}</div>}

          <div className="form-group">
            <Select name="keywords"
                    placeholder="Add a word or phrase"
                    multi
                    allowCreate
                    options={this.props.keywordsSelectValue}
                    {...keywords}
                    onBlur={() => {}}
            />
          </div>
          {keywords.visited && keywords.error && <div className="login-field-error">{keywords.error}</div>}

          <Input type="textarea" name="description" placeholder="Description (Optional)" {...description} />
          <Input type="checkbox" name="isDefault" label="Default phrase group" {...isDefault} />
          <div className="buttons">
            <Button type="submit" bsStyle="success" disabled={pristine}>Save</Button>
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
    errors.name = 'Group name is required';
  }
  if (!values.keywords) {
    errors.keywords = 'Keywords are required';
  }
  return errors;
};

SpottingGroupItemForm = reduxForm({
  form: 'group',
  fields: ['name', 'description', 'isDefault', 'keywords'],
  validate: validate
})(SpottingGroupItemForm);

export default SpottingGroupItemForm
