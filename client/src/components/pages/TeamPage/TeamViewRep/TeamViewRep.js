import React, { Component } from 'react';
import { connect } from 'react-redux'

import jwt_decode from 'jwt-decode'
import axios from 'axios'
import Moment from 'react-moment'
import { TablePagination } from 'react-pagination-table';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';



// Components
import {
  ActionBox,
  Button,
  Input,
  Table
} from '../../../common'

// Actions
import {
  getTeamMembers,
  filterTeamMembers,
} from '../../../../actions/main'

import {
  setMember,
} from '../../../../actions/team'

import styles from '../TeamView/TeamView.css'

// const th = ['NAME', 'USERNAME', 'EMAIL ADDRESS', 'ROLE', 'DATE ADDED']

class TeamViewRep extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      searchType: '',
      searchName: '',
      searchUsername: '',
      searchEmail: ''
    }
  }

  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    if (loginToken) {
      var decoded = jwt_decode(loginToken);

      axios.get('api/user/search?userId=' + decoded.id, { headers: { "Authorization": "Bearer " + loginToken } })
        .then((resp) => {
          this.setState({
            userName: resp.data.response[0].name
          }, this.getPhysicians);
        }).catch((error) => {
          console.error(error);
        })
    }
  }

  getPhysicians() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('api/physicians/search?rep=' + this.state.userName, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp)
        this.setState({
          physicians: resp.data.response
        }, this.mapPhysicians);
      }).catch((error) => {
        console.error(error);
      })
  }

  mapPhysicians() {
    const physicianIdArray = [];
    this.state.physicians.map(function (item, i) {
      physicianIdArray.push(item.id)
      return (
        <div key={i}>
        </div>
      )
    })
    this.setState({
      physicianIdArray: physicianIdArray
    }, this.getPhysicianUsers)
  }

  getPhysicianUsers() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('api/user/search?physIdArray=' + this.state.physicianIdArray, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp)
        this.setState({
          users: resp.data.response
        });
      }).catch((error) => {
        console.error(error);
      })
  }

  enterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) { //13 is the enter keycode
      this.searchQuery();
    }
  }

  filterUsers(search) {
    const { searchType } = this.state
    this.props.filterTeamMembers(search, searchType)
    this.setState({ search, searchType })
  }

  viewMember(e, user) {
    e.stopPropagation()
    this.props.setMember(user)
  }

  renderTable() {
    return (
      <Table className="userTable" hoverable>
        {this.renderTableHead()}
        {this.renderTableBody()}
      </Table>
    )
  }

  renderTableHead() {
    return (
      <thead>
        <tr>
          <th>
            Name
          </th>
          <th>
            Username
          </th>
          <th>
            Email Address
          </th>
          <th>
            Role
          </th>
          <th>Date Added</th>
        </tr>
      </thead>
    )
  }

  renderTableBody() {
    return (
      <tbody>
        {this.state.users.map(this.renderTableRow.bind(this))}
      </tbody>
    )
  }

  handleClick(value) {
    window.location = `/team/${value}/edit`
  }

  renderTableRow(user) {
    return (
      <tr value={user.id} onClick={() => this.handleClick(user.id)}>
        <td>
          {user.name || ''}
        </td>

        <td>
          {user.username || ''}
        </td>

        <td>
          {user.email || ''}
        </td>

        <td>
          {user.role || ''}
        </td>
        <td><Moment format="MM/DD/YYYY">{user.createdAt || ''}</Moment></td>
      </tr>
    )
  }

  searchQuery() {
    let roles = '';
    let searchParams = '';
    if (this.state.searchAdmin) roles += ',Admin'
    if (this.state.searchReps) roles += ',Rep'
    if (this.state.searchPhysicians) roles += ',Physician'
    var roleFilter = roles.substring(1);
    if (this.state.searchName) searchParams += '&name=' + this.state.searchName
    if (this.state.searchUsername) searchParams += '&username=' + this.state.searchUsername
    if (this.state.searchEmail) searchParams += '&email=' + this.state.searchEmail
    const loginToken = window.localStorage.getItem("token");
    axios.get('api/user/search?userRole=' + roleFilter + searchParams, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          users: resp.data.response
        })
      }).catch((error) => {
        console.error(error);
      })
  }

  userSearch(e) {
    this.setState({ searchAdmin: e.includes(1) }, this.searchQuery)
    this.setState({ searchReps: e.includes(2) }, this.searchQuery)
    this.setState({ searchPhysicians: e.includes(3) }, this.searchQuery)
  }


  render() {

    if (this.state.users) {
      var userList = this.state.users.map(function (item, i) {
        console.log(item);
        return (
          <div key={i}>
          </div>
        )
      })
    }
    else {
      return <div>
        <p></p>
      </div>
    }

    return (
      <div className={styles.app}>

        <div className="body" style={{ marginTop: 1 }}>

          <ActionBox>

            <div className="main">

              <ToggleButtonGroup
                name='teamSearch'
                type='checkbox'
                className="teamSearch"
                value={this.state.value}
              >
                {/* <ToggleButton value={1}>Admin</ToggleButton>
                <ToggleButton value={2}>Sales</ToggleButton> */}
                <ToggleButton value={3}>Physicians</ToggleButton>
              </ToggleButtonGroup>

              <div className="teamSearchInput" style={{ 'display': 'flex' }}>
                <Input
                  label="Search By Name"
                  placeholder="First or Last Name..."
                  value={this.state.searchName}
                  onChange={searchName => this.setState({ searchName })}
                  onKeyPress={this.enterPressed.bind(this)}
                />

                <Input
                  label="Search By Username"
                  placeholder="Username..."
                  value={this.state.searchUsername}
                  onChange={searchUsername => this.setState({ searchUsername })}
                  onKeyPress={this.enterPressed.bind(this)}
                />

                <Input
                  label="Search By Email"
                  placeholder="Email..."
                  value={this.state.searchEmail}
                  onChange={searchEmail => this.setState({ searchEmail })}
                  onKeyPress={this.enterPressed.bind(this)}
                />
              </div>

              <Button
                search
                style={{ marginLeft: 20, lineHeight: 1, height: 38 }}
                icon="search"
                title="SEARCH"
                onClick={this.searchQuery.bind(this)}
              />

              <Button
                style={{ marginLeft: 20 }}
                link='/team/add'
                icon="plus"
                title="ADD A NEW USER"
              />

            </div>

          </ActionBox>
          {/* {this.state.users ?
            <TablePagination
              headers={th}
              data={this.state.users}
              columns={"name.username.email.role.createdAt"}
              perPageItemCount={10}
              totalCount={this.state.users.length}
            // arrayOption={ [["size", 'all', ' ']] }
            />
            
            :
            <div></div>} */}
          {this.renderTable()}
          {userList}

        </div>

      </div>
    );
  }
}

const mapStateToProps = ({ main }) => {
  const {
    adminsDisplay,
  } = main
  return {
    users: adminsDisplay,
  }
}

const actions = {
  getTeamMembers,
  filterTeamMembers,
  setMember,
}

export default connect(mapStateToProps, actions)(TeamViewRep);
