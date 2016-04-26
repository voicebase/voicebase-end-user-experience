import React, {PropTypes} from 'react'
import {getClearWordFromTranscript} from '../../common/Common';

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

    return (
      <div className="listing__transcript__speaker-wrapper">
        {isFirst && <br/>}
        <span className="listing__transcript__speaker highlighted"
              style={wordStyle}
        >
          {word.w}
        </span>
      </div>
    )
  }
}

export default TranscriptSpeakerWord
