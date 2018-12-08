import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import { Table, Header, Input, ActionBox, Button, Selector } from '../../../common'

import {
  getPhysicians,
  filterPhysicians,
} from '../../../../actions/main'

import {
  setPhysician,
} from '../../../../actions/physicians'

import styles from '../PhysiciansView/PhysiciansView.css'

class PhysiciansViewRep extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterValue: 0,
      searchType: '',
      search: '',
      physicians: '',
      searchName: '',
      searchAddress: '',
      searchGroup: '',
      searchSpec: ''
    }
    this.searchQuery = this.searchQuery.bind(this);
  }

  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    var decoded = jwt_decode(loginToken);
    this.setState({
      userId: decoded.id
    }, this.getUserInfo)
  }

  getUserInfo() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/user/search?userId=' + this.state.userId, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          name: resp.data.response[0].name
        }, this.getRelativePhysicians)
      }).catch((err) => {
        console.error(err)
      })
  }

  getRelativePhysicians() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('api/physicians/search?rep=' + this.state.name, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);
        this.setState({
          physicians: resp.data.response
        })
      }).catch((error) => {
        console.error(error);
      })
  }

  searchQuery() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('api/physicians/search?name=' + this.state.searchName + '&searchGroup=' + this.state.searchGroup + '&address=' + this.state.searchAddress
    + '&searchSpec=' + this.state.searchSpec, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp.data.response);
        this.setState({
          physicians: resp.data.response,
        })
        
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

  renderTableHead() {
    return (
      <thead>
        <tr>
          <th>
            Physician Name
          </th>
          <th>
            Group
          </th>
          <th>
            Rep
          </th>
          <th>
            Specialty
          </th>
          <th>
            Phone
          </th>
          <th>
            Address
          </th>
        </tr>
      </thead>
    )
  }

  renderTableBody() {
    return (
      <tbody>
        {this.state.physicians.map(this.renderTableRow.bind(this))}
      </tbody>
    )
  }

  handleClick(value) {
    window.location = `/physicians/${value}`
  }

  renderTableRow(physician) {
    return (
      <tr value={physician.id} onClick={() => this.handleClick(physician.id)}>

        <td>
          {physician.firstName} {physician.lastName}
        </td>

        <td>
          {physician.group || 'None'}
        </td>

        <td>
          {physician.rep || 'None'}
        </td>

        <td>
          {physician.specialization || 'None'}
        </td>

        <td>
          {physician.phone || 'None'}
        </td>

        <td>
          {physician.addressStreet}<br />
          {physician.addressCity}, {physician.addressState}, {physician.addressZipCode}
        </td>

      </tr>
    )
  }

  renderTable() {
    return (
      <Table className={styles.table}>
        {this.renderTableHead()}
        {this.renderTableBody()}
      </Table>
    )
  }

  render() {
    if (this.state.physicians) {
      var physicianList = this.state.physicians.map(function (item, i) {
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

    const specOptions = [
      '',
      'Internal Medicine',
      'Home Health',
      'Hospice',
      'Skilled Nursing Center',
      'Assisted Living',
      'Hospital',
      'Residential Living',
      'Oncology',
      'Rheumatology',
      'Dermatology',
      'Nephrology',
      'Neurology',
      'Gastroenterology',
      'Allergy',
      'Infectious Disease',
      'Transplant',
      'Orthopedic',
      'Endocrinology',
      'Urology',
      'Cardiology',
      'Hepatology',
      'Pulmonology'
    ]

    return (
      <div className={styles.app}>

        <Header>

          <h2>
            Select A Physician
          </h2>

          <div className="action">
            <Button
              link="physicians/add"
              icon="plus"
              title="ADD A NEW PHYSICIAN"
              style={{ marginRight: 8 }}
            />
          </div>

        </Header>

        <div className="body">

          <ActionBox className='searchBar'>
            <div className="main">

              <Input
                label="Search By Name"
                placeholder="First or Last Name..."
                value={this.state.searchName}
                onChange={searchName => this.setState({ searchName })}
                onKeyPress={this.enterPressed.bind(this)}
              />

              <Input
                label="Search By Group"
                placeholder="Group Name..."
                value={this.state.searchGroup}
                onChange={searchGroup => this.setState({ searchGroup })}
                onKeyPress={this.enterPressed.bind(this)}
              />

              <Input
                label="Search By Address"
                placeholder="Address or City..."
                value={this.state.searchAddress}
                onChange={searchAddress => this.setState({ searchAddress })}
                onKeyPress={this.enterPressed.bind(this)}
              />

              <Input
                label="Search By Phone"
                placeholder="(---) --- ---"
                value={this.state.searchPhone}
                onChange={searchPhone => this.setState({ searchPhone })}
                onKeyPress={this.enterPressed.bind(this)}
              />

              <Selector
                label="Search By Specialty"
                placeholder="Specialty..."
                options={specOptions}
                value={this.state.searchSpec}
                onSelect={searchSpec => this.setState({ searchSpec })}
                onKeyPress={this.enterPressed.bind(this)}
              />

              <Button
                search
                icon="search"
                title="SEARCH"
                onClick={this.searchQuery}
              />

            </div>

          </ActionBox>

          {this.renderTable()}
          {physicianList}

        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ main }) => {
  const {
    physiciansDisplay,
    reps,
  } = main

  return {
    physicians: physiciansDisplay,
    reps,
  }
}

const actions = {
  setPhysician,
  getPhysicians,
  filterPhysicians,
}

export default connect(mapStateToProps, actions)(PhysiciansViewRep);
