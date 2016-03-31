import React, { PropTypes } from 'react'
import $ from 'jquery'
import _ from 'lodash';
import Fuse from 'fuse.js';
import classnames from 'classnames';
import equal from 'deep-equal'
import { DETECTION_TAB } from '../../redux/modules/media/mediaData'
import {getClearWordFromTranscript} from '../../common/Common';

export class Transcript extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    duration: PropTypes.number,
    played: PropTypes.number,
    transcript: PropTypes.object.isRequired,
    utterances: PropTypes.object,
    speakers: PropTypes.object.isRequired,
    activeTab: PropTypes.number.isRequired,
    markersState: PropTypes.object
  };

  lastTime = null;
  transcriptHighlight = 10;
  isHoverTranscript = false;

  constructor(props) {
    super(props);
    this.state = {
      hoverUtterance: null,
      hoverKeyword: null
    };
  }

  shouldComponentUpdate (nextProps, nextState) {
    let time = this.lastTime;
    let nextTime = nextProps.duration * nextProps.played;
    let isTimeChanged = (time === null) ? true : this.calcTimeBound(time) !== this.calcTimeBound(nextTime);
    if (isTimeChanged) {
      this.lastTime = nextTime;
    }

    const isChangedState = !equal(this.state, nextState);
    const isChangedMarkers = !equal(this.props.markersState, nextProps.markersState);

    return isTimeChanged || isChangedState || isChangedMarkers;
  }

  componentDidUpdate() {
    if (this.refs.current && !this.isHoverTranscript) {
      let $transcriptDom = $(this.refs.transcript);
      let $current = $(this.refs.current);
      let scrollTop = $current.offset().top - $transcriptDom.offset().top + $transcriptDom.scrollTop() - ($transcriptDom.height()) / 2;
      $transcriptDom.animate({
        scrollTop: scrollTop
      }, 300);
    }
  }

  onHoverTranscript() {
    this.isHoverTranscript = true;
  }

  onBlurTranscript() {
    this.isHoverTranscript = false;
  }

  calcTimeBound(time) {
    return parseInt(time / this.transcriptHighlight, 10) * this.transcriptHighlight;
  }

  findDetectionSegment(start) {
    let utterances = this.props.utterances;
    let findUtterance = null;
    for (let id of utterances.itemIds) {
      let utterance = utterances.items[id];
      let res = _.findIndex(utterance.segments, segment => start > segment.s && start < segment.e)
      if (res > -1) {
        findUtterance = {...utterance, segmentIndex: res};
        break;
      }
    }
    return findUtterance;
  }

  onHoverDetectionSegment(utterance, keyword) {
    if (utterance) {
      this.setState({hoverUtterance: utterance});
    }
    else if (keyword) {
      this.setState({hoverKeyword: keyword.keywordId});
    }
  }

  onBlurDetectionSegment() {
    this.setState({hoverUtterance: null, hoverKeyword: null});
  }

  checkPhrase (findingKeyword, words, index) {
    let wordObj = {
      keywordId: findingKeyword.id,
      color: findingKeyword.color
    };
    let endPhraseWords = {
      [words[index].p]: {...wordObj}
    };
    let splitMarker = findingKeyword.keywordName.split(' ');
    if (splitMarker.length > 0) {
      let fuseModel = new Fuse(splitMarker, {threshold: 0.2});
      let phrase = '';
      for (let j = 0; j < splitMarker.length; j++) {
        let nextWord = words[index + j];
        phrase += nextWord.w + ' ';
      }
      let fuseResult = fuseModel.search(phrase);
      if (fuseResult.length >= splitMarker.length) {
        for (let j = 1; j < splitMarker.length; j++) {
          let nextWord = words[index + j];
          endPhraseWords[nextWord.p] = {...wordObj};
        }
      }
    }
    return endPhraseWords;
  }

  getMarkers() {
    let markersState = this.props.markersState;
    let markers = {};
    if (markersState) {
      markersState.markerIds.forEach(markerId => {
        let marker = markersState.markers[markerId];
        let startTime = marker.time.toFixed(2);
        markers[startTime] = marker;
      });
    }
    return markers;
  }

  isSpeaker(wordTurn) {
    if (!wordTurn) {
      return false;
    }
    return (wordTurn === 'turn');
  }

  getSpeakerColor (wordVal) {
    let speakerName = getClearWordFromTranscript(wordVal);
    let speaker = this.props.speakers[speakerName];
    return (speaker) ? speaker.color : null;
  }

  isHoverUtterance(utterance) {
    return (this.state.hoverUtterance &&
            utterance.id === this.state.hoverUtterance.id &&
            utterance.segmentIndex === this.state.hoverUtterance.segmentIndex);
  }

  render() {
    let transcript = this.props.transcript;
    let activeTab = this.props.activeTab;

    let time = this.props.duration * this.props.played;
    // Calculate current bounds
    let bottomHighlightBound = this.calcTimeBound(time);
    let topHighlightBound = bottomHighlightBound + this.transcriptHighlight;
    let currentWordsCounter = 0;

    // Prepare markers highlight
    let markers = this.getMarkers();
    let endPhraseWords = {};

    return (
      <div className="listing__transcript">
        <div className="listing__transcript__content" ref="transcript" onMouseEnter={this.onHoverTranscript.bind(this)} onMouseLeave={this.onBlurTranscript.bind(this)}>
          {
            transcript.wordIds.map((wordId, i) => {
              let word = transcript.words[wordId];
              let startTime = word.s;
              let wordPos = word.p;
              let wordTurn = word.m;
              let wordVal = word.w;

              let wordTimeInSec = startTime / 1000;
              let wordStyle = {};

              // highlight for current position of playing
              let isCurrent = (wordTimeInSec >= bottomHighlightBound && wordTimeInSec <= topHighlightBound);
              currentWordsCounter = (isCurrent) ? currentWordsCounter + 1 : currentWordsCounter;

              // hightlight for keywords
              let findingKeyword = markers[wordTimeInSec.toFixed(2)];
              let isFindingKeyword = false;
              if (findingKeyword) {
                let phraseWords = this.checkPhrase(findingKeyword, transcript.words, i);
                endPhraseWords = Object.assign({}, endPhraseWords, phraseWords);
              }

              if (endPhraseWords[wordPos]) {
                isFindingKeyword = true;
                const color = endPhraseWords[wordPos].color;
                if (this.state.hoverKeyword !== null && endPhraseWords[wordPos].keywordId === this.state.hoverKeyword) {
                  wordStyle['color'] = '#fff';
                  wordStyle['backgroundColor'] = color;
                }
                else {
                  wordStyle['color'] = color;
                }
              }

              // highlight speaker
              let isSpeaker = this.isSpeaker(wordTurn);
              if (isSpeaker) {
                wordStyle['color'] = this.getSpeakerColor(wordVal);
              }

              // highlight utterances phrase
              let utterance = null;
              if (activeTab === DETECTION_TAB) {
                utterance = this.findDetectionSegment(startTime);
              }
              if (utterance && !isSpeaker) {
                if (this.isHoverUtterance(utterance)) {
                  wordStyle['color'] = '#fff';
                  wordStyle['backgroundColor'] = utterance.color;
                }
                else {
                  wordStyle['color'] = utterance.color;
                }
              }

              let highlightClass = classnames({
                current: isCurrent,
                'highlighted': isFindingKeyword || isSpeaker || utterance
              });

              return (
                <span key={'word-' + i}
                      className={highlightClass}
                      style={wordStyle}
                      ref={currentWordsCounter === 1 ? 'current' : null}
                      onMouseEnter={this.onHoverDetectionSegment.bind(this, utterance, endPhraseWords[word.p])}
                      onMouseLeave={this.onBlurDetectionSegment.bind(this)}
                >
                  {(word.m === 'punc') ? word.w : ' ' + word.w}
                </span>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default Transcript
