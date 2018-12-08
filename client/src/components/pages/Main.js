import React, { Component } from 'react';
import { connect } from 'react-redux'

// Helpers
import { hasAuthTokenAsync } from '../../lib'

// Components
import Router from './Main.Router'
import TopNav from '../TopNav/TopNav'

// Actions
import {
  getSelf,
} from '../../actions/auth'

import {
  getReps,
  getVisits,
  getTeamMembers,
  getPatients,
  getPhysicians,
} from '../../actions/main'

/* import {
  connectSocket,
} from '../../actions/sockets' */

import styles from './Main.css'

class Main extends Component {
  componentDidMount() {
    hasAuthTokenAsync()
      .then(() => {
        this.props.getSelf()
        this.props.getReps()
        this.props.getVisits()
        this.props.getTeamMembers()
        this.props.getPatients()
        this.props.getPhysicians()
        this.props.connectSocket()
      })
      .catch(console.log)
  }

  render() {
    return (
      <div className={styles.app}>
        <TopNav />
        <div className="main">
          <Router />
        </div>
      </div>
    );
  }
}

const mapStateToProps = props => {
  return {}
}

const actions = {
  getSelf,
  getReps,
  getVisits,
  // connectSocket,
  getTeamMembers,
  getPhysicians,
  getPatients,
}

export default connect(mapStateToProps, actions)(Main)
