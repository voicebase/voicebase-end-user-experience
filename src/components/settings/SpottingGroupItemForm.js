import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form';
import {Input, Button} from 'react-bootstrap'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

class SpottingGroupItemForm extends React.Component {

  static propTypes = {
    group: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    isPending: PropTypes.bool
  };

  render () {
    const {
      fields: { name, description, isDefault, keywords },
      handleSubmit
    } = this.props;

    let initialSelectValue = [];
    let wordsValues = Object.keys(this.props.group.keywords).map(i => {
      let keyword = this.props.group.keywords[i];
      initialSelectValue = initialSelectValue.concat(keyword);
      return {
        value: keyword,
        label: keyword
      }
    });

    return (
      <div>
        <form className="form-settings" onSubmit={handleSubmit}>
          <Input type="text" name="name" placeholder="Group Name (Mandatory)" {...name} />
          {name.touched && name.error && <div className="login-field-error">{name.error}</div>}

          <div className="form-group">
            <Select name="keywords"
                    multi
                    allowCreate
                    options={wordsValues}
                    value={initialSelectValue.join(',')}
                    {...keywords}
                    onBlur={() => {}}
            />
          </div>

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
  fields: ['name', 'description', 'isDefault', 'keywords'],
  validate: validate
})(SpottingGroupItemForm);

export default SpottingGroupItemForm
