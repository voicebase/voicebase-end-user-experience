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
    let isSearching = this.props.state.get('isSearching');
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
      event.preventDefault();
      this.startSearch();
    }
  }

  startSearch() {
    this.props.onSearch();
  }

  render() {
    let state = this.props.state.toJS();

    let searchWidth = 12;
    let datePickerWidth = 4;
    let orderWidth = 3;

    if (state.view.datePickerEnabled) {
      searchWidth = searchWidth - datePickerWidth;
    }
    if (state.view.orderEnabled) {
      searchWidth = searchWidth - orderWidth;
    }

    return (
      <form className="form--filters">
        <Row>
          <Col sm={searchWidth}>
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

          {
            state.view.datePickerEnabled &&
            <Col sm={datePickerWidth}>
              <DatePicker dateFrom={state.dateFrom}
                          dateTo={state.dateTo}
                          applyDate={this.applyDate.bind(this)}
                          clearDate={this.clearDate.bind(this)}/>
            </Col>
          }

          {
            state.view.orderEnabled &&
            <Col sm={orderWidth}>
              <div className="pull-right">
                <DropdownList onSelect={this.onSelectOrder.bind(this)}
                              dropdownKey="sort-list-dropdown"
                              items={state.order}
                              activeItemId={state.selectedOrderId}
                />
              </div>
            </Col>
          }

        </Row>
      </form>
    )
  }
}

export default SearchForm
