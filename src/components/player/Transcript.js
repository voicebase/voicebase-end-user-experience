import React, { PropTypes } from 'react'
import $ from 'jquery'
import _ from 'lodash';
import Fuse from 'fuse.js';
import classnames from 'classnames';
import { DETECTION_TAB } from '../../redux/modules/media/mediaData'
import {getClearWordFromTranscript} from '../../common/Common';

export class Transcript extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    playerState: PropTypes.object.isRequired,
    mediaState: PropTypes.object.isRequired,
    markersState: PropTypes.object,
    actions: PropTypes.object.isRequired
  };

  transcriptHighlight = 10;
  isHoverTranscript = false;

  constructor(props) {
    super(props);
    this.state = {
      hoverUtterance: null,
      hoverKeyword: null
    };
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

  findDetectionSegment(start) {
    let utterances = this.props.mediaState.utterances;
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
    let endPhraseWords = {
      [words[index].p]: {
        keywordId: findingKeyword.id
      }
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
          endPhraseWords[nextWord.p] = {
            keywordId: findingKeyword.id
          };
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

  isSpeaker(word) {
    if (!word.m) {
      return false;
    }
    return (word.m === 'turn');
  }

  getSpeakerColor (word) {
    let speakerName = getClearWordFromTranscript(word.w);
    let speaker = this.props.mediaState.speakers[speakerName];
    return (speaker) ? speaker.color : null;
  }

  isHoverUtterance(utterance) {
    return (this.state.hoverUtterance &&
            utterance.id === this.state.hoverUtterance.id &&
            utterance.segmentIndex === this.state.hoverUtterance.segmentIndex);
  }

  render() {
    let mediaState = this.props.mediaState;
    let playerState = this.props.playerState;
    let transcript = mediaState.transcript;

    let time = playerState.duration * playerState.played;
    // Calculate current bounds
    let bottomHighlightBound = parseInt(time / this.transcriptHighlight, 10) * this.transcriptHighlight;
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
              let wordTimeInSec = word.s / 1000;
              let wordStyle = {};

              // highlight for current position of playing
              let isCurrent = (wordTimeInSec > bottomHighlightBound && wordTimeInSec < topHighlightBound);
              currentWordsCounter = (isCurrent) ? currentWordsCounter + 1 : currentWordsCounter;

              // hightlight for keywords
              let findingKeyword = markers[(word.s / 1000).toFixed(2)];
              let isFindingKeyword = false;
              if (findingKeyword) {
                let phraseWords = this.checkPhrase(findingKeyword, transcript.words, i);
                endPhraseWords = Object.assign({}, endPhraseWords, phraseWords);
              }
              if (endPhraseWords[word.p]) {
                isFindingKeyword = true;
                if (this.state.hoverKeyword !== null && endPhraseWords[word.p].keywordId === this.state.hoverKeyword) {
                  wordStyle['color'] = '#fff';
                  wordStyle['backgroundColor'] = '#55a01a';
                }
                else {
                  wordStyle['color'] = '#55a01a';
                }
              }

              // highlight speaker
              let isSpeaker = this.isSpeaker(word);
              if (isSpeaker) {
                wordStyle['color'] = this.getSpeakerColor(word);
              }

              // highlight utterances phrase
              let utterance = null;
              if (mediaState.view.activeTab === DETECTION_TAB) {
                utterance = this.findDetectionSegment(word.s);
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
