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
    this.state = {
      jobsQueue: {
        fileStatus: false,
        keywordsStatus: false
      }
    };
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

  componentWillReceiveProps(nextProps) {
    let mediaDataState = nextProps.mediaDataState;
    let phasesStatus = this.getPhasesStatus(mediaDataState);
    this.updateQueueStatus(phasesStatus.fileStatus, phasesStatus.keywordsStatus);
  }

  getMediaData() {
    let mediaDataState = this.props.mediaDataState;
    let queue = this.state.jobsQueue;
    this.props.actions.getDataForMedia(this.props.token, this.props.mediaId);
    if (mediaDataState && (mediaDataState.status === 'finished' || mediaDataState.status === 'failed') && this.processingInterval) {
      if (mediaDataState.status === 'finished' && mediaDataState.jobTasks && (!queue.fileStatus || !queue.keywordsStatus)) {
        return false;
      }
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      setTimeout(() => {
        this.props.actions.removeProcessingMedia(this.props.mediaId);
        if (mediaDataState.status === 'finished') {
          this.props.actions.getMediaUrl(this.props.token, this.props.mediaId);
          this.props.actions.addMedia({
            mediaId: this.props.mediaId,
            status: mediaDataState.status,
            metadata: mediaDataState.metadata
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
      let status = (task.status === 'finished') ? 'completed' : 'progress';
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

  getPhasesStatus(mediaDataState) {
    let fileStatus = null;
    let keywordsStatus = null;
    let predictionStatus = null;
    if (mediaDataState && mediaDataState.jobTasks) {
      let jobTasks = mediaDataState.jobTasks || {};
      let processingTasks = this.parseTasks(jobTasks);

      let ingestStatus = this.getProgressStatus(processingTasks.ingest);
      let transcriptStatus = this.getProgressStatus(processingTasks.transcripts);
      fileStatus = {
        isProgress: ingestStatus.isProgress || transcriptStatus.isProgress,
        isCompleted: ingestStatus.isCompleted && transcriptStatus.isCompleted
      };
      if (processingTasks.keywords) {
        keywordsStatus = this.getProgressStatus(processingTasks.keywords);
      }
      else {
        keywordsStatus = {isProgress: false, isCompleted: true};
      }

      predictionStatus = processingTasks.prediction || processingTasks.detection;
    }
    return {
      fileStatus,
      keywordsStatus,
      predictionStatus
    }
  }

  updateQueueStatus(fileStatus, keywordsStatus) {
    let _keywordsStatus = (keywordsStatus && keywordsStatus.isCompleted && this.state.jobsQueue.fileStatus);
    let _fileStatus = (fileStatus && fileStatus.isCompleted);
    this.setState({
      jobsQueue: {
        keywordsStatus: _keywordsStatus,
        fileStatus: _fileStatus
      }
    });
  }

  render() {
    let mediaDataState = this.props.mediaDataState;
    let jobsQueue = this.state.jobsQueue;

    let phasesStatus = this.getPhasesStatus(mediaDataState);
    let fileStatus = phasesStatus.fileStatus;
    let keywordsStatus = phasesStatus.keywordsStatus;
    if (!jobsQueue.keywordsStatus && keywordsStatus && keywordsStatus.isCompleted) {
      keywordsStatus.isProgress = true;
      keywordsStatus.isCompleted = false;
    }
    let predictionStatus = phasesStatus.predictionStatus;

    let resultClasses = classnames('progress__step', {active: fileStatus && fileStatus.isCompleted && keywordsStatus && keywordsStatus.isCompleted});

    return (
      <div className="list-group-item listing listing--processing">
        <h4 className="list-group-item-heading">{this.props.mediaId}</h4>
        {(!mediaDataState || (mediaDataState && !mediaDataState.jobTasks)) &&
          <div className="progress">
            <div className="progress__step active">Processing</div>
          </div>
        }
        {(mediaDataState && mediaDataState.jobTasks) &&
          <div className="progress">
            <div className={this.getClasses(fileStatus)}>Transcript</div>
            <div className={this.getClasses(keywordsStatus)}>Analytics</div>
            {predictionStatus &&
              <div className="progress__step done">Prediction/detection</div>
            }
            <div className={resultClasses}>Results</div>
          </div>
        }
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }
}
