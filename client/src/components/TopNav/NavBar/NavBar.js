import React, { Component } from 'react';
import { connect } from 'react-redux'
import { NavLink, matchPath } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

import qs from 'query-string'
import { getDateObject } from '../../../lib'

import { Icon } from '../../common'

import {
  getVisits,
} from '../../../actions/main'

import styles from './NavBar.css'

class NavBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userRole: ''
    }
  }

  componentDidMount() {

    const token = localStorage.getItem('token')
    if (token) {
      var decoded = jwt_decode(token);
      axios.get('../api/user/search?userId=' + decoded.id, { headers: { "Authorization": "Bearer " + token } })
        .then((resp) => {
          this.setState({
            userRole: resp.data.response[0].role,
          });
        }).catch((error) => {
          console.error(error);
        })
    }
  }


  callAgendaActions() {
    this.props.getVisits()
  }

  get agendaLink() {
    const { month, year } = getDateObject()
    const pathname = '/agenda'
    const search = qs.stringify({ month, year })
    return {
      pathname,
      search,
    }
  }

  get dashboardLink() {
    const pathname = '/dashboard'
    const view = 'day'
    const search = qs.stringify({ view })
    return {
      pathname,
      search,
    }
  }



  render() {


    if (this.state.userRole === 'Admin') {
      return (
        <div className={styles.navBar}>
          <NavLink to="/scripts">
            <Icon name="bookmark-o" />Scripts
          </NavLink>
          <NavLink to="/patients">
            <Icon name="heart-o" />Patients
          </NavLink>
          <NavLink to={this.dashboardLink}>
            <Icon name="bar-chart" />Dashboard
          </NavLink>
          <NavLink to={this.agendaLink} onClick={() => this.callAgendaActions()}>
            <Icon name="th-large" />Agenda
          </NavLink>
          <NavLink to="/physicians">
            <Icon name="stethoscope" />Physicians
          </NavLink>
          <NavLink to="/refills">
            <Icon name="tint" />Refills
          </NavLink>
          <NavLink to="/products" >
            <Icon name="tint" />Products
          </NavLink>
          <NavLink to="/team">
            <Icon name="user-o" />My Team
          </NavLink>
        </div>
      )
    } else if (this.state.userRole === 'Rep') {
      return (
        <div className={styles.navBar}>
          <NavLink style={{ 'flex': 'initial', width: 200, border: '1px solid #eaeaea' }} to="/scripts">
            <Icon name="bookmark-o" />Scripts
          </NavLink>
          <NavLink style={{ 'flex': 'initial', width: 200, border: '1px solid #eaeaea' }} to={this.dashboardLink}>
            <Icon name="bar-chart" />Dashboard
          </NavLink>
          <NavLink style={{ 'flex': 'initial', width: 200, border: '1px solid #eaeaea' }} to={this.agendaLink} onClick={() => this.callAgendaActions()}>
            <Icon name="th-large" />Agenda
          </NavLink>
          <NavLink style={{ 'flex': 'initial', width: 200, border: '1px solid #eaeaea' }} to="/physicians">
            <Icon name="stethoscope" />Physicians
          </NavLink>
          <NavLink style={{ 'flex': 'initial', width: 200, border: '1px solid #eaeaea' }} to="/team">
            <Icon name="user-o" />My Team
          </NavLink>
        </div>
      )
    } else if (this.state.userRole === 'Physician') {
      return (
        <div className={styles.navBar}>
          <NavLink style={{ 'flex': 'initial', width: 200, border: '1px solid #eaeaea' }} to="/patients">
            <Icon name="heart-o" />Patients
          </NavLink>
        </div >
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

const actions = {
  getVisits,
}

const mapStateToProps = ({ router, auth }) => {
  const {
    isAdmin,
    me,
  } = auth

  return {
    isAdmin,
    router,
    me,
  }
}

export default connect(mapStateToProps, actions)(NavBar)
