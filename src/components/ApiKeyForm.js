import React, { PropTypes } from 'react'
import {Button, Input} from 'react-bootstrap'
import { reduxForm } from 'redux-form';

class ApiKeyForm extends React.Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  render () {
    const {
      fields: { username },
      handleSubmit
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
           <Input type="text" hasFeedback name="username" label="Email" placeholder="Email" {...username}/>
        <Button type="submit" bsStyle="primary" className="pull-left" onClick={handleSubmit}>
          Create Key
        </Button>
      </form>
    )
  }
}

ApiKeyForm = reduxForm({
  form: 'key',
  fields: ['username']
})(ApiKeyForm);

export default ApiKeyForm
