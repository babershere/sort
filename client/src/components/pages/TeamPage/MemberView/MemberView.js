import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'

import { hasAuthTokenAsync } from '../../../../lib'

// Components
import {
  SwitchTable,
} from '../../../shared'

import {
  Input,
  Button,
  Header,
  Body,
  Span,
} from '../../../common'
import DashboardTab from './DashboardTab'

// Actions
import {
  getMemberById,
  patchMemberById,
} from '../../../../actions/team'

import styles from './MemberView.css'

class MemberView extends Component {
  constructor(props) {
    super(props)
    this.tabOptions = [
      {
        value: 'dashboard',
        display: 'Dashboard',
        renderComponent: () => this.renderDashboardTab(),
      },
      {
        value: 'scripts',
        display: 'Prescriptions',
        renderComponent: () => this.renderScriptsTab(),
      },
      {
        value: 'physicians',
        display: 'Physicians',
        renderComponent: () => this.renderPhysiciansTab(),
      },
    ]

    this.state = this.initialState
  }

  get initialState() {
    const { user } = this.props
    const {
      firstName,
      lastName,
      group,
      email,
    } = user

    return {
      tab: this.tabOptions[0],
      editing: false,
      firstName,
      lastName,
      group,
      email,
    }
  }

  static getDerivedStateFromProps(nextProps) {
    return nextProps.user || null
  }

  componentDidMount() {
    if (this.props.match.params.userId) {
      const loginToken = window.localStorage.getItem("token");
      axios.get('/api/user/search?userId=' + this.props.match.params.userId, { headers: { "Authorization": "Bearer " + loginToken } })
        .then((resp) => {
          console.log(resp);
          let user = resp.data.response[0]
          this.setState({
            id: user.id,
            name: user.name,
            group: user.group,
            username: user.username,
            email: user.email,
            link: '/images/' + user.id + '/' + user.link
          }, this.setImageLink)
        }).catch((err) => {
          console.error(err)
        })
    }
  }

  setImageLink() {
    this.setState({
      image: `${this.state.id}` + `${this.state.link}`
    })
  }

  setEditState(editing) {
    this.setState({ ...this.initialState, editing })
  }

  save() {
    const id = this.props.user.id
    const {
      firstName,
      lastName,
      username,
      group,
      email,
    } = this.state

    const update = {
      firstName,
      lastName,
      username,
      group,
      email,
    }

    this.props.patchMemberById(id, update)

    this.setEditState(false)
  }

  renderSwitchTable() {
    const { tab } = this.state
    return (
      <SwitchTable
        tabs={this.tabOptions}
        selected={tab}
        onClick={tab => this.setState({ tab })}
      />
    )
  }

  renderDashboardTab() {
    return (
      <DashboardTab />
    )
  }

  renderScriptsTab() {
    return (
      <div className={styles.scriptsTab}>
        <div className="header">
          Scripts
        </div>
      </div>
    )
  }

  renderPhysiciansTab() {
    return (
      <div className={styles.scriptsTab}>
        <div className="header">
          physicians list
        </div>
      </div>
    )
  }

  renderContactInfo() {

    const {
      editing,
      firstName,
      lastName,
      username,
      group,
      email,
    } = this.state

    const { user } = this.props

    return (
      <div>
        <div className="flex-grid">
      <div className={styles.contactInfo}>
        {editing ? (
          <div className="name">
            Name:
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={firstName => this.setState({ firstName })}
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={lastName => this.setState({ lastName })}
            />
          </div>
        ) : (
            <div>
              Name:
            <Span>
                {this.state.name || ''}
              </Span>
            </div>
          )}

        <div>
          Group:
          <Span>
            {this.state.group || '-'}
          </Span>
        </div>
        <div>
          Username:
          <Span>
            {this.state.username || ''}
          </Span>
        </div>
        <div>
          Email:
          <Span>
            {this.state.email || ''}
          </Span>
        </div>
        </div>
        
        <div className={styles.contactInfo}>
      
        <img src={this.state.link} />

      </div></div>
      </div>
    )
  }

  render() {
    const { user } = this.props
    if (!user) {
      return null
    }

    const {
      editing,
    } = this.state

    const {
      nameDisplay,
    } = user

    return (
      <div>
        <Header className={styles.header}>
          <h2>
            {this.state.name || ''}

            <Button
              search
              className='editButton'
              icon="edit"
              title="EDIT MEMBER"
              link={`/team/${this.props.match.params.userId}/edit`}
              style={{ marginLeft: 8 }}
            />

          </h2>
        </Header>
        <Body className={styles.body}>

          {this.renderContactInfo()}

          <div className="switch-buffer" />

          {this.renderSwitchTable()}
        </Body>
      </div>
    );
  }
}

const mapStateToProps = ({ auth, team }) => {
  const {
    user,
    error,
  } = team

  const {
    me,
  } = auth

  return {
    user: user || {},
    error,
    me,
  }
}

const actions = {
  patchMemberById,
  getMemberById,
}

export default connect(mapStateToProps, actions)(MemberView);
