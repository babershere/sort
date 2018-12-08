import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'

import { formatNumber, unformatNumber } from '../../../../lib/phoneHelper'


import {
  VisitModal,
  NoteModal,
  SwitchTable,
  AddressModal,
} from '../../../shared'

import {
  Input,
  Button,
  Header,
  Body,
  DateBox,
  Span,
} from '../../../common'

// Actions
import {
  createVisit,
} from '../../../../actions/main'

import {
  createNote,
  getPhysicianById,
  patchPhysicianById,
  clearState,
} from '../../../../actions/physicians'

import { Line } from 'react-chartjs-2';

import ScriptsTab from './Tabs/ScriptsTab'
import AppointmentsNotesTab from './Tabs/AppointmentsNotesTab'
import GroupTab from './Tabs/GroupTab'
import UsersTab from './Tabs/UsersTab'

import styles from './PhysicianView.css'

class PhysicianView extends Component {
  constructor(props) {
    super(props)
    this.tabOptions = [
      {
        value: 'scripts',
        display: 'Scripts',
        renderComponent: () => this.renderScriptsTab(),
      },
      {
        value: 'notes',
        display: 'Appointments/Notes',
        renderComponent: () => this.renderAppointmentsNotesTab(),
      },
      {
        value: 'group',
        display: 'Group Members',
        renderComponent: () => this.renderGroupTab(),
      },
      {
        value: 'users',
        display: 'Users',
        renderComponent: () => this.renderUsersTab()
      }
    ]

    this.state = {
      tab: this.tabOptions[0],
      ...this.initialState
    }
  }

  componentDidMount() {
    if (this.props.match.params.physicianId) {
      const loginToken = window.localStorage.getItem("token");
      axios.get('/api/physicians/search?physicianId=' + this.props.match.params.physicianId, { headers: { "Authorization": "Bearer " + loginToken } })
        .then((resp) => {
          console.log(resp);
          let physician = resp.data.response[0]
          this.setState({
            name: physician.firstName + " " + physician.lastName,
            id: physician.id,
            group: physician.group,
            specialization: physician.specialization,
            phone: physician.phone,
            fax: physician.fax,
            addressStreet: physician.addressStreet,
            addressCity: physician.addressCity,
            addressState: physician.addressState,
            addressZipCode: physician.addressZipCode,
            email: physician.email,
            NPI: physician.NPI,
            DEA: physician.DEA,
            rep: physician.rep,
            contact: physician.contact,
            physicianWarning: physician.physicianWarning
          })
        }).catch((err) => {
          console.error(err)
        })
    }
  }



  get initialState() {
    const physician = this.props.physician || {}
    const {
      firstName,
      lastName,
      group,
      specialty,
      address,
      username,
      phone,
      fax,
      rep,
      npi,
      dea,
      pointOfContact,
    } = physician

    return {
      // [notes, scripts, online]
      tab: this.tabOptions[0],
      editing: false,
      // contact info
      firstName,
      lastName,
      group,
      specialty,
      // contact box
      phone: formatNumber(phone),
      fax: formatNumber(fax),
      address,
      // misc info
      npi,
      dea,
      repId: rep ? rep.id : '',
      pointOfContact,
      // online tab
      username,
      password: '',
      // modals
      addressModal: null,
      visitModal: null,
      noteModal: null,
    }
  }


  save() {
    const id = this.props.physician.id
    const {
      username,
      password,
      firstName,
      lastName,
      group,
      specialty,
      phone,
      fax,
      address,
      pointOfContact,
      repId,
      npi,
      dea,
    } = this.state

    const update = {
      username,
      firstName,
      lastName,
      group,
      specialty,
      phone: unformatNumber(phone),
      fax: unformatNumber(fax),
      address,
      pointOfContact,
      repId,
      npi,
      dea,
    }

    if (password) {
      update.password = password
    }

    this.props.patchPhysicianById(id, update)

    this.setEditState(false)
  }

