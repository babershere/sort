import React, { Component } from 'react';
import axios from 'axios'
import jwt_decode from 'jwt-decode'

// Components
import {
  Button,
  TextArea,
  FormModal,
} from '../../common'

import styles from './VisitNoteModal.css'

export default class VisitModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      note: '',
    }
  }

  get inactive() {
    const {
      note,
    } = this.state

    return !note
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    var decoded = jwt_decode(token);
    this.setState({
      userId: decoded.id,
      username: decoded.username
    }, this.getUserInfo)
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
    const visitId = this.props.props.rep.id;
    const loginToken = window.localStorage.getItem("token");
    let data = new FormData();
    axios.post('/api/visits/notes/add?visitId=' + visitId + '&physicianId=' + this.props.physicianId + '&userId=' + this.state.userId + '&name=' + this.state.userName + '&note=' + this.state.note + '&userImage=' + this.state.userImage,
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
