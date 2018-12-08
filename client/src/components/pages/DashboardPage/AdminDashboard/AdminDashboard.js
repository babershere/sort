import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'

// Helpers
import { formatCurrencyOptions } from '../../../../lib'

// Components
import {
  SummaryItem,
  Table,
  Span,
} from '../../../common'

import styles from './AdminDashboard.css'

class AdminDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      patientNum: '',
      physicianNum: ''
    }
  }
  renderCard({title, content}) {
    return (
      <SummaryItem
        className="card"
        key={title}
        title={title}
        content={content}
      />
    )
  }

  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('api/patients/search/', { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp.data.response);
        this.setState({
          patientNum: resp.data.response.length
        })
        console.log(this.state.patients)
      }).catch((error) => {
        console.error(error);
      })

      axios.get('api/physicians/search/', { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp.data.response);
        this.setState({
          physicianNum: resp.data.response.length
        })
        console.log(this.state.patients)
      }).catch((error) => {
        console.error(error);
      })
  }

  
  renderCards() {
    // const patients = this.props.patients.length
    // const repeatPatients = this.props.patients.filter(el => el.scripts).length
    // const newPhysicians = this.props.physicians.filter(el => !el.repId).length
    const cardData1 = [
      { title: 'Revenue', content: '$0' },
      { title: 'Daily AVG Revenue', content: '$0' },
      { title: 'Cost', content: '$0' },
      { title: 'Profit', content: '$0' },
      { title: 'Daily AVG Profit', content: '$0' }
    ]
    const cardData2 = [
      { title: 'Sales', content: '$0' },
      { title: 'Revenue per Sale', content: '$0' },
      { title: 'Repeat Patients', content: '0' },
      { title: 'New Patients', content: this.state.patientNum || '-' },
      { title: 'New Physicians', content: this.state.physicianNum || '-' }
    ]

    return (<div className="cardStack">
      <div className="cards">
        {cardData1.map(this.renderCard.bind(this))}
      </div>
      <div className="cards">
      {cardData2.map(this.renderCard.bind(this))}
    </div></div>
    )
  }

  renderRepRow(rep) {
    return (
      <tr key={rep.id}>
        <td>
          <Span
            link={`/team/${rep.id}`}
            icon='user-circle'
          >
            {rep.nameDisplay}
          </Span>
        </td>
        <td>
          {rep.bonus.toLocaleString(...formatCurrencyOptions)}
        </td>
      </tr>
    )
  }

  renderRepScorecard() {
    const { reps } = this.props
    return (
      <div className="card-container">
        <h2>
          Rep Scorecard
        </h2>
        <Table
          className={styles.repsTable}
          borderless
        >
          <thead>
            <tr>
              <th>
                Rep
              </th>
              <th>
                Bonus
              </th>
            </tr>
          </thead>
          <tbody>
            {reps.map(this.renderRepRow.bind(this))}
          </tbody>
        </Table>
      </div>
    )
  }

  renderPhysicianRow(physician) {
    return (
      <tr key={physician.id}>
        <td>
          <Span icon='user-circle' />
          <div className="physician">
            <Span
              className="name"
              link={`/physicians/${physician.id}`}
            >
              {physician.nameDisplay}
            </Span>
            <span className="group">
              {physician.group || 'No Group Found'}
            </span>
          </div>
        </td>
      </tr>
    )
  }

  renderUnassignedPhysicians() {
    const physicians = this.props.physicians.filter(el => !el.repId)
    return (
      <div className="card-container">
        <h2>
          Unassigned Physicians
        </h2>
        <Table
          className={styles.physiciansTable}
          borderless
        >
          <thead>
            <tr>
              <th>
                Physician
              </th>
            </tr>
          </thead>
          <tbody>
            {physicians.map(this.renderPhysicianRow.bind(this))}
          </tbody>
        </Table>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.body}>
        {/* <div className="graph">
        </div> */}
        {this.renderCards()}

        {/* <div className="cards">
          {this.renderRepScorecard()}
          {this.renderUnassignedPhysicians()}
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = ({ main }) => {
  const {
    physicians,
    patients,
    reps,
  } = main
  return {
    physicians,
    patients,
    reps,
  }
}

const actions = {
}

export default connect(mapStateToProps, actions)(AdminDashboard);
