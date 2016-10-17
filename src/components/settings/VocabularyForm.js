import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form';
import { Button, FormGroup, FormControl } from 'react-bootstrap'
import { Creatable } from 'react-select'
import 'react-select/dist/react-select.css'
import TextDropzone from '../TextDropzone'

class VocabularyForm extends React.Component {

  static propTypes = {
    termsSelectValue: PropTypes.array.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  cancel = () => {
    this.props.resetForm();
    this.props.onCancel();
  };

  onBlur = () => {};

  render () {
    const {
      fields: { name, terms, termsFiles },
      handleSubmit,
      pristine
    } = this.props;

    const termsFilesValue = termsFiles.value || null;

    return (
      <div>
        <form className="form-settings" onSubmit={handleSubmit}>
          <FormGroup>
            <FormControl
              type="text"
              name="name"
              placeholder="Terms list name (Mandatory)"
              {...name}
            />
          </FormGroup>
          {name.touched && name.error && <div className="login-field-error">{name.error}</div>}

          <FormGroup>
            <Creatable
              name="terms"
              placeholder="Add a word or phrase"
              multi
              options={this.props.termsSelectValue}
              {...terms}
              onBlur={this.onBlur}
            />
          </FormGroup>
          {terms.visited && terms.error && <div className="login-field-error">{terms.error}</div>}

          <FormGroup>
            <TextDropzone
              {...termsFiles}
              value={termsFilesValue}
            />
          </FormGroup>

          <div className="buttons">
            <Button type="submit" bsStyle="success" disabled={pristine}>Save</Button>
            <Button bsStyle="link" onClick={this.cancel}>Cancel</Button>
          </div>
        </form>
      </div>
    )
  }
}

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Name is required';
  }
  if (!values.terms) {
    errors.terms = 'Terms are required';
  }
  return errors;
};

VocabularyForm = reduxForm({
  form: 'vocabulary',
  fields: ['name', 'terms', 'termsFiles'],
  validate: validate
})(VocabularyForm);

export default VocabularyForm
