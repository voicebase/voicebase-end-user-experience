import React, { PropTypes } from 'react'
import classnames from 'classnames'
import NotificationSystem from 'react-notification-system'

export default class ProcessingListItem extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    mediaId: PropTypes.string.isRequired,
    mediaDataState: PropTypes.object,
    actions: PropTypes.object.isRequired
  };

  processingInterval = null;

  componentWillMount() {
    console.log('Upload interval');
    if (!this.props.mediaDataState) {
      this.processingInterval = setInterval(() => {
        this.getMediaData();
      }, 5000)
    }
  }

  componentWillUnmount() {
    console.log('Clear upload interval');
    clearInterval(this.processingInterval);
  }

  getMediaData() {
    let mediaDataState = this.props.mediaDataState;
    this.props.actions.getDataForMedia(this.props.token, this.props.mediaId);
    if (mediaDataState && (mediaDataState.status === 'finished' || mediaDataState.status === 'failed') && this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      setTimeout(() => {
        this.props.actions.removeProcessingMedia(this.props.mediaId);
        if (mediaDataState.status === 'finished') {
          this.props.actions.getMediaUrl(this.props.token, this.props.mediaId);
          this.props.actions.addMedia({
            mediaId: this.props.mediaId,
            status: mediaDataState.data.status,
            metadata: mediaDataState.data.metadata
          });
        }
        else {
          this.refs.notificationSystem.addNotification({
            message: 'Upload was failed',
            level: 'error'
          });
        }
      });
    }
  }

  parseTasks(jobTasks) {
    let processingTasks = {};
    Object.keys(jobTasks).forEach(taskId => {
      let task = jobTasks[taskId];
      let status = (task.status === 'completed') ? 'completed' : 'progress';
      if (!processingTasks[task.phase]) {
        processingTasks[task.phase] = {
          completed: [],
          progress: [],
          counter: 0
        };
      }
      processingTasks[task.phase][status].push(task);
      processingTasks[task.phase].counter++;
    });
    return processingTasks;
  }

  getProgressStatus(phase) {
    let isProgress = (phase.progress.length > 0);
    let isCompleted = (phase.completed.length === phase.counter);
    return {isProgress, isCompleted};
  }

  getClasses(status) {
    return classnames('progress__step', {'active': status && status.isProgress, 'done': status && status.isCompleted});
  }

  render() {
    let mediaDataState = this.props.mediaDataState;

    let fileStatus, keywordsStatus;
    if (mediaDataState && mediaDataState.jobTasks) {
      let jobTasks = mediaDataState.jobTasks || {};
      let processingTasks = this.parseTasks(jobTasks);

      let ingestStatus = this.getProgressStatus(processingTasks.ingest);
      let transcriptStatus = this.getProgressStatus(processingTasks.transcripts);
      fileStatus = {
        isProgress: ingestStatus.isProgress || transcriptStatus.isProgress,
        isCompleted: ingestStatus.isCompleted && transcriptStatus.isCompleted
      };
      keywordsStatus = this.getProgressStatus(processingTasks.keywords);
    }

    let resultClasses = classnames('progress__step', {active: fileStatus && fileStatus.isCompleted && keywordsStatus && keywordsStatus.isCompleted});

    return (
      <div className="list-group-item listing listing--processing">
        <h4 className="list-group-item-heading">{this.props.mediaId}</h4>
        {
          (!mediaDataState || (mediaDataState && !mediaDataState.jobTasks)) &&
          <div className="progress">
            <div className="progress__step active">Processing</div>
          </div>
        }
        {
          (mediaDataState && mediaDataState.jobTasks) &&
          <div className="progress">
            <div className={this.getClasses(fileStatus)}>File processing</div>
            <div className={this.getClasses(keywordsStatus)}>Analytics</div>
            <div className="progress__step done">Prediction/detection</div>
            <div className={resultClasses}>Results</div>
          </div>
        }
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }
}
