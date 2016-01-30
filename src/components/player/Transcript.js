import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import classnames from 'classnames';

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

  componentDidUpdate() {
    if (this.refs.current && !this.isHoverTranscript) {
      let $transcriptDom = $(ReactDOM.findDOMNode(this.refs.transcript));
      let $current = $(ReactDOM.findDOMNode(this.refs.current));
      let scrollTop = $current.offset().top - $transcriptDom.offset().top + $transcriptDom.scrollTop() - ($transcriptDom.height()) / 2;
      $transcriptDom.animate({
        scrollTop: scrollTop
      }, 400);
    }
  }

  onHoverTranscript() {
    this.isHoverTranscript = true;
  }

  onBlurTranscript() {
    this.isHoverTranscript = false;
  }

  render() {
    let mediaState = this.props.mediaState;
    let playerState = this.props.playerState;
    let markersState = this.props.markersState;
    let transcript = mediaState.transcript;

    let time = playerState.duration * playerState.played;
    // Calculate current bounds
    let bottomHighlightBound = parseInt(time / this.transcriptHighlight, 10) * this.transcriptHighlight;
    let topHighlightBound = bottomHighlightBound + this.transcriptHighlight;
    let currentWordsCounter = 0;

    // Prepare markers highlight
    let markers = {};
    if (markersState) {
      markersState.markerIds.forEach(markerId => {
        let marker = markersState.markers[markerId];
        markers[marker.time * 1000] = marker;
      });
    }

    return (
      <div className="listing__transcript">
        <div className="listing__transcript__content" ref="transcript" onMouseEnter={this.onHoverTranscript.bind(this)} onMouseLeave={this.onBlurTranscript.bind(this)}>
          {
            transcript.wordIds.map((wordId) => {
              let word = transcript.words[wordId];
              let wordTimeInSec = word.s / 1000;

              // highlight for current position of playing
              let isCurrent = (wordTimeInSec > bottomHighlightBound && wordTimeInSec < topHighlightBound);
              currentWordsCounter = (isCurrent) ? currentWordsCounter + 1 : currentWordsCounter;

              // hightlight for keywords
              let isFindingKeyword = (markers[word.s]);

              let highlightClass = classnames({
                current: isCurrent,
                'highlighted green': isFindingKeyword
              });

              return (
                <span key={word.p} className={highlightClass} ref={currentWordsCounter === 1 ? 'current' : null}>
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