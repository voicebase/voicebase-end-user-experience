import React, { PropTypes } from 'react'
import {Input, Collapse} from 'react-bootstrap'

export class MediaListItem extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  render () {
    return (
      <div>
        <div className="list-group-item listing collapsed" onClick={this.toggle.bind(this)}>
          <h4 className="list-group-item-heading">Title lorem ipsum dolor est compendum</h4>
          <p className="list-group-item-text">Uploaded Jan 5, 2010 | Length 00:05:16</p>
          <input type="checkbox" className="listing__checkbox" />
          <a href="#" className="listing__delete"><i className="fa fa-trash"/></a>
        </div>
        <Collapse in={this.state.open}>
          <div>
            123
          </div>
        </Collapse>
      </div>

    )
  }
}

export default MediaListItem
