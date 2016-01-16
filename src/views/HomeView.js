import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { Link } from 'react-router'

export class HomeView extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    return (
      <div className='container text-center'>
        <h1 className="testCss">Welcome to the React Redux Starter Kit</h1>
        <hr />
        <div><Link to='/404'>Go to 404 Page</Link></div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  state
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
