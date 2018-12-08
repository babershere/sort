import React, { Component } from 'react';
import cn from 'classnames'
import calendarJs from 'calendar-js'
import axios from 'axios'
import moment from 'moment'
import Moment from 'react-moment'
import FontAwesome from 'react-fontawesome'

// Components
import {
  Icon,
  Button,
  Overlay,
  DateBox,
  Table,
  Span,
} from '../../../common'

import {
  VisitNoteModal,
} from '../../../shared'

import styles from './SideBar.css'


class SideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      getPhysician: true,
      visitNoteModal: ''
    }
  }

  componentWillReceiveProps() {
    this.setState({
      visitNotes: this.props.state.visitNotes,
      getPhysician: true
    })
  }

  openVisitNoteModal() {
    this.setState({ visitNoteModal: {} })
  }

  closeModal() {
    this.setState({
      visitNoteModal: null
    })
  }

  renderTableHead() {
    return (
      <thead>
      </thead>
    )
  }

  renderTableBody() {
    return (
      <tbody>
        {this.state.visitNotes.reverse().map(this.renderTableRow.bind(this))}
      </tbody>
    )
  }

  renderTableRow(visitNote) {
    return (
      <div></div>
    )
  }

  renderTable() {
    return (
      <Table>
        {this.renderTableHead()}
        {this.renderTableBody()}
      </Table>
    )
  }

  getPhysicianInfo() {
    const loginToken = window.localStorage.getItem("token");

    const {
      rep
    } = this.props

    const visit = { rep }.rep
    const firstName = visit.Physician.split(' ').slice(0, -1).join(' ');
    const lastName = visit.Physician.split(' ').slice(-1).join(' ');

    axios.get('api/physicians/search?dupFirstName=' + firstName + '&dupLastName=' + lastName, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          group: resp.data.response[0].group,
          addressStreet: resp.data.response[0].addressStreet,
          addressCity: resp.data.response[0].addressCity,
          addressState: resp.data.response[0].addressState,
          addressZipCode: resp.data.response[0].addressZipCode
        })

      }).catch((error) => {
        console.error(error);
      })

    axios.get('/api/visits/notes/search/?VisitId=' + this.props.rep.id, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          visitNotes: resp.data.response,
        })
      }).catch((error) => {
        console.error(error);
      })
  }

  render() {

    const {
      visible,
      flipped,
      onClickAway,
      onViewModal,
      rep,
      day,
      month,
      year,
    } = this.props

    if (!visible) {
      return null
    }
    if (this.state.getPhysician) {
      this.getPhysicianInfo();
      this.setState({
        getPhysician: false
      })
    }

    if (this.state.visitNotes) {
      var visitNoteList = this.state.visitNotes.reverse().map((item, i) =>
        <div id="visitNotesTab" key={i}>
          <Table className="vt">
            <thead><th>
              <div className="userImage" style={{ 'background-image': `url(/images/${item.UserId}/${item.userImage}` }}></div>
              <div className='visitNoteName'>{item.name}</div></th></thead>
            <tr>
              <td>{item.note}</td>
            </tr>
          </Table>

          <Table className="visitNoteDateTime" key={item.id}>
            <td>
              <Span icon="calendar" />
              <Moment format={"MM/DD/YY"}>{item.createdAt}</Moment>
              &nbsp;&nbsp;
                <Span icon="clock-o" />
              <Moment format={"hh:mm A"}>{item.createdAt}</Moment>
            </td>
          </Table>
        </div>
      );

    }
    else {
      return <div>
        <p></p>
      </div>
    }

    const {
      state,
      className,
      onCloseModal,
      onCreateNote,
    } = this.props

    const {
      visitNoteModal
    } = this.state

    const visit = { rep }.rep

    const renderVisit = visit => {
      const { physician, notes } = visit
      const time = moment(visit.dateTime).format('h:mm A')
      return (
        <div key={visit.id} className="visit">
          <div className="physician">
            <div className="line">
              <span>
                <FontAwesome name="clock-o" />
                {time}
              </span>
            </div>
            <div className="line">
              <span className="name">
                {physician.nameDisplay}
              </span>
              <span className="group">
                {this.state.group}
              </span>
            </div>
          </div>
          <div className="notes">
            <div className="title">
              Notes
          </div>
            <DateBox visit={visit} />
            {notes.map(note => (
              <DateBox key={note.id} note={note} />
            ))}
          </div>
        </div>
      )
    }

    const calendar = calendarJs().of(year, month)



    const time = moment(visit.dateTime).format('h:mm A')

    return (
      <div className={styles.sideBar}>
        <div className={cn("body", { flipped })}>
          <div className="header">
            <h2>{visit.Rep}</h2>
            <span className="date">
              {calendar.month} {day}, {year}
            </span>
            <span style={{ color: '#333', textAlign: 'left' }} className="label">
              SCHEDULE
          </span>
            <Icon
              name="times"
              button
              onClick={onClickAway}
            />
          </div>

          <div className="visits">
            <div key={visit.id} className="visit">
              <div className="physician">
                <div className="line">
                  <span>
                    <FontAwesome name="clock-o" />
                    {time}
                  </span>
                </div>
                <div className="line">
                  <span className="name">
                    {visit.Physician}
                  </span>
                  <span className="group">
                    {this.state.group}
                  </span>
                  <br />
                  {this.state.addressStreet},<br />
                  {this.state.addressCity}, {this.state.addressState}, {this.state.addressZipCode}
                </div>
              </div>

                <div className="header" style={{backgroundColor: '#f6f8fa', padding: 20}}>
                  <h6 style={{'display': 'inline', 'color': '#8d959a', 'font-weight': 'lighter', 'font-size': '14px'}}>Notes</h6>
                  <Button
                    style={{marginLeft: 5}}
                    icon="plus"
                    className="addVisitNote"
                    onClick={() => this.openVisitNoteModal()}
                  />
                </div>

                <div className="notes" className={className}>
                  {this.renderTable()}
                  {visitNoteList}
                </div>


              <VisitNoteModal
                content={visitNoteModal}
                onClickAway={this.closeModal.bind(this)}
                state={this.state}
                props={this.props}
                physicianId={this.props.rep.PhysicianId}
                onSubmit={onCreateNote}
                onCloseModal={() => this.closeModal()}
              />
              {/* <div className="notes">
          <div className="title">
            Notes
          </div>
          <DateBox visit={visit} /> */}
              {/* {notes.map(note => (
            <DateBox key={note.id} note={note} />
          ))} */}
              {/* </div> */}
            </div>

          </div>

          <Button style={{ width: '75%', margin: '20px auto' }} onClick={() => onViewModal({ rep, day })}>
            <FontAwesome name="plus" />
            SCHEDULE A NEW VISIT
        </Button>
        </div>
        <Overlay
          active
          className="overlay"
          onClick={onClickAway}
        />
      </div >
    )
  }
}

export default SideBar
