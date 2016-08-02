import React, { PropTypes } from 'react'
import { getClearWordFromTranscript, parseTime } from '../../common/Common';

export class TranscriptSpeakerWord extends React.Component {
  static propTypes = {
    isFirst: PropTypes.bool.isRequired,
    word: PropTypes.object.isRequired,
    speakers: PropTypes.object.isRequired
  };

  getSpeakerColor(wordVal) {
    let speakerName = getClearWordFromTranscript(wordVal).toLowerCase();
    let speaker = this.props.speakers[speakerName];
    return (speaker) ? speaker.color : null;
  }

  render() {
    const isFirst = this.props.isFirst;
    const word = this.props.word;
    let wordStyle = {
      color: this.getSpeakerColor(word.w)
    };
    let parsedTime = parseTime(word.s / 1000);

    return (
      <div className="listing__transcript__speaker-wrapper">
        {!isFirst && <br />}
        <div className="listing__transcript__speaker">
          <div className="highlighted" style={wordStyle}>
            {word.w}
          </div>
          <div className="listing__transcript__speaker-time">
            {parsedTime}
          </div>
        </div>
      </div>
    )
  }
}

export default TranscriptSpeakerWord
