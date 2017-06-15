import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import DateRangePicker from './DateRangePickerFixed'
import 'react-bootstrap-daterangepicker/css/daterangepicker.css'

export class DatePicker extends React.Component {
  static propTypes = {
    dateFrom: PropTypes.string.isRequired,
    dateTo: PropTypes.string.isRequired,
    applyDate: PropTypes.func.isRequired,
    clearDate: PropTypes.func.isRequired
  };

  saveDate = (event, picker) => {
    let fromDate = picker.startDate.format('MM/DD/YYYY H') + ':00';
    let toDate = picker.endDate.format('MM/DD/YYYY H') + ':00';
    this.props.applyDate(fromDate, toDate);
  };

  cancel = () => {
    this.props.clearDate();
  };

  render() {
    let dateValue = '';
    if (this.props.dateFrom && this.props.dateTo) {
      dateValue = this.props.dateFrom + ' - ' + this.props.dateTo;
    }

    let settings = {
      'timePicker': true,
      'timePicker24Hour': true,
      'timePickerIncrement': 1,
      'ranges': {
        'Today': [
          moment().startOf('day'),
          moment().endOf('day')
        ],
        'Yesterday': [
          moment().subtract(1, 'days').startOf('day'),
          moment().subtract(1, 'days').endOf('day')
        ],
        'This Week': [
          moment().startOf('week'),
          moment().endOf('day')
        ],
        'Last Week': [
          moment().subtract(1, 'week').startOf('week'),
          moment().subtract(1, 'week').endOf('week')
        ],
        'This Month': [
          moment().startOf('month'),
          moment().endOf('day')
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
        <DateRangePicker {...settings} onApply={this.saveDate} onCancel={this.cancel}>
          <div display={'inline-block'}>
            <i className='fa fa-calendar-o' />
            <input type='text' name='daterange' className="form-control readonly--non-grey" readOnly value={dateValue} placeholder='Date range' />
          </div>
        </DateRangePicker>
      </div>
    )
  }
}

export default DatePicker
