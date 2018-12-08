import React, { Component } from 'react';
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import cn from 'classnames'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

import FontAwesome from 'react-fontawesome'
import Spinner from 'react-spinner'

// Components
import {
  Overlay,
} from '../../common'

import { logout } from '../../../actions/auth'

import styles from './TitleBar.css'

class TitleBar extends Component {
  constructor(props) {
    super(props)
    this.state = this.initialState
    this.logout = this.logout.bind(this);
  }

  get initialState() {
    return {
      showDropdown: false,
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    if (token) {
      var decoded = jwt_decode(token);
      this.setState({
        userId: decoded.id
      }, this.getUser)
    }
  }

  getUser() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/user/search?userId=' + this.state.userId, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          name: resp.data.response[0].name,
          link: resp.data.response[0].link
        })
      }).catch((err) => {
        console.error(err)
      })
  }

  openProfile() {
    window.location = `/team/${this.state.userId}/profile`;
  }

  logout() {
    if (window.confirm('Log out?')) {
      localStorage.clear()
      window.location.href = '/';
    }
  }



  renderDropdown() {
    const { nameDisplay } = this.props
    const { showDropdown } = this.state
    return (
      <div
        className={cn("options", { show: showDropdown })}
        onClick={() => this.setState({ showDropdown: !showDropdown })}
      >
        {/* Clickable Section */}
        <div className="userImage" style={{ backgroundImage: `url(/images/${this.state.userId}/${this.state.link}`, width: 30, height: 30 }}></div>

        <div>{this.state.name}</div>
        <FontAwesome name="caret-down" />

        {/* Dropdown */}
        <div className={cn("dropdown", { show: showDropdown })}>
          <div className="option" onClick={this.openProfile.bind(this)}>
            <span>
              <FontAwesome name="cog" />
              Settings
              </span>
          </div>

          {/* Logout  */}
          <div className="option" onClick={this.logout}>
            <span>
              <FontAwesome name="sign-out" />
              Log Out
            </span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { loading } = this.props
    const { showDropdown } = this.state
    return (
      <div className={styles.titleBar}>
        {/* Title */}
        <div className="title">
          <NavLink to="/">
            <img alt="SortPak" src="http://www.sortpak.com/site-uploadz/2018/05/sortpak-logo-lg.png" style={imageStyle.logo} />
            SortPak
          </NavLink>
          <Spinner className={cn({ loading })} />
        </div>

        {/* Dropdown */}
        {this.renderDropdown()}

        {/* Dropdown Overlay */}
        <Overlay
          active={showDropdown}
          onClick={() => this.setState({ showDropdown: false })}
        />
      </div>
    )
  }
};

const imageStyle = {
  logo: {
    padding: '10px',
    width: '50px'
  },
}

const mapStateToProps = props => {
  const {
    auth,
  } = props

  const loading = auth.loading

  const { me } = auth
  const nameDisplay = (me && me.nameDisplay) || 'User'

  return {
    loading,
    nameDisplay,
  }
}

const actions = {
  logout,
}

export default connect(mapStateToProps, actions)(TitleBar)
