import React, { PropTypes } from 'react'
import {Collapse} from 'react-bootstrap'
import classnames from 'classnames';

export class MediaListItem extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  toggle(event) {
    if (event.target.type) return false; // prevent click on checkbox

    if (!this.props.isExpanded) {
      this.props.state.activeMediaId && this.props.actions.collapseMedia(this.props.state.activeMediaId);
      this.props.actions.expandMedia(this.props.mediaId);
    }
    else {
      this.props.actions.collapseMedia(this.props.mediaId);
    }
  }

  selectMedia(event) {
    if (event.target.checked) {
      this.props.actions.selectMedia(this.props.mediaId);
    }
    else {
      this.props.actions.unselectMedia(this.props.mediaId);
    }
  }

  render () {
    let itemClasses = classnames('list-group-item', 'listing', {collapsed: !this.props.isExpanded});

    return (
      <div>
        <div className={itemClasses} onClick={this.toggle.bind(this)}>
          <h4 className="list-group-item-heading">Title lorem ipsum dolor est compendum</h4>
          <p className="list-group-item-text">Uploaded Jan 5, 2010 | Length 00:05:16</p>
          <input type="checkbox" className="listing__checkbox" onChange={this.selectMedia.bind(this)} />
          <a href="#" className="listing__delete"><i className="fa fa-trash"/></a>
        </div>
        <Collapse in={this.props.isExpanded}>
          <div>
            123
          </div>
        </Collapse>
      </div>

    )
  }
}

export default MediaListItem
