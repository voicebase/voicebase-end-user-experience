import React from 'react'
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'react-bootstrap-daterangepicker/css/daterangepicker.css'

import {Input} from 'react-bootstrap'

export class DatePicker extends React.Component {
  constructor(props) {
    super(props);
  }

  applyDate(event, picker) {
    console.log(picker);
  }

  render() {
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
      'opens': 'left',
      'locale': {
        'format': 'MM/DD/YYYY H:00'
      }
    };

    return (
      <div className='form-group form-group--date'>
        <DateRangePicker {...settings} onApply={this.applyDate.bind(this)}>
          <i className='fa fa-calendar-o'/>
          <Input type='text' name='daterange' placeholder='Date range'/>
        </DateRangePicker>
      </div>
    )
  }
}

export default DatePicker
