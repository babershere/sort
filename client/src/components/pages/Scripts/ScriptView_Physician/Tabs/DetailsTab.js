import React, { Component } from 'react';
import axios from 'axios'
import Moment from 'react-moment'

// Components
import {
  Header,
  Body,
  Link,
  Selector,
  Span,
  TextArea
} from '../../../../common'



class DetailsTab extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      refills: 0 }
  }
  state = {
    script: ''
  }
  

  componentDidMount() {
    let scriptNum = this.props.sID.match.params.scriptId;
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/scripts/search?scriptId=' + scriptNum, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        let script = resp.data.response[0];
        this.setState({
          id: script.id,
          processedOn: script.processedOn,
          status: script.status,
          writtenDate: script.writtenDate,
          patientId: script.PatientId,
          patientName: script.Patient.firstName + " " + script.Patient.lastName,
          patientDob: script.Patient.dob,
          patientPhone: script.Patient.phone,
          patientEmail: script.Patient.email,
          primInsPlan: script.Patient.primInsPlan, primInsBIN: script.Patient.primInsBIN, primInsGroup: script.Patient.primInsGroup, primInsID: script.Patient.primInsID, primInsPCN: script.Patient.primInsPCN, primInsType: script.Patient.primInsType,
          secInsPlan: script.Patient.secInsPlan, secInsBIN: script.Patient.secInsBIN, secInsGroup: script.Patient.secInsGroup, secInsID: script.Patient.secInsID, secInsPCN: script.Patient.secInsPCN, secInsType: script.Patient.secInsType,
          conditions: script.Patient.conditions,
          allergies: script.Patient.allergies,
          physicianId: script.PhysicianId,
          physicianName: script.Physician.firstName + " " + script.Physician.lastName,
          physicianContact: script.Physician.contact,
          physicianPhone: script.Physician.phone,
          physicianRep: script.Physician.rep,
          productName: script.Product.name,
          productNDC: script.Product.NDC,
          cost: script.Product.cost,
          productQuantity: script.Product.quantity,
          billOnDate: script.billOnDate,
          rxNumber: script.rxNumber,
          phone: script.phone,
          diagnosis: script.diagnosis,
          email: script.email,
          secDiagnosis: script.secDiagnosis,
          refills: script.refills,
          refillsRemaining: script.refillsRemaining,
          quantity: script.quantity,
          daysSupply: script.daysSupply,
          salesCode: script.salesCode,
          primInsPay: script.primInsPay,
          secInsPay: script.secInsPay,
          location: script.location,
          copayApproval: script.copayApproval,
          copayNetwork: script.copayNetwork,
          networkPay: script.networkPay,
          patientPay: script.patientPay,
          directions: script.directions,
          shipOn: script.shipOn,
          deliveryMethod: script.deliveryMethod,
          trackNum: script.trackNum,
          ETA: script.ETA,
          paymentOption: script.paymentOption,
          
        })
        

      }).catch((err) => {
        console.error(err)
      })
  }


  setEditState(editing) {
    this.setState({ ...this.initialState, editing })
  }

  save() {
    const loginToken = window.localStorage.getItem("token");
    let data = new FormData();
    axios.put('/api/scripts/update?id=' + this.state.id + '&processedOn=' + this.state.processedOn + '&writtenDate=' + this.state.writtenDate
      + '&billOnDate=' + this.state.billOnDate + '&rxNumber=' + this.state.rxNumber + '&diagnosis=' + this.state.diagnosis + '&secDiagnosis=' + this.state.secDiagnosis
      + '&refills=' + this.state.refills + '&refillsRemaining=' + this.state.refillsRemaining + '&quantity=' + this.state.quantity + '&daysSupply=' + this.state.daysSupply
      + '&salesCode=' + this.state.salesCode + '&cost=' + this.state.cost + '&primInsPay=' + this.state.primInsPay + '&secInsPay=' + this.state.secInsPay
      + '&copayApproval=' + this.state.copayApproval + '&copayNetwork=' + this.state.copayNetwork + '&patientPay=' + this.state.patientPay + '&status=' + this.state.status,
      data, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((data) => {
        console.log(data);
        window.location.reload();
      }).catch((error) => {
        console.error(error);
      })
  }

  render() {

    const statusOptions = [
      'No Status',
      'Received',
      'Review',
      'Prior Auth',
      'Process',
      'Copay Assistance',
      'Schedule',
      'QA',
      'Fill',
      'Shipped',
      'Done',
      'Cancelled',
      'Refill'
    ]

    const copayApprovalOptions = [
      'Approved',
      'Denied'
    ]

    const copayNetworkOptions = [
      'Cancer Care Foundation',
      'Chronice Disease Fund',
      'Health Well',
      'LLS',
      'Patient Access Network',
      'Patient Advocate',
      'Patient Service Inc',
      'Safety Net Foundation',
      'Good Days',
      'Coupon',
      'Voucher',
      'Copay Card'
    ]

    const totalPay = ""

    const {
      editing
    } = this.state

    if (this.state.conditions) {
      var conditions = this.state.conditions.split(",").join("\n")
    }

    if (this.state.allergies) {
      var allergies = this.state.allergies.split(",").join("\n")
    }

    // if (this.state.primInsPay) {
    //   const totalPay = this.state.primInsPay - this.state.secInsPay
    //   return totalPay;
    // }

    return (
      <div>
        <Header>
        </Header>
        <Body id="scriptView">
          <div id="scriptViewColumns">
            <div className="scriptViewColumn1">
              <table>
                {/* <table className={styles.scriptView}> */}
                <tbody>
                  <tr style={{ lineHeight: '1.8em' }}>
                    <td className="field">Processed On</td>
                    <td className="value">
                      <Moment format="MM/DD/YYYY">{this.state.processedOn || ''}</Moment>
                    </td>
                    <td className="field">Written Date</td>
                    <td className="value">
                      <Moment stye={{ lineHeight: '1.8em' }} format="MM/DD/YYYY">{this.state.writtenDate || ''}</Moment>
                    </td>
                  </tr>
                  <tr style={{ lineHeight: '1.8em' }}>
                    <td className="field">Patient Name</td>
                    <td className="setValue">
                      <Link to={'../patients/' + this.state.patientId} activeClassName="active">
                        {this.state.patientName || ''}
                      </Link>
                    </td>
                    <td className="field">Prior Authorization</td>
                    <td className='value'></td>
                   
                  </tr>
                  <tr>
                    <td className="field">Date of Birth</td>
                    <td className="value"><Moment format="MM/DD/YYYY">{this.state.patientDob || ''}</Moment></td>
                    <td className="field">RX Number</td>
                    <td className="value">{this.state.rxNumber || ''} </td>
                  </tr>
                  <tr>
                    <td className="field">Phone</td>
                    <td className="value">{this.state.patientPhone || ''}</td>
                    <td className="field">Location</td>
                    <td className='value'>{this.state.location || ''}</td>
                   
                  </tr>
          
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td className="field">Physician</td>
                    <td className="setValue">
                      {/* <Link to={'../physicians/' + this.state.physicianId} activeClassName="active"> */}
                        {this.state.physicianName || ''}
                      {/* </Link></td> */}</td>
                    <td className="field">Refill #</td>
                    <td className="value">{this.state.refills || ''}</td>
                  </tr>
                  <tr>
                    <td className="field">Contact</td>
                    <td className="value">{this.state.physicianContact || ''}</td>
                    <td className="field">Refills Remaining</td>
                    <td className="value">{this.state.refillsRemaining || ''}</td>
                  </tr>
                  <tr>
                    <td className="field">Phone</td>
                    <td className="value">{this.state.physicianPhone || ''}</td>
                    <td className="field">Quantity</td>
                    <td className="value">{this.state.quantity || ''}</td>
                  </tr>
                  <tr>
                    <td className="field">Rep</td>
                    <td className="value">{this.state.physicianRep || ''}</td>
                    <td className="field">Days Supply</td>
                    <td className='value'>{this.state.daysSupply || ''}</td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td className="field">Medicine</td>
                    <td className='value'>{this.state.productName || ''}</td>
                    <td className="field">Patient Pay</td>
                    <td className='value'>{this.state.patientPay}</td>
                 
                  </tr>
                  <tr>
                    <td className="field">Ship On</td>
                    <td className='value'><Moment format="MM/DD/YYYY">{this.state.shipOn || ''}</Moment></td>
                    <td className="field">ETA</td>
                    <td className='value'><Moment format="MM/DD/YYYY">{this.state.ETA}</Moment></td>
                  </tr>
                  <tr>
                    <td className="field">Instructions</td>
                    <td className='value'>{this.state.directions || ''}</td>
                
                  </tr>
              
                </tbody>
              </table>
</div>

            <div className="scriptViewColumn2">

              <table>
                <tr>
                  <td>
                    <Span
                      label="Co-morbid conditions"
                    >
                      <TextArea
                        disabled
                        id='symptoms'
                        placeholder={conditions}
                      />
                    </Span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Span
                      label="Allergies"
                    >
                      <TextArea
                        disabled
                        id='symptoms'
                        placeholder={allergies}
                      /></Span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </Body>
     </div>
    )
  }
}

export default DetailsTab;
