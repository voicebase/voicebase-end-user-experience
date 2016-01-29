import React, { PropTypes } from 'react'
import classnames from 'classnames';

export class Transcript extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    playerState: PropTypes.object.isRequired,
    mediaState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  transcriptHighlight = 10;

  render() {
    let mediaState = this.props.mediaState;
    let playerState = this.props.playerState;
    let transcript = mediaState.transcript;

    let time = playerState.duration * playerState.played;
    let bottomHighlightBound = parseInt(time / this.transcriptHighlight, 10) * this.transcriptHighlight;
    let topHighlightBound = bottomHighlightBound + this.transcriptHighlight;

    return (
      <div className="listing__transcript">
        <div className="listing__transcript__content">
          {
            transcript.wordIds.map((wordId, i) => {
              let word = transcript.words[wordId];
              let wordTimeInSec = word.s / 1000;
              let highlightClass = classnames({
                current: (wordTimeInSec > bottomHighlightBound && wordTimeInSec < topHighlightBound)
              });

              return (
                <span key={word.p} className={highlightClass}>
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
