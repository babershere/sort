import React, { Component } from 'react';
import axios from 'axios'

// Components
import {
  Button,
  Selector,
  FormModal,
} from '../../common'

import styles from './PhysicianModal.css'

export default class PhysicianModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      physicianId: ""
    }
  }


  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/physicians/search', { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);

        this.setState({
          physicians: resp.data.response
          // id: resp.data.response.id,    
        }, this.removeNullPhysician )
        console.log(this.state.physicians);
      }).catch((error) => {
        console.error(error);
      })
  }

  removeNullPhysician() {
    this.setState({
      physicianData: this.state.physicians.shift()
    })
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onUpdate(this.state.physicianId);
  }
  


  render() {
    const {
      content,
      onClickAway,
    } = this.props


    if (this.state.physicians) {
      const physicianOptions = [
        {
          key: '',
          value: '',
          display: 'Unassigned',
        },
        ...this.state.physicians.map(physician => ({
          key: physician.id,
          value: physician.id,
          display: physician.firstName + " " + physician.lastName,
        })),
      ]


    return (
      <FormModal
        title="Add Physician"
        onClickAway={onClickAway}
        visible={!!content}
        onSubmit={this.onSubmit.bind(this)}
        className={styles.modal}
      >

        <br />

        <Selector
          wide
          options={physicianOptions}
          value={this.state.physicianId}
          // onSelect={this.props.on ChangeValue}
          onSelect={physicianId => this.setState({ physicianId })}
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
            // inactive={this.inactive}
            type="submit"
            title="Add"
          />
        </div>
      </FormModal>
    )
  } else {
    return(
      <div>
      </div>
    )}}
} 
