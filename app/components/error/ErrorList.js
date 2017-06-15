import React, { PropTypes } from 'react'
import NotificationSystem from 'react-notification-system'

export class ErrorList extends React.Component {
  static propTypes = {
    errorState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentDidUpdate (prevProps) {
    const oldErrors = prevProps.errorState.ids;
    const newErrors = this.props.errorState.ids;
    const addedErrors = newErrors.filter(id => !oldErrors.includes(id));

    addedErrors.forEach((id) => {
      const error = this.props.errorState.entities[id];
      if (!(error instanceof Error)) console.error('ErrorList: received a non-Error:', error)
      this.addNotification(error);
    });
  }

  addNotification (error) {
    this.refs.notificationSystem.addNotification({
      uid: error.uid,
      message: String(error.message),
      level: 'error',
      position: 'tc',
      autoDismiss: '5',
      onRemove: () => {
        this.props.actions.removeError(error.uid)
      }
    });
  }

  render () {
    return (
      <NotificationSystem ref="notificationSystem" />
    )
  }

}

export default ErrorList
