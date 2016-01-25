import React, { PropTypes } from 'react'
import {Collapse} from 'react-bootstrap'
import classnames from 'classnames';
import Spinner from './Spinner';

export class MediaListItem extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    mediaId: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  getTitle() {
    let title = this.props.mediaId;
    let metadata = this.props.state.media[this.props.mediaId].metadata;
    if (metadata && metadata.external && metadata.external.id) {
      title = metadata.external.id;
    }
    if (metadata && metadata.title) {
      title = metadata.title;
    }
    return title;
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

  deleteMedia(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.deleteMedia(this.props.token, this.props.mediaId);
  }

  render () {
    let itemClasses = classnames('list-group-item', 'listing', {collapsed: !this.props.isExpanded});
    let media = this.props.state.media[this.props.mediaId];
    let checked = media.checked;

    return (
      <div>
        <div className={itemClasses} onClick={this.toggle.bind(this)}>
          <h4 className="list-group-item-heading">{this.getTitle()}</h4>
          <p className="list-group-item-text">Uploaded Jan 5, 2010 | Length 00:05:16</p>
          <input type="checkbox" className="listing__checkbox" checked={checked} onChange={this.selectMedia.bind(this)} />
          {media.deletePending && <div className="spinner-remove_item"><Spinner/></div>}
          {!media.deletePending && <a href="#" className="listing__delete" onClick={this.deleteMedia.bind(this)}><i className="fa fa-trash"/></a>}

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
