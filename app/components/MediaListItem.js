import React, { PropTypes } from 'react'
import {Collapse} from 'react-bootstrap'
import classnames from 'classnames';
import MediaListItemTitle from './MediaListItemTitle';
import Spinner from './Spinner';
import { VoicebasePlayer } from 'voicebase-player-v2';
import { parseTime, getDateLabel } from '../common/Common';
import { baseUrl } from '../api/baseUrl'

export class MediaListItem extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    mediaId: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    listItemState: PropTypes.object.isRequired,
    searchString: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
  };

  toggle = (event) => {
    if (event.target.type) return false; // prevent click on checkbox

    if (!this.props.isExpanded) {
      this.props.actions.expandMedia(this.props.mediaId);
    }
    else {
      this.props.actions.collapseMedia(this.props.mediaId);
    }
  };

  selectMedia = (event) => {
    if (event.target.checked) {
      this.props.actions.selectMedia(this.props.mediaId);
    }
    else {
      this.props.actions.unselectMedia(this.props.mediaId);
    }
  };

  deleteMedia = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.deleteMedia(this.props.token, this.props.mediaId);
  };

  getPlayerApp() {
    return (
      <VoicebasePlayer
        apiUrl={baseUrl}
        token={this.props.token}
        mediaId={this.props.mediaId}
        searchString={this.props.searchString}
      />
    );
  }

  render () {
    let itemClasses = classnames('list-group-item', 'listing', {collapsed: !this.props.isExpanded});
    let media = this.props.listItemState;

    let checked = media.checked;

    let duration = null;
    if (media.metadata && media.metadata.length && media.metadata.length.milliseconds) {
      duration = media.metadata.length.milliseconds / 1000;
    }
    let parsedDuration = parseTime(duration);

    const dateCreated = media.dateCreated;
    let dateLabel = (dateCreated) ? getDateLabel(dateCreated) : null;

    return (
      <div>
        <div className={itemClasses} onClick={this.toggle}>
          <MediaListItemTitle
            mediaId={this.props.mediaId}
            metadata={media.metadata}
          />
          <p className="list-group-item-text">
            {dateLabel && <span>Uploaded {dateLabel} |</span>}
            &nbsp;
            {duration && <span>Length {parsedDuration}</span>}
          </p>
          <input type="checkbox" className="listing__checkbox" checked={checked} onChange={this.selectMedia} />
          {media.deletePending && <Spinner isMediumItem />}
          {!media.deletePending && <a href="#" className="listing__delete" onClick={this.deleteMedia}><i className="fa fa-trash" /></a>}
        </div>
        <Collapse in={this.props.isExpanded}>
          <div className="listing__body">
            {this.props.isExpanded && this.getPlayerApp()}
          </div>
        </Collapse>
      </div>

    )
  }
}

export default MediaListItem
