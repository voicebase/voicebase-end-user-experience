import React, { PropTypes } from 'react'
import {Collapse, Alert, Row, Col} from 'react-bootstrap'
import classnames from 'classnames';
import MediaListItemTitle from './MediaListItemTitle';
import Spinner from './Spinner';
import VbsPlayerApp from './player/VbsPlayerApp';
import { parseTime, getDateLabel } from '../common/Common';

export class MediaListItem extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    mediaId: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    listItemState: PropTypes.object.isRequired,
    mediaState: PropTypes.object.isRequired,
    searchString: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
  };

  toggle(event) {
    if (event.target.type) return false; // prevent click on checkbox

    if (!this.props.isExpanded) {
      if (!this.props.mediaState.mediaData.has(this.props.mediaId)) {
        this.props.actions.getMediaUrl(this.props.token, this.props.mediaId);
        this.props.actions.getDataForMedia(this.props.token, this.props.mediaId, this.props.searchString);
      }
      this.props.actions.expandMedia(this.props.mediaId);
    }
    else {
      this.props.actions.collapseMedia(this.props.mediaId);
      this.props.actions.removeDataForMedia(this.props.mediaId);
      this.props.actions.destroyPlayer(this.props.mediaId);
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

  isGettingMediaData(mediaData) {
    return (mediaData && (mediaData.getPending || mediaData.getUrlPending));
  }

  getPlayerApp() {
    let state = this.props.mediaState;
    let mediaId = this.props.mediaId;
    let playerState = state.player.hasIn(['players', mediaId])
      ? state.player.getIn(['players', mediaId]).toJS()
      : {loading: true};

    let mediaDataState = state.mediaData.has(this.props.mediaId)
      ? state.mediaData.get(this.props.mediaId).toJS()
      : null;

    let markersState = state.markers.has(mediaId)
      ? state.markers.get(mediaId).toJS()
      : null;

    return (
      <VbsPlayerApp
        token={this.props.token}
        mediaId={this.props.mediaId}
        playerState={playerState}
        mediaDataState={mediaDataState}
        markersState={markersState}
        actions={this.props.actions}
      />
    );
  }

  render () {
    let itemClasses = classnames('list-group-item', 'listing', {collapsed: !this.props.isExpanded});
    let mediaState = this.props.mediaState;
    let media = this.props.listItemState;
    let mediaData = mediaState.mediaData.has(this.props.mediaId)
      ? mediaState.mediaData.get(this.props.mediaId).toJS()
      : null;

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
        <div className={itemClasses} onClick={this.toggle.bind(this)}>
          <MediaListItemTitle
            mediaId={this.props.mediaId}
            metadata={media.metadata}
          />
          <p className="list-group-item-text">
            {dateLabel && <span>Uploaded {dateLabel} |</span>}
            &nbsp;
            {duration && <span>Length {parsedDuration}</span>}
          </p>
          <input type="checkbox" className="listing__checkbox" checked={checked} onChange={this.selectMedia.bind(this)} />
          {media.deletePending && <Spinner isMediumItem />}
          {!media.deletePending && <a href="#" className="listing__delete" onClick={this.deleteMedia.bind(this)}><i className="fa fa-trash" /></a>}
        </div>
        <Collapse in={this.props.isExpanded}>
          <div className="listing__body">
            {this.isGettingMediaData(mediaData) && <div className="spinner-media_item"><Spinner /></div>}
            {mediaData && mediaData.status === 'failed' &&
              <Row className="row-without-margin">
                <Col sm={12}>
                  <Alert bsStyle="danger">
                    <h4>Upload was failed</h4>
                  </Alert>
                </Col>
              </Row>
            }
            {!this.isGettingMediaData(mediaData) && mediaData && mediaData.status === 'finished' &&
              this.getPlayerApp()
            }
          </div>
        </Collapse>
      </div>

    )
  }
}

export default MediaListItem
