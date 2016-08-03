import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils'
import { fromJS } from 'immutable'
import ProcessingListItem from '../../../src/components/upload/ProcessingListItem'

describe('ProcessingListItem component', function () {
  let component;
  let rootElement;

  let options = {
    token: 'token',
    mediaId: 'mediaId',
    mediaDataState: {
      mediaId: "mediaId",
      status: "finished"
    },
    actions: {
      getDataForMedia: function(token, mediaId){},
      removeProcessingMedia: function(mediaId){},
      getMediaUrl: function(token, mediaId){},
      addMedia: function({}){}
    }
  };

  let tasks = fromJS({
    "j1": {
      "taskId": "j1",
      "dependents": [
        "j7"
      ],
      "status": "progress",
      "dependencies": [],
      "display": "Ingest",
      "phase": "ingest"
    },
    "j2": {
      "taskId": "j2",
      "dependents": [
        "j3"
      ],
      "status": "progress",
      "dependencies": [
        "j7"
      ],
      "display": "Transcripts",
      "phase": "transcripts"
    },
    "j3": {
      "taskId": "j3",
      "dependents": [
        "j4"
      ],
      "status": "progress",
      "dependencies": [
        "j2"
      ],
      "display": "Transcripts",
      "phase": "transcripts"
    },
    "j4": {
      "taskId": "j4",
      "dependents": [
        "j5"
      ],
      "status": "progress",
      "dependencies": [
        "j3"
      ],
      "display": "Transcripts",
      "phase": "transcripts"
    },
    "j5": {
      "taskId": "j5",
      "dependents": [
        "j6"
      ],
      "status": "progress",
      "dependencies": [
        "j4"
      ],
      "display": "Keywords",
      "phase": "keywords"
    },
    "j6": {
      "taskId": "j6",
      "dependents": [],
      "status": "progress",
      "dependencies": [
        "j5"
      ],
      "display": "Keywords",
      "phase": "keywords"
    },
    "j7": {
      "taskId": "j7",
      "dependents": [
        "j2"
      ],
      "status": "progress",
      "dependencies": [
        "j1"
      ],
      "generator": "f05f2619-67f4-48e3-9502-35a17486d584",
      "display": "Transcripts",
      "phase": "transcripts"
    },
    "j8": {
      "taskId": "j8",
      "status": "progress",
      "display": "Prediction",
      "phase": "prediction"
    }
  });

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <ProcessingListItem token={props.token}
                          mediaId={props.mediaId}
                          mediaDataState={props.mediaDataState}
                          actions={props.actions}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
  });

  afterEach(function () {
    component.componentWillUnmount();
  });

  it('Check root element', function() {
    assert.equal(rootElement.tagName, 'DIV');
    assert.equal(rootElement.className, 'list-group-item listing listing--processing');
  });

  it('Check heading', function() {
    let header = TestUtils.findRenderedDOMComponentWithClass(component, 'list-group-item-heading');
    assert.equal(header.textContent, options.mediaId);
  });

  it('Check process bar if no jobs', function() {
    let progress = TestUtils.findRenderedDOMComponentWithClass(component, 'progress');
    assert.equal(progress.childElementCount, 1);
    let progressStep = progress.children[0];
    assert.equal(progressStep.textContent, 'Processing');
  });

  it('Check process bar with jobs, where all tasks in progress', function() {
    component = getComponent({
      ...options,
      mediaDataState: {
        ...options.mediaDataState,
        jobTasks: tasks.toJS()
      }
    });
    rootElement = ReactDom.findDOMNode(component);
    let progress = TestUtils.findRenderedDOMComponentWithClass(component, 'progress');
    let steps = progress.children;
    assert.equal(steps[0].className, 'progress__step active');
    assert.equal(steps[0].textContent, 'Transcript');
    assert.equal(steps[1].className, 'progress__step active');
    assert.equal(steps[1].textContent, 'Analytics');
    assert.equal(steps[2].className, 'progress__step done');
    assert.equal(steps[2].textContent, 'Prediction/detection');
    assert.equal(steps[3].className, 'progress__step');
    assert.equal(steps[3].textContent, 'Results');
  });

  it('Check process bar if Ingest tasks are completed', function() {
    component = getComponent({
      ...options,
      mediaDataState: {
        ...options.mediaDataState,
        jobTasks: tasks
          .setIn(['j1', 'status'], 'completed')
          .toJS()
      }
    });
    rootElement = ReactDom.findDOMNode(component);
    let progress = TestUtils.findRenderedDOMComponentWithClass(component, 'progress');
    let steps = progress.children;
    assert.equal(steps[0].className, 'progress__step active');
    assert.equal(steps[1].className, 'progress__step active');
    assert.equal(steps[2].className, 'progress__step done');
    assert.equal(steps[3].className, 'progress__step');
  });

  it('Check process bar if Ingest and Transcript tasks are completed', function() {
    component = getComponent({
      ...options,
      mediaDataState: {
        ...options.mediaDataState,
        jobTasks: tasks
          .setIn(['j1', 'status'], 'completed')
          .setIn(['j2', 'status'], 'completed')
          .setIn(['j3', 'status'], 'completed')
          .setIn(['j4', 'status'], 'completed')
          .setIn(['j7', 'status'], 'completed')
          .toJS()
      }
    });
    rootElement = ReactDom.findDOMNode(component);
    let progress = TestUtils.findRenderedDOMComponentWithClass(component, 'progress');
    let steps = progress.children;
    assert.equal(steps[0].className, 'progress__step done');
    assert.equal(steps[1].className, 'progress__step done');
    assert.equal(steps[2].className, 'progress__step done');
    assert.equal(steps[3].className, 'progress__step');
  });

  it('Check process bar if Keywords tasks are completed, but Ingest and Transcript tasks are not completed', function() {
    component = getComponent({
      ...options,
      mediaDataState: {
        ...options.mediaDataState,
        jobTasks: tasks
          .setIn(['j5', 'status'], 'completed')
          .setIn(['j6', 'status'], 'completed')
          .toJS()
      }
    });
    rootElement = ReactDom.findDOMNode(component);
    let progress = TestUtils.findRenderedDOMComponentWithClass(component, 'progress');
    let steps = progress.children;
    assert.equal(steps[0].className, 'progress__step active');
    assert.equal(steps[1].className, 'progress__step active');
    assert.equal(steps[2].className, 'progress__step done');
    assert.equal(steps[3].className, 'progress__step');
  });

  it('Check process bar if all tasks are completed', function() {
    component = getComponent({
      ...options,
      mediaDataState: {
        ...options.mediaDataState,
        jobTasks: tasks
          .setIn(['j1', 'status'], 'completed')
          .setIn(['j2', 'status'], 'completed')
          .setIn(['j3', 'status'], 'completed')
          .setIn(['j4', 'status'], 'completed')
          .setIn(['j5', 'status'], 'completed')
          .setIn(['j6', 'status'], 'completed')
          .setIn(['j7', 'status'], 'completed')
          .setIn(['j8', 'status'], 'completed')
          .toJS()
      }
    });
    component.setState({
      jobsQueue: {
        keywordsStatus: true,
        fileStatus: true
      }
    });
    rootElement = ReactDom.findDOMNode(component);
    let progress = TestUtils.findRenderedDOMComponentWithClass(component, 'progress');
    let steps = progress.children;
    assert.equal(steps[0].className, 'progress__step done');
    assert.equal(steps[1].className, 'progress__step done');
    assert.equal(steps[2].className, 'progress__step done');
    assert.equal(steps[3].className, 'progress__step done');
  });

  it('Check getDataForMedia() call', function() {
    let getDataForMedia = sinon.spy();
    component = getComponent({
      ...options,
      mediaDataState: null,
      actions: {
        ...options.actions,
        getDataForMedia: getDataForMedia
      }
    });
    component.getMediaData();
    assert.isTrue(getDataForMedia.calledOnce);
  });

  it('Check getMediaData() with status == finished', function() {
    var clock = sinon.useFakeTimers();
    let getDataForMedia = sinon.spy();
    let getMediaUrl = sinon.spy();
    let addMedia = sinon.spy();
    component = getComponent({
      ...options,
      mediaDataState: {
        mediaId: "mediaId",
        status: "finished",
        data: {
          status: "finished",
          metadata: {}
        }
      },
      actions: {
        ...options.actions,
        getDataForMedia,
        getMediaUrl,
        addMedia
      }
    });
    component.processingInterval = 1;
    component.getMediaData();
    clock.tick(1000);
    assert.isTrue(getDataForMedia.calledOnce);
    assert.isTrue(getMediaUrl.calledOnce);
    assert.isTrue(addMedia.calledOnce);
    clock.restore();
  });

  it('Check getMediaData() with jobTasks and status == finished', function() {
    component = getComponent({
      ...options,
      mediaDataState: {
        mediaId: "mediaId",
        status: "finished",
        jobTasks: tasks.toJS(),
        data: {
          status: "finished",
          metadata: {}
        }
      }
    });
    component.processingInterval = 1;
    let res = component.getMediaData();
    assert.isFalse(res);
  });

  it('Check getMediaData() with status == failed', function() {
    var clock = sinon.useFakeTimers();
    let getDataForMedia = sinon.spy();
    let getMediaUrl = sinon.spy();
    let addMedia = sinon.spy();
    component = getComponent({
      ...options,
      mediaDataState: {
        mediaId: "mediaId",
        status: "failed"
      },
      actions: {
        ...options.actions,
        getDataForMedia,
        getMediaUrl,
        addMedia
      }
    });
    component.processingInterval = 1;
    component.getMediaData();
    clock.tick(1000);
    assert.isTrue(getDataForMedia.calledOnce);
    assert.isFalse(getMediaUrl.called);
    assert.isFalse(addMedia.called);
    clock.restore();
  });

  it('Check componentWillMount() if has mediaDataState', function() {
    var clock = sinon.useFakeTimers();
    component.getMediaData = sinon.spy();
    component.componentWillMount();
    clock.tick(6000);
    assert.isFalse(component.getMediaData.called);
    clock.restore();
  });

  it('Check componentWillMount() if no mediaDataState', function() {
    var clock = sinon.useFakeTimers();
    component = getComponent({
      ...options,
      mediaDataState: null
    });
    component.getMediaData = sinon.spy();
    component.componentWillMount();
    clock.tick(6000);
    assert.isTrue(component.getMediaData.called);
    clock.restore();
  });

  it('Check componentWillReceiveProps()', function() {
    component.updateQueueStatus = sinon.spy();
    component.componentWillReceiveProps(options);
    assert.isTrue(component.updateQueueStatus.called);
  });

  it('Check updateQueueStatus() with null', function() {
    component.updateQueueStatus(null, null);
    assert.isNotTrue(component.state.jobsQueue.keywordsStatus);
    assert.isNotTrue(component.state.jobsQueue.fileStatus);
  });

  it('Check updateQueueStatus() with fileStatus', function() {
    component.updateQueueStatus({isCompleted: true}, null);
    assert.isNotTrue(component.state.jobsQueue.keywordsStatus);
    assert.isTrue(component.state.jobsQueue.fileStatus);
  });

  it('Check updateQueueStatus() with keywordsStatus but without fileStatus', function() {
    component.updateQueueStatus(null, {isCompleted: true});
    assert.isNotTrue(component.state.jobsQueue.keywordsStatus);
    assert.isNotTrue(component.state.jobsQueue.fileStatus);
  });

  it('Check updateQueueStatus() with keywordsStatus if state fileStatus=true', function() {
    component.updateQueueStatus({isCompleted: true}, null);
    component.updateQueueStatus({isCompleted: true}, {isCompleted: true});
    assert.isTrue(component.state.jobsQueue.keywordsStatus);
    assert.isTrue(component.state.jobsQueue.fileStatus);
  });

});
