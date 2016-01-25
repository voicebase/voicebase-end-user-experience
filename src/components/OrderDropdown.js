import React, {PropTypes} from 'react'
import {DropdownButton, MenuItem} from 'react-bootstrap'

export class DatePicker extends React.Component {
  static propTypes = {
    onSelectOrder: PropTypes.func.isRequired,
    selectedOrderId: PropTypes.string.isRequired,
    orderList: PropTypes.object.isRequired
  };

  onSelectItem(event, key) {
    this.props.onSelectOrder(key);
  }

  render() {
    let activeOrder = this.props.orderList[this.props.selectedOrderId];

    return (
      <DropdownButton id="sort-list-dropdown" title={activeOrder.name}>
        {
          Object.keys(this.props.orderList).map(orderId => {
            let order = this.props.orderList[orderId];
            let active = this.props.selectedOrderId === orderId;
            return <MenuItem key={orderId} eventKey={orderId} active={active} onSelect={this.onSelectItem.bind(this)}>{order.name}</MenuItem>
          })
        }
      </DropdownButton>
    )
  }
}

export default DatePicker
