import React, { PropTypes } from 'react'
import {Collapse, ButtonGroup, Button} from 'react-bootstrap'

export class MediaListToolbar extends React.Component {
  static propTypes = {
    selectedMediaIds: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount(nextProps) {
    setTimeout(() => {
      return true;
    }, 300)
  }

  render () {
    let countIds = this.props.selectedMediaIds.length;
    return (
      <Collapse in={countIds > 0} transitionAppear timeout={countIds > 0 ? 300 : 0}>
        <div className="listings__toolbar">
          <ButtonGroup bsSize="small">
            <Button className="btn-count" disabled>
              <span className="count">{countIds}</span> selected files
            </Button>
            <Button>
              <i className="fa fa-trash" /> Delete selected
            </Button>
            <Button>Select all</Button>
            <Button>Deselect all</Button>
          </ButtonGroup>
        </div>
      </Collapse>
    )
  }
}

export default MediaListToolbar
