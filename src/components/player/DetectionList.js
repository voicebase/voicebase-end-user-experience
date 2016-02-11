import React, { PropTypes } from 'react'

export default class DetectionList extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    utterances: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    let utterances = this.props.utterances;

    return (
      <div>
        <ul className="listing__detection__items">
          {
            utterances.itemIds.map(id => {
              let utterance = utterances.items[id];
              let style = {
                backgroundColor: utterance.color
              };

              return (
                <li className="listing__detection__item" key={'utterance-item' + id}>
                  <span className="listing__detection__item__line" style={style} />
                  <a href="javascript:void(0)">{utterance.name}</a>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}
