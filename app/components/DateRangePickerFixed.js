/*
Fix for bug that react-bootstrap-daterangepicker 3.4.0 can only render a single child

© 2017-present VoiceBase Inc. and Harald Rudell (https://www.voicebase.com) <support@voicebase.com>
This source code is licensed under the MIT-style license found in the LICENSE file in the root directory of this source tree.
*/
import DateRangePicker from 'react-bootstrap-daterangepicker'

import React from 'react'

export default class extends DateRangePicker {
  render() {
    return React.Children.count(this.props.children) === 1
      ? React.cloneElement(this.props.children, {ref: 'picker'})
      : React.createElement('div', {ref: 'picker'}, React.Children.map(this.props.children, child => React.cloneElement(child, {ref: 'picker'})))
  }  
}
