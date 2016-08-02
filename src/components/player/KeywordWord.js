import React, { PropTypes } from 'react'
import equal from 'deep-equal'
import { COLORS } from '../../common/Common'

export class KeywordWord extends React.Component {
  static propTypes = {
    activeSpeakerId: PropTypes.string,
    keyword: PropTypes.object.isRequired,
    setMarkers: PropTypes.func.isRequired
  };

  shouldComponentUpdate (nextProps) {
    const isChangedKeywords = !equal(this.props.keyword, nextProps.keyword);
    const isChangedActiveSpeakerId = !equal(this.props.activeSpeakerId, nextProps.activeSpeakerId);

    return isChangedActiveSpeakerId || isChangedKeywords;
  }

  onClickKeyword = () => {
    const keyword = this.props.keyword;
    let color = COLORS[0];
    let times = this.getKeywordTimes(keyword);
    let markers = times.map(_time => {
      let time = parseFloat(_time);
      return {
        time,
        keywordName: keyword.name,
        color
      }
    });
    this.props.setMarkers(markers);
  };

  getKeywordTimes(keyword) {
    let times = [];
    let activeSpeakerId = this.props.activeSpeakerId;
    if (activeSpeakerId) {
      times = keyword.t[activeSpeakerId];
    }
    else {
      Object.keys(keyword.t).forEach(speakerName => {
        times = times.concat(keyword.t[speakerName]);
      });
    }
    return times;
  }

  render() {
    let keyword = this.props.keyword;
    let times = this.getKeywordTimes(keyword);
    if (!times || (times && times.length === 0)) { // no times - no keyword.
      return null;
    }

    return (
      <li>
        <a href="javascript:void(0)" onClick={this.onClickKeyword}>
          <span className="listing__keywords__keyword-name">{keyword.name}</span>
          <span> ({times.length})</span>
        </a>
      </li>
    )
  }
}

export default KeywordWord
