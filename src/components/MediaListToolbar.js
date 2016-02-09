import React, { PropTypes } from 'react'
import {ButtonGroup, Button} from 'react-bootstrap'

export class MediaListToolbar extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    selectedMediaIds: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  selectAll() {
    this.props.actions.selectAllMedia();
  }

  unselectAll() {
    this.props.actions.unselectAllMedia();
  }

  deleteSelected() {
    this.props.selectedMediaIds.forEach(id => {
      this.props.actions.deleteMedia(this.props.token, id);
    });
  }

  render () {
    let countIds = this.props.selectedMediaIds.length;
    let style = {
      opacity: countIds > 0 ? 1 : 0,
      maxHeight: countIds > 0 ? '50px' : 0,
      padding: countIds > 0 ? '0 20px 20px' : '0 20px'
    };

    return (
        <div className='listings__toolbar' style={style}>
          <ButtonGroup bsSize="small">
            <Button className="btn-count" disabled>
              <span className="count">{countIds}</span> selected files
            </Button>
            <Button onClick={this.deleteSelected.bind(this)}>
              <i className="fa fa-trash" /> Delete selected
            </Button>
            <Button onClick={this.selectAll.bind(this)}>Select all</Button>
            <Button onClick={this.unselectAll.bind(this)}>Deselect all</Button>
          </ButtonGroup>
        </div>
    )
  }
}

export default MediaListToolbar
