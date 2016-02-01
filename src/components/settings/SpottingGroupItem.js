import React, { PropTypes } from 'react'
import {Col, Button, ListGroupItem, Label} from 'react-bootstrap'
import Spinner from '../Spinner'

export class SpottingGroupItem extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    group: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  deleteGroup(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.deleteGroup(this.props.token, this.props.group.id, this.props.group.name);
  }

  render() {
    let group = this.props.group;
    return (
        <ListGroupItem>
          <Col sm={4}>
            <h4 className="list-group-item-heading">
              {group.name}
            </h4>
          </Col>
          <Col sm={7} className="overflow-hidden">
            <p className="list-group-item-labels">
              <Label bsStyle="primary">Default</Label>
              {
                group.keywords.map(keywordName => {
                  let key = 'group__keyword-label-' + keywordName;
                  return <Label key={key} className="label-bordered">{ keywordName }</Label>
                })
              }
            </p>
          </Col>
          { group.isDeletePending && <div className="spinner-remove_item"><Spinner/></div> }
          {
            !group.isDeletePending &&
            <Button bsStyle="link" className="btn-delete" onClick={this.deleteGroup.bind(this)}>
              <i className="fa fa-trash"/>
            </Button>
          }
          <div className="collapse" id="phraseSpottingGroups-1" aria-expanded="false">
            <form className="form-settings ng-pristine ng-valid">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Group Name (Mandatory)" />
              </div>
              <div className="form-group">
                <textarea className="form-control" placeholder="Description (Optional)" defaultValue="Description goes here" />
              </div>
              <div className="form-group">
                <div className="tokenfield form-control">
                </div>
              </div>
              <div className="form-group">
                <div className="checkbox">
                  <label>
                    <input type="checkbox" checked="" />
                    Default phrase spotting group
                  </label>
                </div>
              </div>
              <div className="buttons">
                <button type="button" className="btn btn-success collapsed" data-toggle="collapse" data-target="#phraseSpottingGroups-1" aria-expanded="false">Save</button>
                <button type="button" className="btn btn-default collapsed" data-toggle="collapse" data-target="#phraseSpottingGroups-1" aria-expanded="false">Cancel</button>
              </div>
            </form>
          </div>
        </ListGroupItem>
    )
  }
}

export default SpottingGroupItem
