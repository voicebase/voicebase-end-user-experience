import React, { PropTypes } from 'react'
import {Row, Col, Input, Button} from 'react-bootstrap'
import DatePicker from './DatePicker'
import DropdownList from './DropdownList'

export class SearchForm extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    onSearch: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
  };

  searchButtonAddon() {
    let isSearching = this.props.state.isSearching;
    return (
      <Button bsStyle="primary" onClick={this.startSearch.bind(this)} disabled={isSearching}>
        {isSearching ? 'Searching...' : 'Search'}
      </Button>
    )
  }

  applyDate(dateFrom, dateTo) {
    this.props.actions.applyDate({dateFrom, dateTo});
  }

  clearDate() {
    this.props.actions.clearDate();
  }

  onSelectOrder(orderId) {
    this.props.actions.selectOrder(orderId);
  }

  changeSearchText(event) {
    this.props.actions.setSearchString(event.target.value);
  }

  handleEnterKey(event) {
    if (event.key === 'Enter') {
      this.startSearch();
    }
  }

  startSearch() {
    this.props.onSearch();
  }

  render() {
    let state = this.props.state.toJS();
    return (
      <form className="form--filters">
        <Row>
          <Col sm={5}>
            <div className="form-group form-group--search">
              <i className="fa fa-search"/>
              <Input type="text"
                     placeholder="Search transcripts..."
                     value={state.searchString}
                     buttonAfter={this.searchButtonAddon()}
                     onKeyPress={this.handleEnterKey.bind(this)}
                     onChange={this.changeSearchText.bind(this)}
              />
            </div>
          </Col>

          <Col sm={4}>
            <DatePicker dateFrom={state.dateFrom}
                        dateTo={state.dateTo}
                        applyDate={this.applyDate.bind(this)}
                        clearDate={this.clearDate.bind(this)}/>
          </Col>

          <Col sm={3}>
            <div className="pull-right">
              <DropdownList onSelect={this.onSelectOrder.bind(this)}
                            dropdownKey="sort-list-dropdown"
                            items={state.order}
                            activeItemId={state.selectedOrderId}
              />
            </div>
          </Col>

        </Row>
      </form>
    )
  }
}

export default SearchForm
