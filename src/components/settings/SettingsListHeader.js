import React, { PropTypes } from 'react'
import {Button} from 'react-bootstrap'
import Spinner from '../Spinner'

export class SettingsListHeader extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    addButtonLabel: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    isAddPending: PropTypes.bool.isRequired,
    handleClickHeader: PropTypes.func.isRequired,
    handleClickAdd: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="panel-heading-inner" onClick={this.props.handleClickHeader}>
        <h3 className="panel-title pull-left">
          {this.props.title}&nbsp;<small>{this.props.length}</small>
        </h3>
        {this.props.isAddPending && <Spinner isSmallItem/>}
        {
          !this.props.isAddPending &&
          <Button bsStyle="link" className="pull-right no-padding" onClick={this.props.handleClickAdd}>
            <i className="fa fa-plus"/>&nbsp;{this.props.addButtonLabel}
          </Button>
        }
      </div>
    )
  }
}

export default SettingsListHeader
