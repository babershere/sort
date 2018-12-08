import React, { Component } from 'react';
import axios from 'axios'
import Moment from 'react-moment'
import moment from 'moment';


// Components
import {
  Header,
  Body,
  Link,
  Button,
  Span,
  TextArea
} from '../../../../common'



class DetailsTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refills: 0,
      refresh: false,
      networkPay: ''
    }
    this.refillConfirm = this.refillConfirm.bind(this)
    // this.generateRefillScript = this.generateRefillScript.bind(this);
  }
  state = {
    script: ''
  }


  componentWillReceiveProps(props) {
    this.reMount();
  }

  reMount() {
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
          patientWarning: script.Patient.patientWarning,
          physicianId: script.PhysicianId,
          physicianName: script.Physician.firstName + " " + script.Physician.lastName,
          physicianContact: script.Physician.contact,
          physicianPhone: script.Physician.phone,
          physicianRep: script.Physician.rep,
          physicianWarning: script.Physician.physicianWarning,
          productId: script.Product.id,
          productName: script.Product.name,
          productNDC: script.Product.NDC,
          cost: script.cost,
          priorAuth: script.priorAuth,
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

        }, this.calcTotalPay)


      }).catch((err) => {
        console.error(err)
      })
  }

  componentDidMount() {
    this.reMount();
  }

  calcTotalPay() {
    console.log(this.state.cost, this.state.primInsPay, this.state.secInsPay, this.state.networkPay, this.state.patientPay)
    if (this.state.cost && this.state.primInsPay && this.state.secInsPay && this.state.networkPay && this.state.patientPay) {
      let totalPay = +this.state.primInsPay + +this.state.secInsPay + +this.state.networkPay + +this.state.patientPay;
      let profit = (totalPay - this.state.cost).toFixed(2);
      let margin = (profit / totalPay * 100).toFixed(1) + '%';
      this.setState({
        totalPay: totalPay,
        profit: profit,
        margin: margin
      })
    } else {
      this.setState({
        totalPay: 'Input needed',
        profit: '',
        margin: ''
      })
    }
  }

  refillConfirm() {
    if (window.confirm('Generate refill?')) {
      this.generateRefillScript();
    } else {
      return;
    }
  }

  generateRefillScript() {
    let count = this.state.refills;
    count++;
    let num = this.state.refillsRemaining
    let newStatus;
    if (num == 0) {
        newStatus = 'Renew'
    } else if (num !== 0) {
        newStatus = 'Refill'
    }
    this.setState({
        newProcessedOn: moment(this.state.processedOn).add(this.state.daysSupply, 'days').subtract(10, 'days').format('MM-DD-YYYY'),
        newRefills: count,
        newRefillsRemaining: this.state.refillsRemaining - 1,
        newStatus: newStatus
    }, (this.refillLogic))
}

refillLogic() {
  if (this.state.newRefillsRemaining < 0) {
      this.setState({
          newRefills: '',
          newRefillsRemaining: ''
      }, this.addScript)
  } else {
      this.addScript();
  }
}

