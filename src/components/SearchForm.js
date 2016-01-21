import React from 'react'
import {Row, Col, Input, Button, DropdownButton, MenuItem} from 'react-bootstrap'

export class SearchForm extends React.Component {

  searchButtonAddon() {
    return (
      <Button bsStyle="primary">Search</Button>
    )
  }

  render() {
    return (
      <form className="form--filters">
        <Row>
          <Col sm={5}>
            <div className="form-group form-group--search">
              <i className="fa fa-search"/>
              <Input type="text" placeholder="Search transcripts..." buttonAfter={this.searchButtonAddon()}/>
            </div>
          </Col>

          <Col sm={4}>
            <div className="form-group form-group--date">
              <i className="fa fa-calendar-o"/>
              <Input type="text" name="daterange" placeholder="Date range"/>
            </div>
          </Col>

          <Col sm={3}>
            <div className="pull-right">
              <DropdownButton id="sort-list-dropdown" title="Order by Newest">
                <MenuItem eventKey="1">Order by Title A-Z</MenuItem>
                <MenuItem eventKey="2">Order by Title Z-A</MenuItem>
                <MenuItem active eventKey="3">Order by Newest</MenuItem>
                <MenuItem eventKey="4">Order by Oldest</MenuItem>
              </DropdownButton>
            </div>
          </Col>

        </Row>
      </form>
    )
  }
}

export default SearchForm
