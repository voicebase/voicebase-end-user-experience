import React, { PropTypes } from 'react'
import {Collapse, Alert, Row, Col} from 'react-bootstrap'
import classnames from 'classnames';
import Spinner from './Spinner';
import VbsPlayerApp from './player/VbsPlayerApp';
import { parseTime } from '../common/Common';

export class MediaListItem extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    mediaId: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    listItemState: PropTypes.object.isRequired,
    mediaState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  getTitle() {
    let title = this.props.mediaId;
    let metadata = this.props.listItemState.metadata;
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
      this.props.mediaState.activeMediaId && this.props.actions.collapseMedia(this.props.mediaState.activeMediaId);
      if (!this.props.mediaState.mediaData.data[this.props.mediaId]) {
        this.props.actions.getMediaUrl(this.props.token, this.props.mediaId);
        this.props.actions.getDataForMedia(this.props.token, this.props.mediaId);
      }
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

  isGettingMediaData(mediaData) {
    return (mediaData && (mediaData.getPending || mediaData.getUrlPending));
  }

  render () {
    let itemClasses = classnames('list-group-item', 'listing', {collapsed: !this.props.isExpanded});
    let mediaState = this.props.mediaState;
    let media = this.props.listItemState;
    let mediaData = mediaState.mediaData.data[this.props.mediaId];
    let checked = media.checked;

    let duration = media.metadata.duration;
    let parsedDuration = parseTime(duration);

    return (
      <div>
        <div className={itemClasses} onClick={this.toggle.bind(this)}>
          <h4 className="list-group-item-heading">{this.getTitle()}</h4>
          <p className="list-group-item-text">
            Uploaded Jan 5, 2010
            { duration && <span> | Length {parsedDuration}</span> }
          </p>
          <input type="checkbox" className="listing__checkbox" checked={checked} onChange={this.selectMedia.bind(this)} />
          {media.deletePending && <Spinner isMediumItem/>}
          {!media.deletePending && <a href="#" className="listing__delete" onClick={this.deleteMedia.bind(this)}><i className="fa fa-trash"/></a>}

        </div>
        <Collapse in={this.props.isExpanded}>
          <div className="listing__body">
            {this.isGettingMediaData(mediaData) && <div className="spinner-media_item"><Spinner/></div>}
            {
              mediaData && mediaData.status === 'failed' &&
              <Row className="row-without-margin">
                <Col sm={12}>
                  <Alert bsStyle="danger">
                    <h4>Upload was failed</h4>
                  </Alert>
                </Col>
              </Row>
            }
            {
              !this.isGettingMediaData(mediaData) && mediaData && mediaData.data && mediaData.status === 'finished' &&
              <VbsPlayerApp token={this.props.token}
                            mediaId={this.props.mediaId}
                            mediaState={mediaState}
                            actions={this.props.actions}/>
            }
          </div>
        </Collapse>
      </div>

    )
  }
}

export default MediaListItem
