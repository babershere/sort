import React, { Component } from 'react';
import axios from 'axios'
import jwt_decode from 'jwt-decode'

// Components
import {
  Button,
  Selector,
  FormModal,
} from '../../common'

import styles from './AttachmentModal.css'

export default class AttachmentModal extends Component {

  state = {
    attachmentFile: '',
    dateAttached: '',
    attachedBy: '',
    type: ''
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    var decoded = jwt_decode(token);
    this.setState({
      userId: decoded.id,
      username: decoded.username
    })
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  get inactive() {
    const {
      scriptFile,
      type
    } = this.state

    return !scriptFile, !type
  }

  onSubmit(e) {
    e.preventDefault()
    const loginToken = window.localStorage.getItem("token");
    const scriptId = this.props.props.state.id;
    let data = new FormData();
    data.append("attachmentFile", document.getElementById("pdf-file").files[0])
    axios.post('/api/attachments/upload?scriptId=' + scriptId + '&userId=' + this.state.userId + '&attachedBy=' + this.state.username + '&type=' + this.state.type,
      data, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((data) => {
        this.submitS3();
        // this.props.onClickAway()
      }).catch((error) => {
        console.error(error);
      })
  }

  submitS3() {
      const files = document.getElementById('pdf-file').files;
      const file = files[0];
      if (file == null) {
        return alert('No file selected.');
      }
      this.getSignedRequest(file);
    };
  

  getSignedRequest(file) {
    const loginToken = window.localStorage.getItem("token");
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/attachments/sign-s3?file-name=${file.name}&file-type=${file.type}&scriptId=` + this.props.props.state.id, { headers: { "Authorization": "Bearer " + loginToken }});
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(xhr.responseText);
          const response = JSON.parse(xhr.responseText);
          this.uploadFile(file, response.signedRequest, response.url);
        }
        else {
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }

  uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // document.getElementById('preview').src = url;
          // document.getElementById('avatar-url').value = url;
        this.props.onClickAway()
        console.log(url)
        window.open(url)
        }
        else {
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }


  render() {
    const {
      content,
      onClickAway,
    } = this.props

    const {
      type
    } = this.state

    const typeOptions = [
      '--',
      'Rx',
      'Delivery Signature',
      'PA form',
      'Medical Notes',
      'Copay Assistance Form',
      'Income Documents',
      'Shipping Label',
      'Other'
    ]

    return (
      <div>

        <FormModal
          title="Add Attachment"
          onClickAway={onClickAway}
          visible={!!content}
          onSubmit={this.onSubmit.bind(this)}
          className={styles.modal}
        >

          <label htmlFor="attachmentFile">Select PDF:</label>
          <input name="attachmentFile" onChange={this.onChangeHandler} accept=".pdf" id="pdf-file" type="file" />
          <br />
          <Selector
            wide
            selected={type}
            options={typeOptions}
            onSelect={type => this.setState({ type })}
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

        {/* <input type="file" id="file-input" />
        <p id="status">Please select a file</p>
        <img id="preview" src="/images/default.png" />

        <form method="POST" action="/save-details">
          <input type="hidden" id="avatar-url" name="avatar-url" value="/images/default.png" />>
        <input type="text" name="username" placeholder="Username" /><br />
          <input type="text" name="full-name" placeholder="Full name" /><br /><br />
          <input type="submit" onClick={this.submitS3.bind(this)} value="Update profile" />
        </form> */}
      </div>
    )
  }
}
