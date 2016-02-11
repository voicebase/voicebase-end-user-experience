import React, { PropTypes } from 'react'

export default class PlayerSpeakers extends React.Component {
  static propTypes = {
    duration: PropTypes.number,
    speakers: PropTypes.object.isRequired,
    transcriptSpeakers: PropTypes.array.isRequired,
    calcTimeOffset: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.state = {initialRender: true};
  }

  componentDidMount () {
    this.setState({initialRender: false}); // hack for access to refs of Player.js
  }

  render() {
    let speakersState = this.props.speakers;
    let transcriptSpeakers = this.props.transcriptSpeakers;
    let duration = this.props.duration || 0;

    return (
      <div className="player__timeline__speakers">
        {
          transcriptSpeakers.map((speaker, i) => {
            let nextSpeaker = transcriptSpeakers[i + 1];
            let start = this.props.calcTimeOffset(speaker.start / 1000);
            let end = (nextSpeaker) ? this.props.calcTimeOffset(nextSpeaker.start / 1000) : this.props.calcTimeOffset(duration);
            let speakerStyles = {
              left: start + 'px',
              width: (end - start) + 'px',
              backgroundColor: speakersState[speaker.name].color
            };

            return (
              <div className="player__timeline__speaker" key={'timeline-speaker-' + i} style={speakerStyles}></div>
            )
          })
        }
      </div>
    )
  }
}