  renderContactInfo() {
    const {
      editing,
      firstName,
      lastName
    } = this.state

    var data = {
      labels: [ "June", "July", "August", "September", "October", "November"],
      datasets: [{
        label: "Physician Revenue",
        backgroundColor: '#ff8840',
        borderColor: '#f5bb94',
        data: [0, 15, 7, 40, 25, 70],
      }]
    }

    return (
      <div id="physicianView">
        <div className="flex-grid">
          <div id="contactInfo" className={styles.contactInfo}>
            {editing ? (
              <div className="name">
                Name:
                {this.state.name}
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
                  Name: {this.state.name}
                </div>
              )}

            <div>
              Group: {this.state.group}
            </div>
            <div>
              Specialty: {this.state.specialization}
            </div>
          </div>
          <div id="contactInfo" className={styles.contactInfo}>
            <Line data={data} />
          </div>

          <div id="contactInfo" className={styles.contactInfo}>
            <div>
              <Span icon="phone">
                {this.state.phone}
              </Span>
            </div>
            <div>
              <Span icon="print">
                {this.state.fax}
              </Span>
            </div>
            <div>
              <Span id="address" icon="building">
                {this.state.addressStreet}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.addressCity}, {this.state.addressState}, {this.state.addressZipCode}
              </Span>
            </div>
            <div>
              <Span className="blue" icon="envelope">
                {this.state.email}
              </Span>
            </div>
          </div>
        </div>
      </div>

    )
  }

  renderMiscInfo() {
    return (
      <div className={styles.miscInfo}>
        <div className="grid">
          <div className="item">
            <label>
              Physician's NPI
            </label>
            <Span>
              {this.state.NPI || 'None'}
            </Span>
          </div>
          <div className="item">
            <label>
              Physician's DEA
            </label>
            <Span>
              {this.state.DEA || 'None'}
            </Span>
          </div>
          <div className="item">
            <label>
              Physician Warning
            </label>
            <div id="physWarning">
              <Span>
                {this.state.physicianWarning || ""}
              </Span>
            </div>
          </div>
          <div className="item">
            <label>
              Point of Contact
            </label>
            <Span>
              {this.state.contact || 'None'}
            </Span>
          </div>
          <div className="item">
            <label>
              Sales Rep
            </label>
            <Span>
              {this.state.rep || 'Unassigned'}
            </Span>
          </div>
        </div>

      </div>
    )
  }

  setEditState(editing) {
    const password = ''
    let username = ''

    if (editing) {
      username = this.props.physician.username || ''
    }

    // retain selected tab
    const { tab } = this.state

    const newState = {
      ...this.initialState,
      tab,
      editing,
      username,
      password,
    }

    this.setState(newState)
  }

  openVisitModal() {
    const { physician } = this.props

    const visitModal = {
      physician,
    }

    this.setState({ visitModal })
  }

  openNoteModal(visit) {
    const noteModal = {
      visit,
    }

    this.setState({ noteModal })
  }

  closeModal() {
    this.setState({
      noteModal: null,
      visitModal: null,
      addressModal: null,
    })
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

  renderScheduleTab() {
    const { physician } = this.props

    if (!physician) {
      return null
    }

    const {
      visitModal,
      noteModal,
    } = this.state

    return (
      <div className={styles.notesTab}>
        <div className="header">
          <Button
            icon="plus"
            title="ADD VISIT?"
            onClick={() => this.openVisitModal()}
          />
        </div>

        <VisitModal
          content={visitModal}
          onSubmit={data => this.props.createVisit(data)}
          onClickAway={() => this.closeModal()}
        />

        <NoteModal
          content={noteModal}
          onSubmit={data => this.props.createNote(data)}
          onClickAway={() => this.closeModal()}
        />
      </div>
    )
  }

  renderVisit(visit) {
    const notes = visit.notes || []
    return (
      <div key={visit.id} className="visit">
        <DateBox
          visit={visit}
          buttonTitle="ADD NOTE"
          buttonIcon="plus"
          onClick={() => this.openNoteModal(visit)}
        />
        {notes.map(note => (
          <DateBox
            key={note.id}
            note={note}
          />
        ))}
      </div>
    )
  }

  renderScriptsTab() {
    return (
      <ScriptsTab
        className={styles.scriptsTab}
        pID={this.props}
        state={this.state}
        patient={this.props.patient}
        setState={this.setState.bind(this)}
      />
    )
  }

  renderAppointmentsNotesTab() {
    return (
      <AppointmentsNotesTab
        className={styles.scriptsTab}
        pID={this.props}
        state={this.state}
        patient={this.props.patient}
        setState={this.setState.bind(this)}
      />
    )
  }

  renderGroupTab() {

    return(
      <GroupTab
        className={styles.scriptsTab}
        pID={this.props}
        state={this.state}
        patient={this.props.patient}
        setState={this.setState.bind(this)}
      />
    )
}

renderUsersTab() {

  return(
    <UsersTab
      className={styles.scriptsTab}
      pID={this.props}
      state={this.state}
      patient={this.props.patient}
      setState={this.setState.bind(this)}
    />
  )
}

  render() {

    return (
      <div>
        <Header className={styles.header}>
          <h2 style={{marginBottom: 25}}>
            {this.state.name}
            <span onClick={this.renderGroupTab.bind(this)} className="group">
              {this.state.group || 'No Group Available'}
            </span>
            <div className="action">
              <Button
                search
                icon="edit"
                title="EDIT PHYSICIAN"
                link={`/physicians/${this.props.match.params.physicianId}/edit`}
                style={{ marginLeft: 8 }}
              />

              <Button
                search
                icon="lock"
                title="GIVE ACCESS"
                style={{ marginLeft: 8 }}
                link={`/physicians/${this.props.match.params.physicianId}/access`}
              />
            </div>
          </h2>
        </Header>
        <Body className={styles.body}>
          {this.renderContactInfo()}
          {/* <ContactInfo
            className={styles.contactInfo}
            physician={physician}
            editing={editing}
            state={this.state}
            onChange={newState => this.setState(newState)}
            closeModal={() => this.closeModal()}
          /> */}
          {this.renderMiscInfo()}
          {/*  <MiscInfo
            className={styles.miscInfo}
            physician={physician}
            editing={editing}
            state={this.state}
            onChange={newState => this.setState(newState)}
          /> */}

          {this.renderSwitchTable()}
        </Body>

        {/* Address Modal */}
        <AddressModal
          content={this.state.addressModal}
          onSubmit={address => this.setState({ address })}
          onClickAway={() => this.closeModal()}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ auth, physicians }) => {
  const {
    physician,
    error,
  } = physicians

  const {
    me,
  } = auth

  return {
    physician,
    error,
    me,
  }
}

const actions = {
  createVisit,
  createNote,
  clearState,
  patchPhysicianById,
  getPhysicianById,
}

export default connect(mapStateToProps, actions)(PhysicianView);