addScript() {
  const loginToken = window.localStorage.getItem("token");
  let data = new FormData();
  axios.post('/api/scripts/add?patientId=' + this.state.patientId + '&physicianId=' + this.state.physicianId + '&productId=' + this.state.productId + '&processedOn=' + this.state.newProcessedOn + '&pouch=' + this.state.pouch + "&medication=" + this.state.medication + "&status=" + this.state.newStatus + "&pharmNPI=" + this.state.pharmNPI
      + "&priorAuth=" + this.state.priorAuth + "&location=" + this.state.location + "&pharmDate=" + this.state.pharmDate + "&writtenDate=" + this.state.writtenDate + "&salesCode=" + this.state.salesCode +
      "&billOnDate=" + this.state.billOnDate + "&cost=" + this.state.cost + "&rxNumber=" + this.state.rxNumber + "&primInsPay=" + this.state.primInsPay + "&diagnosis=" + this.state.diagnosis +
      "&secInsPay=" + this.state.secInsPay + "&secDiagnosis=" + this.state.secDiagnosis + "&patientPay=" + this.state.patientPay + "&refills=" + this.state.newRefills +
      "&refillsRemaining=" + this.state.newRefillsRemaining + "&quantity=" + this.state.quantity + "&daysSupply=" + this.state.daysSupply + "&directions=" + this.state.directions +
      "&copayApproval=" + this.state.copayApproval + "&copayNetwork=" + this.state.copayNetwork + "&homeCare=" + this.state.homeCare + '&hcHome=' + this.state.hcHome + '&hcPhone=' + this.state.hcPhone,
      data, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((data) => {
          window.location = '/refills';
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


    const {
      editing
    } = this.state

    if (this.state.conditions) {
      var conditions = this.state.conditions.split(",").join("\n")
    }

    if (this.state.allergies) {
      var allergies = this.state.allergies.split(",").join("\n")
    }

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
                      {this.state.writtenDate ?
                        <Moment style={{ lineHeight: '1.8em' }} format="MM/DD/YYYY">{this.state.writtenDate}</Moment>
                        :
                        <span></span>
                      }
                    </td>
                  </tr>
                  <tr style={{ lineHeight: '1.8em' }}>
                    <td className="field">Patient Name</td>
                    <td className="setValue">
                      <Link to={'../patients/' + this.state.patientId} activeClassName="active">
                        {this.state.patientName || ''}
                      </Link>
                    </td>
                    <td className="field">Bill On</td>
                    <td className="value">
                      {this.state.billOnDate ?
                        <Moment format="MM/DD/YYYY">{this.state.billOnDate}</Moment>
                        :
                        <span></span>
                      }
                    </td>
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
                    <td className="field">Diagnosis</td>
                    <td className="value">{this.state.diagnosis || ''}</td>
                  </tr>
                  <tr>
                    <td className="field">Email</td>
                    <td className="value">{this.state.patientEmail || ''}</td>
                    <td className="field">Secondary Diagnosis</td>
                    <td className="value">{this.state.secDiagnosis || ''}</td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td className="field">Physician</td>
                    <td className="setValue">
                      <Link to={'../physicians/' + this.state.physicianId} activeClassName="active">
                        {this.state.physicianName || ''}
                      </Link></td>
                    <td className="field">Refill #</td>
                    <td className="value">{this.state.refills || ''}</td>
                  </tr>
                  <tr>
                    <td className="field">Contact</td>
                    <td className="value">{this.state.physicianContact || ''}</td>
                    <td className="field">Refills Remaining</td>
                    <td className="value">{this.state.refillsRemaining || ''}
                    &nbsp;&nbsp;&nbsp;
                    {this.state.refillsRemaining == 0 ?
                                            <Button
                                                style={{ 'margin': '0 3%', 'min-width': '50px',
                                                padding: '10px 20px',
                                                'font-size': '.9em' }}
                                                title="RENEW"
                                                onClick={this.refillConfirm}
                                            />
                                            :
                                            <Button
                                                style={{ 'margin': '0 3%', 'min-width': '50px',
                                                padding: '10px 20px',
                                                'font-size': '.9em'}}
                                                title="REFILL"
                                                onClick={this.refillConfirm}
                                            />
                                        }</td>
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
                    <td className="field">Sales Code</td>
                    <td className='value'>{this.state.salesCode || ''}</td>
                  </tr>
                  <tr>
                    <td className="field">NDC</td>
                    <td className='value'>{this.state.productNDC || ''}</td>
                    <td className="field">Cost</td>
                    <td className='value'>{this.state.cost || ''}</td>
                  </tr>
                  <tr>
                    <td className="field">On Hand</td>
                    <td className='value'>{this.state.productQuantity || ''}</td>
                    <td className="field">Primary Insurance Pay</td>
                    <td className='value'>{this.state.primInsPay || ''}</td>
                  </tr>
                  <tr>
                    <td className="field">Prior Authorization</td>
                    <td className='value'>{this.state.priorAuth || ''}</td>
                    <td className="field">Secondary Insurance Pay</td>
                    <td className='value'>{this.state.secInsPay || ''}</td>
                  </tr>
                  <tr>
                    <td className="field">Location</td>
                    <td className='value'>{this.state.location || ''}</td>
                    <td className="field">Copay Assistance Status</td>
                    <td className='value'>{this.state.copayApproval || ''}</td>
                  </tr>
                  <tr>
                    <td className="field">Ship On</td>
                    <td className='value'>{this.state.shipOn ?
                      <Moment format="MM/DD/YYYY">{this.state.shipOn || ''}</Moment>
                      :
                      <span></span>
                    }</td>
                    <td className="field">Copay Assistance Network</td>
                    <td className='value'>{this.state.copayNetwork}</td>
                  </tr>
                  <tr>
                    <td className="field">Delivery Method</td>
                    <td className='value'>{this.state.deliveryMethod}</td>
                    <td className="field">Copay Assistance Amount</td>
                    <td className='value'>{this.state.networkPay ?
                      <span>{this.state.networkPay}</span>
                      :
                      <span></span>
                    }</td>
                  </tr>
                  <tr>
                    <td className="field">Tracking Number</td>
                    <td className='value'>{this.state.trackNum}</td>
                    <td className="field">Patient Pay</td>
                    <td className='value'>
                      <Span
                        editing={editing}
                        placeholder={this.state.patientPay}
                        value={this.state.patientPay}
                        onChange={patientPay => this.setState({ patientPay })}
                      >
                        {this.state.patientPay}
                      </Span>
                    </td>
                  </tr>
                  <tr>
                    <td className="field">ETA</td>
                    <td className='value'>{this.state.ETA ?
                      <Moment format="MM/DD/YYYY">{this.state.ETA}</Moment>
                      :
                      <span></span>
                    }</td>
                    <td className="field">Payment Option</td>
                    <td className='value'>{this.state.paymentOption}</td>
                  </tr>
                  <tr>
                    <td className="field">Status</td>
                    <td className='value'>{this.state.status || ''}</td>
                    <td className="field">Total Pay</td>
                    <td className="value">{this.state.totalPay}</td>
                  </tr>
                  <tr>
                    <td className="field">Instructions</td>
                    <td className='value'>{this.state.directions || ''}</td>
                    <td className="field">Profit</td>
                    <td className='value'>{this.state.profit}</td>
                  </tr>
                  <tr>
                    <td className="field"></td>
                    <td className='value'></td>
                    <td className="field">Margin</td>
                    <td className='value'>{this.state.margin}</td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td className="field" style={{ 'vertical-align': 'top' }}>Primary Insurance</td>
                    <td className='value'>
                      Plan: {this.state.primInsPlan}<br />
                      BIN: {this.state.primInsBIN}<br />
                      Group: {this.state.primInsGroup}<br />
                      ID: {this.state.primInsID}<br />
                      PCN: {this.state.primInsPCN}<br />
                      Type: {this.state.primInsType}</td>
                    <td className="field" style={{ 'vertical-align': 'top' }}>Secondary Insurance</td>
                    <td className="value">Plan: {this.state.secInsPlan}<br />
                      BIN: {this.state.secInsBIN}<br />
                      Group: {this.state.secInsGroup}<br />
                      ID: {this.state.secInsID}<br />
                      PCN: {this.state.secInsPCN}<br />
                      Type: {this.state.secInsType}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="scriptViewColumn2">

              <table>
                <tbody>
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
                  <tr>
                    <td>
                      <label style={{ fontSize: 14 }}>
                        Patient Warning
                    </label>
                      <div id="patientWarning">
                        <Span>
                          {this.state.patientWarning || 'None'}
                        </Span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label style={{ fontSize: 14 }}>
                        Physician Warning
                    </label>
                      <div id="physicianWarning">
                        <Span>
                          {this.state.physicianWarning || 'None'}
                        </Span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </Body>
      </div >
    )
  }
}

export default DetailsTab;
