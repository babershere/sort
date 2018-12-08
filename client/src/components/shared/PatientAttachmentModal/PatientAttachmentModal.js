import React, { Component } from 'react';
import axios from 'axios'

// Components
import {
  Button,
  Selector,
  FormModal,
} from '../../common'

import styles from './PatientAttachmentModal.css'

export default class PatientAttachmentModal extends Component {
  /* constructor(props) {
    super(props)
  } */
    state = {
      patientFile: '',
      dateAttached: '',
      attachedBy: '',
      type: ''
    }
  

  onChangeHandler = (event) => {
    this.setState({
        [event.target.name]: event.target.value
    })
}

  get inactive() {
    const {
      patientFile,
      type
    } = this.state

    return !patientFile, !type
  }

  onSubmit(e) {
    console.log(this.state)
    e.preventDefault()
        const loginToken = window.localStorage.getItem("token");
        let data = new FormData();
        data.append("patientFile", document.getElementById("pdf-file").files[0])
        axios.post('/api/patientAttachments/upload?patientId=' + this.props.props.state.id + '&dateAttached=' + this.state.dateAttached + "&attachedBy=" + this.state.attachedBy + "&type=" + this.state.type, 
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

    const {
      patientFile,
      type
    } = this.state

    const typeOptions = [
      '--',
      'Insurance Card',
      'Assignment of Benefits',
      'Patient Agreement Form',
      'Other'
    ]  

    return (
      <FormModal
        title="Add File"
        onClickAway={onClickAway}
        visible={!!content}
        onSubmit={this.onSubmit.bind(this)}
        className={styles.modal}
      >
        <label htmlFor="patientFile">Select PDF:</label>
        <input name="patientFile" selected={patientFile} onSelect={patientFile => this.setState({ patientFile })} onChange={this.onChangeHandler} accept=".pdf" id="pdf-file" type="file" />

        <br />

        <Selector
            wide
            selected={type}
            options={typeOptions}
            onSelect={type => this.setState({ type })}
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
