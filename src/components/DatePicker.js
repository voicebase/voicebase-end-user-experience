import React, {PropTypes} from 'react'
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'react-bootstrap-daterangepicker/css/daterangepicker.css'

import {Input} from 'react-bootstrap'

export class DatePicker extends React.Component {
  static propTypes = {
    dateFrom: PropTypes.string.isRequired,
    dateTo: PropTypes.string.isRequired,
    applyDate: PropTypes.func.isRequired,
    clearDate: PropTypes.func.isRequired
  };

  saveDate(event, picker) {
    let fromDate = picker.startDate.format('MM/DD/YYYY H') + ':00';
    let toDate = picker.endDate.format('MM/DD/YYYY H') + ':00';
    this.props.applyDate(fromDate, toDate);
  }

  cancel() {
    this.props.clearDate();
  }

  render() {
    let dateValue = '';
    if (this.props.dateFrom && this.props.dateTo) {
      dateValue = this.props.dateFrom + ' - ' + this.props.dateTo;
    }

    let settings = {
      'timePicker': true,
      'timePicker24Hour': true,
      'timePickerIncrement': 60,
      'ranges': {
        'Today': [
          moment().startOf('day'),
          moment()
        ],
        'Yesterday': [
          moment().subtract(1, 'days').startOf('day'),
          moment().subtract(1, 'days').endOf('day')
        ],
        'This Week': [
          moment().startOf('week'),
          moment()
        ],
        'Last Week': [
          moment().subtract(1, 'week').startOf('week'),
          moment().subtract(1, 'week').endOf('week')
        ],
        'This Month': [
          moment().startOf('month'),
          moment()
        ],
        'Last Month': [
          moment().subtract(1, 'month').startOf('month'),
          moment().subtract(1, 'month').endOf('month')
        ]
      },
      'linkedCalendars': false,
      'autoUpdateInput': false,
      'opens': 'left'
    };

    return (
      <div className='form-group form-group--date'>
        <DateRangePicker {...settings} onApply={this.saveDate.bind(this)} onCancel={this.cancel.bind(this)}>
          <i className='fa fa-calendar-o'/>
          <Input type='text' name='daterange' className="readonly--non-grey" readOnly value={dateValue} placeholder='Date range'/>
        </DateRangePicker>
      </div>
    )
  }
}

export default DatePicker
