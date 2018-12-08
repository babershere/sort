import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'


import {
  Selector,
  Button,
  Header,
  Input,
  Body,
  Form,
  Icon
} from '../../../common'

// Actions
import {
  getPhysicians,
} from '../../../../actions/main'

import {
  createPatient,
} from '../../../../actions/patients'

import styles from './AddPatient.css'

class AddPatient extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      dob: '',
      sex: '',
      phone: '',
      email: '',
      patientWarning: '',
      physicians: '',
      physicianId: '',
      addressNum: 1,
      phoneNum: 1,
      conditions: '', allergies: '', primInsPlan: '', primInsBIN: '', primInsGroup: '', primInsID: '', primInsPCN: '', primInsType: '', secInsPlan: '', secInsBIN: '', secInsGroup: '', secInsID: '', secInsPCN: '', secInsType: '',
      addressStreet: '', addressCity: '', addressState: '', addressZipCode: '', address2Street: '', address2City: '', address2State: '', address2ZipCode: '', address3Street: '', address3City: '', address3State: '', address3ZipCode: '', phone: '', phone2: '', phone3: ''
    }
  }

  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/physicians/search/', { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          physicians: resp.data.response,
          // id: resp.data.response.id,    
        })
        console.log(this.state.physicians);
      }).catch((error) => {
        console.error(error);
      })
  }

  submitpatient = (event) => {
    event.preventDefault()
    const loginToken = window.localStorage.getItem("token");
    let data = new FormData();
    axios.post('/api/patients/add?firstName=' + this.state.firstName + "&lastName=" + this.state.lastName + "&dob=" + this.state.dob + "&sex=" + this.state.sex +
      '&email=' + this.state.email + '&patientWarning=' + this.state.patientWarning + '&conditions=' + this.state.conditions + '&allergies=' + this.state.allergies +
      '&primInsPlan=' + this.state.primInsPlan + '&primInsBIN=' + this.state.primInsBIN + '&primInsPCN=' + this.state.primInsPCN + '&primInsID=' + this.state.primInsID +
      '&primInsGroup=' + this.state.primInsGroup + '&primInsType=' + this.state.primInsType + '&secInsPlan=' + this.state.secInsPlan + '&secInsBIN=' + this.state.secInsBIN + '&secInsPCN=' + this.state.secInsPCN +
      '&secInsID=' + this.state.secInsID + '&secInsGroup=' + this.state.secInsGroup + '&secInsType=' + this.state.secInsType +
      '&addressStreet=' + this.state.addressStreet + '&addressCity=' + this.state.addressCity + '&addressState=' + this.state.addressState + '&addressZipCode=' + this.state.addressZipCode +
      '&address2Street=' + this.state.address2Street + '&address2City=' + this.state.address2City + '&address2State=' + this.state.address2State + '&address2ZipCode=' + this.state.address2ZipCode +
      '&address3Street=' + this.state.address3Street + '&address3City=' + this.state.address3City + '&address3State=' + this.state.address3State + '&address3ZipCode=' + this.state.address3ZipCode +
      '&phone=' + this.state.phone + '&phone2=' + this.state.phone2 + '&phone3=' + this.state.phone3,
      data, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((data) => {
        console.log(data);
        this.props.history.push("/patients");
      }).catch((error) => {
        console.error(error);
      })
  }

  addAddressField = () => {
    this.setState(prevState => {
      return { addressNum: prevState.addressNum + 1 }
    })
  }

  addPhoneField = () => {
    this.setState(prevState => {
      return { phoneNum: prevState.phoneNum + 1 }
    })
  }

  render() {

    const {
      firstName, lastName, dob, sex, phone, phone2, phone3, email, patientWarning, conditions, allergies, addressStreet, addressCity, addressState, addressZipCode, address2Street, address2City, address2State, address2ZipCode, address3Street, address3City, address3State, address3ZipCode, primInsPlan, primInsBIN, primInsPCN, primInsID,
      primInsGroup, primInsType, secInsPlan, secInsBIN, secInsPCN, secInsID, secInsGroup, secInsType
    } = this.state

    const sexOptions = [
      '--',
      'Male',
      'Female',
      'Other'
    ]

    const insTypeOptions = [
      '--',
      'Medicare Part B',
      'Medicare Part D',
      'Medicaid',
      'Commercial',
      'Patient Pay'
    ]

    const stateOptions = [
      "State",
      "AL",
      "AK",
      "AS",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "DC",
      "FM",
      "FL",
      "GA",
      "GU",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MH",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "MP",
      "OH",
      "OK",
      "OR",
      "PW",
      "PA",
      "PR",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VI",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY"
    ]

    return (
      <div className={styles.app} id="addPatient">
        <Header>
          <h2>Add Patient</h2>
          <div className="action">
            <Button
              cancel
              type="button"
              title="CANCEL"
              link="/patients"
              style={{ marginRight: 10 }}
            />
            <Button
              onClick={this.submitpatient}
              title="CREATE PATIENT"
              className="submit btn btn-default"
              type="submit"
              value="Submit"
              style={{ marginRight: 8 }}
            />
          </div>
        </Header>
        <Body className={styles.body}>
          <Form className="form">
            <div class="flex-grid">
              <div class="col">
                <Input
                  label="Patient Name"
                  placeholder="First Name"
                  value={firstName}
                  onChange={firstName => this.setState({ firstName })}
                />
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={lastName => this.setState({ lastName })}
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  value={dob}
                  onChange={dob => this.setState({ dob })}
                />

                <Selector
                  label="Sex"
                  options={sexOptions}
                  value={sex}
                  onSelect={sex => this.setState({ sex })}
                />

                <div className='phoneFields'>
                  <h5 style={{ 'font-weight': 'bold' }}>Phone</h5>
                  {this.state.phoneNum <= 2 ?
                    <span className='addFields' onClick={this.addPhoneField}>+ Add Additional Phone #</span>
                    : <span></span>}

                </div>
                <Input
                  value={phone}
                  onChange={phone => this.setState({ phone })}
                />
                {this.state.phoneNum >= 2 ?
                  <Input
                    style={{ marginTop: 15 }}
                    value={phone2}
                    onChange={phone2 => this.setState({ phone2 })}
                  />
                  : <div></div>}
                {this.state.phoneNum >= 3 ?
                  <Input
                    style={{ marginTop: 15 }}
                    value={phone3}
                    onChange={phone3 => this.setState({ phone3 })}
                  />
                  : <div></div>}


                <Input
                  label="Email"
                  value={email}
                  onChange={email => this.setState({ email })}
                />

                <Input
                  label="Patient Warning"
                  className="textarea"
                  value={patientWarning}
                  onChange={patientWarning => this.setState({ patientWarning })}
                />

              </div>
              <div class="col">

                <Input
                  label="Co-morbid Conditions"
                  className="textarea"
                  placeholder="Conditions (separate with ' , ')"
                  value={conditions}
                  onChange={conditions => this.setState({ conditions })}
                />

                <Input
                  label="Allergies"
                  className="textarea"
                  placeholder="Conditions (separate with ' , ')"
                  value={allergies}
                  onChange={allergies => this.setState({ allergies })}
                />

                <div className='addressFields'>
                  <h5 style={{ 'font-weight': 'bold' }}>Patient Address</h5>
                  {this.state.addressNum <= 2 ?
                    <span className='addFields' onClick={this.addAddressField}>+ Add Additional Address</span>
                    : <span></span>}
                </div>

                <Input
                  placeholder="Street"
                  value={addressStreet}
                  onChange={addressStreet => this.setState({ addressStreet })}
                />

                <Input
                  placeholder="City"
                  value={addressCity}
                  onChange={addressCity => this.setState({ addressCity })}
                />

                <Selector
                  placeholder="State"
                  options={stateOptions}
                  value={addressState}
                  onSelect={addressState => this.setState({ addressState })}
                />

                <Input
                  placeholder="ZipCode"
                  value={addressZipCode}
                  onChange={addressZipCode => this.setState({ addressZipCode })}
                />


                {this.state.addressNum >= 2 ?
                  <div style={{ marginTop: 15 }}>
                    <Input
                      placeholder="Street"
                      value={address2Street}
                      onChange={address2Street => this.setState({ address2Street })}
                    />

                    <Input
                      placeholder="City"
                      value={address2City}
                      onChange={address2City => this.setState({ address2City })}
                    />

                    <Selector
                      placeholder="State"
                      options={stateOptions}
                      value={address2State}
                      onSelect={address2State => this.setState({ address2State })}
                    />

                    <Input
                      placeholder="ZipCode"
                      value={address2ZipCode}
                      onChange={address2ZipCode => this.setState({ address2ZipCode })}
                    />
                  </div>
                  : <div></div>}

                {this.state.addressNum >= 3 ?
                  <div style={{ marginTop: 15 }}>
                    <Input
                      placeholder="Street"
                      value={address3Street}
                      onChange={address3Street => this.setState({ address3Street })}
                    />

                    <Input
                      placeholder="City"
                      value={address3City}
                      onChange={address3City => this.setState({ address3City })}
                    />

                    <Selector
                      placeholder="State"
                      options={stateOptions}
                      value={address3State}
                      onSelect={address3State => this.setState({ address3State })}
                    />

                    <Input
                      placeholder="ZipCode"
                      value={address3ZipCode}
                      onChange={address3ZipCode => this.setState({ address3ZipCode })}
                    />
                  </div>
                  : <div></div>}

              </div>
            </div>

            <div class="flex-grid">
              <div class="col">
                <h4>Primary Insurance</h4>
                <Input
                  label="Plan"
                  value={primInsPlan}
                  onChange={primInsPlan => this.setState({ primInsPlan })}
                />
                <Input
                  label="BIN"
                  value={primInsBIN}
                  onChange={primInsBIN => this.setState({ primInsBIN })}
                />
                <Input
                  label="PCN"
                  value={primInsPCN}
                  onChange={primInsPCN => this.setState({ primInsPCN })}
                />
                <Input
                  label="ID"
                  value={primInsID}
                  onChange={primInsID => this.setState({ primInsID })}
                />
                <Input
                  label="Group"
                  value={primInsGroup}
                  onChange={primInsGroup => this.setState({ primInsGroup })}
                />
                <Selector
                  label="Type"
                  options={insTypeOptions}
                  value={primInsType}
                  onSelect={primInsType => this.setState({ primInsType })}
                />
              </div>
              <div class="col">
                <h4>Secondary Insurance</h4>
                <Input
                  label="Plan"
                  value={secInsPlan}
                  onChange={secInsPlan => this.setState({ secInsPlan })}
                />
                <Input
                  label="BIN"
                  value={secInsBIN}
                  onChange={secInsBIN => this.setState({ secInsBIN })}
                />
                <Input
                  label="PCN"
                  value={secInsPCN}
                  onChange={secInsPCN => this.setState({ secInsPCN })}
                />
                <Input
                  label="ID"
                  value={secInsID}
                  onChange={secInsID => this.setState({ secInsID })}
                />
                <Input
                  label="Group"
                  value={secInsGroup}
                  onChange={secInsGroup => this.setState({ secInsGroup })}
                />
                <Selector
                  label="Type"
                  options={insTypeOptions}
                  value={secInsType}
                  onSelect={secInsType => this.setState({ secInsType })}
                />
              </div>
            </div>

          </Form>
        </Body>
      </div>
    );
  }
}

const mapStateToProps = ({ main }) => {
  const {
    loading
  } = main

  return {
    loading
  }
}

const actions = {
  getPhysicians,
  createPatient,
}

export default connect(mapStateToProps, actions)(AddPatient)
