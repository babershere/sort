import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment'
import jwt_decode from 'jwt-decode'

// Components
import {
  Button,
  Selector,
  TextArea,
  FormModal,
} from '../../common'

import styles from './PhysicianNoteModal.css'

export default class PhysicianNoteModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      note: '',
      visitId: '',
      visits: []
    }
  }

  get inactive() {
    const {
      note,
      visitId
    } = this.state

    return !note, !visitId
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    var decoded = jwt_decode(token);
    this.setState({
      userId: decoded.id,
      username: decoded.username
    }, this.getUserInfo)
    console.log(this.props, this.state)

    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/visits/search?physicianId=' + this.props.props.pID.match.params.physicianId, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);
        this.setState({
          visits: resp.data.response
        })
      }).catch((error) => {
        console.error(error);
      })
  }



  getUserInfo() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/user/search?userId=' + this.state.userId, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          userName: resp.data.response[0].name,
          userImage: resp.data.response[0].link
        })
      }).catch((err) => {
        console.error(err)
      })
  }

  onSubmit(e) {
    e.preventDefault()
    console.log(this.state.visitId)
    const loginToken = window.localStorage.getItem("token");
    let data = new FormData();
    axios.post('/api/visits/notes/add?visitId=' + this.state.visitId + '&physicianId=' + this.props.props.pID.match.params.physicianId + '&userId=' + this.state.userId + '&name=' + this.state.userName + '&note=' + this.state.note + '&userImage=' + this.state.userImage,
      data, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((data) => {
        console.log(data);
        this.props.onClickAway()
        window.location.reload();
      }).catch((error) => {
        console.error(error);
      })
  }

  render() {

    const visitOptions = [
      {
        key: 0,
        value: '',
        display: 'Select Relevant Visit',
      },
      ...this.state.visits.map(visit => ({
        key: visit.id,
        value: visit.id,
        display: moment(visit.dateTime).format("MM/DD") + " - " + moment(visit.dateTime).format("HH:mm") + " - " + visit.Rep,
      })),
    ]

    const {
      content,
      onClickAway,
    } = this.props

    return (
      <FormModal
        title="Add a Note"
        onClickAway={onClickAway}
        visible={!!content}
        onSubmit={this.onSubmit.bind(this)}
        className={styles.modal}
      >
        {/* Rep */}
        <label>
          Note
        </label>
        <TextArea
          placeholder="Add a note..."
          value={this.state.note}
          onChange={note => this.setState({ note })}
        />

        <br />

        <Selector
          options={visitOptions}
          onSelect={visitId => this.setState({ visitId })}
        />

        <div className="buttons">
          <Button
            large
            cancel
            type="button"
            title="Cancel"
            onClick={onClickAway}
          />
          <Button
            large
            inactive={this.inactive}
            type="submit"
            title="Post"
          />
        </div>
      </FormModal>
    )
  }
}
