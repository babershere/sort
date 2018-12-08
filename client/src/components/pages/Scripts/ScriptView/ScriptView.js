import React, { Component } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from '../../../shared/CheckoutForm/CheckoutForm';
import moment from 'moment';

import { Header, Body, Button, Table, Input, Selector } from '../../../common'
import styles from './ScriptView.css'


// Components
import {
  SwitchTable
} from '../../../shared'

import DetailsTab from './Tabs/DetailsTab'
import NotesTab from './Tabs/NotesTab'
import AttachmentsTab from './Tabs/AttachmentsTab'
import RXHistoryTab from './Tabs/RXHistoryTab'
import FaxesTab from './Tabs/FaxesTab'
import StatusesTab from './Tabs/StatusesTab'
import PaymentsTab from './Tabs/PaymentsTab'


class ScriptView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      notesNum: '',
      chargeModal: ''
    }
    this.tabOptions = [
      {
        value: 'details',
        display: 'Details',
        renderComponent: () => this.renderDetailsTab(),
      },
      {
        value: 'notes',
        display: 'Notes',
        renderComponent: () => this.renderNotesTab()
      },
      {
        value: 'attachments',
        display: 'Attachments',
        renderComponent: () => this.renderAttachmentsTab()
      },
      {
        value: 'rxHistory',
        display: 'RX History',
        renderComponent: () => this.renderRXHistoryTab()
      },
      {
        value: 'faxes',
        display: 'Faxes',
        renderComponent: () => this.renderFaxesTab()
      },
      {
        value: 'statuses',
        display: 'Statuses',
        renderComponent: () => this.renderStatusesTab()
      },
      {
        value: 'payments',
        display: 'Payments',
        renderComponent: () => this.renderPaymentsTab()
      }
    ]

    this.state = {
      tab: this.tabOptions[0],
      ...this.initialState
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleCopayApproval = this.handleCopayApproval.bind(this);
    this.reversalPane = this.reversalPane.bind(this);
    this.transferPane = this.transferPane.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.handlePriorAuth = this.handlePriorAuth.bind(this);
    this.handleShipping = this.handleShipping.bind(this);
    this.generateRefillScript = this.generateRefillScript.bind(this);
  }

  state = {
    script: '',
    reversal: '',
    transfer: '',
    shipping: '',
    refresh: false
  }

  openNoteModal() {
    this.setState({ chargeModal: {} })
  }


  componentWillMount() {
    const token = localStorage.getItem('token')
    var decoded = jwt_decode(token);
    console.log(decoded);
    this.setState({
      userId: decoded.id
    }, this.getUser)

    if (this.props.match.params.scriptId) {
      const loginToken = window.localStorage.getItem("token");
      axios.get('/api/scripts/search?scriptId=' + this.props.match.params.scriptId, { headers: { "Authorization": "Bearer " + loginToken } })
        .then((resp) => {
          let script = resp.data.response[0];
          this.setState({
            id: script.id,
            processedOn: script.processedOn,
            pouch: script.pouch,
            status: script.status,
            fromStatus: script.status,
            writtenDate: script.writtenDate,
            patient: script.patient,
            billOnDate: script.billOnDate,
            rxNumber: script.rxNumber,
            diagnosis: script.diagnosis,
            secDiagnosis: script.secDiagnosis,
            priorAuth: script.priorAuth,
            refills: script.refills,
            refillsRemaining: script.refillsRemaining,
            quantity: script.quantity,
            daysSupply: script.daysSupply,
            salesCode: script.salesCode,
            cost: script.cost,
            primInsPay: script.primInsPay,
            secInsPay: script.secInsPay,
            location: script.location,
            homeCare: script.homeCare,
            copayApproval: script.copayApproval,
            copayNetwork: script.copayNetwork,
            networkPay: script.networkPay,
            patientPay: script.patientPay,
            paymentOption: script.paymentOption,
            directions: script.directions,
            cancelReason: script.cancelReason,
            transLocation: script.transLocation,
            transNPI: script.transNPI,
            transDate: script.transDate,
            patientId: script.PatientId,
            notesNum: script.scriptNotes.length,
            attachmentsNum: script.scriptAttachments.length,
            PatientId: script.PatientId,
            physicianId: script.PhysicianId,
            productId: script.ProductId

          }, this.getRxHistoryNum)



        }).catch((err) => {
          console.error(err)
        })

    }
  }

  cancelScript() {
    if (window.confirm('Cancel Script?' + "\n" + '(You may specify a reason for cancelling after)')) {
      this.setState({
        status: 'Cancelled'
      }, this.updateStatus)
    }
  }

  getUser() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/user/search?userId=' + this.state.userId, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          name: resp.data.response[0].name,
          link: resp.data.response[0].link
        })
      }).catch((err) => {
        console.error(err)
      })
  }

  getRxHistoryNum() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/scripts/search?patientId=' + this.state.PatientId, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);
        this.setState({
          rxHistoryNum: resp.data.response.length
        }, this.getStatusesNum)
      }).catch((err) => {
        console.error(err)
      })
  }

  getStatusesNum() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/scripts/statuses/search?ScriptId=' + this.state.id, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          statusesNum: resp.data.response.length
        }, this.checkScriptTransfer)
      }).catch((err) => {
        console.error(err)
      })
  }

  checkScriptTransfer() {
    if (this.state.cancelReason === "Pharmacy Transfer") {
      this.setState({
        scriptTransfer: true
      })
    } else {
      this.setState({
        scriptTransfer: false
      })
    }
  }


  closeModal() {
    this.setState({
      attachmentModal: null,
      noteModal: null,
      chargeModal: null
    })
  }


  updateStatus() {
    const loginToken = window.localStorage.getItem("token");
    if (this.state.status === "Shipped") this.refillConfirm();
    let data = new FormData();
    let updateParams = '?id=' + this.props.match.params.scriptId + '&status=' + this.state.status + '&pouch=' + this.state.pouch + '&location=' + this.state.location + '&homeCare=' + this.state.homeCare;
    if (this.state.reversal) updateParams += '&processedOn=' + this.state.processedOn;
    if (this.state.transfer) updateParams += '&transLocation=' + this.state.transLocation + '&transNPI=' + this.state.transNPI + '&transDate=' + this.state.transDate;
    if (this.state.priorAuth) updateParams += '&priorAuth=' + this.state.priorAuth;
    if (this.state.copayApproval) updateParams += '&patientPay=' + this.state.patientPay + '&copayApproval=' + this.state.copayApproval + '&copayNetwork=' + this.state.copayNetwork + '&networkPay=' + this.state.networkPay;
    if (this.state.shipping) updateParams += '&shipOn=' + this.state.shipOn + '&deliveryMethod=' + this.state.deliveryMethod + '&trackNum=' + this.state.trackNum + '&ETA=' + this.state.ETA + '&paymentOption=' + this.state.paymentOption;
    if (this.state.cancelReason) updateParams += '&cancelReason=' + this.state.cancelReason
    axios.put('/api/scripts/update' + updateParams, data, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((data) => {
      }).catch((error) => {
        console.error(error);
      })
    this.statusChange();
    this.setState({
      fromStatus: this.state.status,
      refresh: !this.state.refresh
    })
  }

  statusChange() {
    const loginToken = window.localStorage.getItem("token");
    let data = new FormData();
    axios.post('/api/scripts/statuses/add?scriptId=' + this.props.match.params.scriptId + '&userId=' + this.state.userId + '&userImage=' + this.state.link + '&name=' + this.state.name + '&fromStatus=' + this.state.fromStatus + '&toStatus=' + this.state.status,
      data, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((data) => {
        console.log(data);
      }).catch((error) => {
        console.error(error);
      })
  }

  handleClick(event) {
    this.setState({
      status: event.target.id
    }, this.updateStatus)
  }

  handlePriorAuth(event) {
    if (event.target.id === 'Approved') {
      this.setState({
        priorAuth: event.target.id,
        status: 'Process'
      }, this.updateStatus)
    } else {
      this.setState({
        priorAuth: event.target.id,
        status: 'Review'
      }, this.updateStatus)
    }
  }

  handleCopayApproval(event) {
    this.setState({
      status: event.target.id
    })
    if (event.target.id === "Schedule") {
      this.setState({
        copayApproval: 'Approved'
      }, this.updateStatus)
    } else {
      this.setState({
        copayApproval: 'Approved'
      }, this.updateStatus)
    }
  }

  transferScript(event) {
    this.setState({
      status: event.target.id
    }, this.updateStatus)
    this.setState({
      scriptTransfer: true
    }, this.updateStatus)
  }

  reversalPane(event) {
    this.setState({
      reversal: true
    })
    this.forceUpdate();
  }

  transferPane(event) {
    this.setState({
      transfer: true
    })
    this.forceUpdate();
  }

  handleShipping(event) {
    this.setState({
      status: event.target.id
    }, this.updateStatus)
    this.setState({
      shipping: true
    }, this.updateStatus)
  }

  addScript() {
    console.log(this.state);
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

  refillConfirm() {
    if (window.confirm('Generate refill?')) {
      this.generateRefillScript();
    } else {
      return;
    }
  }

  renderActions() {

    const copayNetworkOptions = [
      '--',
      'Cancer Care Foundation',
      'Chronic Disease Fund',
      'Health Well',
      'LLS',
      'Patient Access Network',
      'Patient Advocate',
      'Patient Service Inc',
      'Safety Net Foundation',
      'Good Days',
      'Coupon',
      'Voucher',
      'Copay Card',
      'Other'
    ]

    const deliveryOptions = [
      '--',
      'UPS',
      'Fedex',
      'GSO',
      'Deliver-it',
      'US Postal',
      'Delivery Driver'
    ]

    const paymentOptions = [
      '--',
      'Collect on Delivery',
      'Mail in Check',
      'Credit Card',
      'No Copay'
    ]

    const cancelOptions = [
      '--',
      'Change in Therapy',
      'Therapy Completion',
      'Change in Doctor',
      'Adverse Reaction',
      'Patient Deceased',
      'Duplicate Script',
      'Unaffordable',
      'Pharmacy Transfer',
      'Doctor Decision',
      'Transfer to Hub',
      'Patient Decision',
      'Patient Hospitalized',
      'Dose Change',
      'Manufacturer Free Drug Program',
      'Payor Restriction',
      'Unable to Reach Patient',
      'Unable to Reach Physician',
      'Other'
    ]

    if (this.state.status === "Received") {
      return (
        <div className="actions">
          <h3>Actions</h3>
          <Button
            title="READY TO PROCESS"
            id="Process"
            onClick={this.handleClick}
          />
          <Button
            title="FLAG FOR REVIEW"
            id="Review"
            onClick={this.handleClick}
            className="orange"
            style={{ marginLeft: 10 }}
          />
        </div>
      )
    } else if (this.state.status === "Review") {
      return (
        <div className="actions">
          <p>Review this script. Then specify what to do next.</p>
          <Button
            title="READY TO SCHEDULE"
            id="Schedule"
            onClick={this.handleClick}
          />
          <Button
            title="NEEDS PRIOR AUTHORIZATION"
            id="Prior Auth"
            className="orange"
            onClick={this.handleClick}
            style={{ marginLeft: 10 }}
          />
          <Button
            title="NEEDS CO-PAY ASSISTANCE"
            id="Copay Assistance"
            className="orange"
            onClick={this.handleClick}
            style={{ marginLeft: 10 }}
          />
          <Button
            title="READY TO PROCESS"
            id="Process"
            className="orange"
            onClick={this.handleClick}
            style={{ marginLeft: 10 }}
          />
          <Button
            title="FLAG FOR REVERSAL"
            className="red"
            onClick={this.reversalPane}
            style={{ 'background-color': '#d2000d', marginLeft: 10 }}
          />
          <Button
            title="TRANSFER"
            onClick={this.transferPane}
            style={{ 'background-color': '#000', marginLeft: 10 }}
          />
          {this.state.reversal ?
            <table>
              <tbody>
                <tr>
                  <td></td>
                  <td>
                    <p>Reverse the script and specify when it should be processed.</p>
                  </td>
                </tr>
                <tr>
                  <td>Process On</td>
                  <td>
                    <Input
                      type="date"
                      placeholder="--/--/----"
                      value={this.state.processedOn}
                      onChange={processedOn => this.setState({ processedOn })}
                    />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <Button
                      title="REVERSE SCRIPT"
                      id="Process"
                      onClick={this.handleClick}
                      style={{ 'background-color': '#000' }}
                    />
                    <Button
                      title="CANCEL SCRIPT"
                      id="Cancelled"
                      onClick={this.cancelScript.bind(this)}
                      style={{ 'background-color': '#000', marginLeft: 10 }}
                    />
                  </td>
                </tr>
              </tbody>
            </table> : <div></div>
          }
          {this.state.transfer ?
            <table>
              <tbody>
                <tr>
                  <td>Location</td>
                  <td>
                    <Input
                      placeholder="Enter location here..."
                      value={this.state.transLocation}
                      onChange={transLocation => this.setState({ transLocation })}
                    />
                  </td>
                </tr>
                <tr>
                  <td>NPI</td>
                  <td>
                    <Input
                      value={this.state.transNPI}
                      onChange={transNPI => this.setState({ transNPI })} />
                  </td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>
                    <Input
                      type="Date"
                      value={this.state.transDate}
                      onChange={transDate => this.setState({ transDate })}
                    />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <Button
                      title="TRANSFER"
                      id="Cancelled"
                      onClick={this.handleClick}
                    />
                  </td>
                </tr>
              </tbody>
            </table> : <div></div>}
        </div>
      )
    } else if (this.state.status === "Prior Auth") {
      return (
        <div className="actions">
          <p>Please process the prior authorization and record the result.</p>
          <Button
            title="APPROVED"
            id="Approved"
            onClick={this.handlePriorAuth}
          />
          <Button
            title="DENIED"
            id="Denied"
            onClick={this.handlePriorAuth}
            style={{ 'background-color': '#000', marginLeft: 10 }}
          />
          <Button
            title="PAYOR RESTRICTION"
            id="Payor Restriction"
            onClick={this.handlePriorAuth}
            className="orange"
            style={{ marginLeft: 10 }}
          />
          <Button
            title="LIMITED DISTRIBUTION"
            id="Limited Distribution"
            onClick={this.handlePriorAuth}
            className="orange"
            style={{ marginLeft: 10 }}
          />
          <Button
            title="FLAG FOR REVIEW"
            id="Review"
            onClick={this.handleClick}
            style={{ 'background-color': '#d2000d', marginLeft: 10 }}
          />
        </div>
      )
    } else if (this.state.status === "Process") {
      return (
        <div className="actions">
          <p>Please process the script then specify what to do next.</p>
          <Button
            title="READY TO SCHEDULE"
            id="Schedule"
            onClick={this.handleClick}
          />
          <Button
            title="NEEDS PRIOR AUTHORIZATION"
            id="Prior Auth"
            onClick={this.handleClick}
            className="orange"
            style={{ marginLeft: 10 }}
          />
          <Button
            title="NEEDS COPAY ASSISTANCE"
            id="Copay Assistance"
            onClick={this.handleClick}
            className="orange"
            style={{ marginLeft: 10 }}
          />
          <Button
            title="FLAG FOR REVIEW"
            id="Review"
            onClick={this.handleClick}
            style={{ 'background-color': '#d2000d', marginLeft: 10 }}
          />
        </div>
      )
    } else if (this.state.status === "Copay Assistance") {
      return (
        <div className="actions">
          <p>Process the copay assistance and update the fields below.</p>
          <table>
            <tbody>
              <tr>
                <td className="field">Copay Network</td>
                <td>
                  <Selector
                    options={copayNetworkOptions}
                    value={this.state.copayNetwork}
                    onSelect={copayNetwork => this.setState({ copayNetwork })}
                  />
                </td>
              </tr>
              <tr>
                <td className="field">Network Pay</td>
                <td>
                  <Input
                    value={this.state.networkPay}
                    onChange={networkPay => this.setState({ networkPay })}
                  />
                </td>
              </tr>
              <tr>
                <td className="field">Patient Pay</td>
                <td>
                  <Input
                    value={this.state.patientPay}
                    onChange={patientPay => this.setState({ patientPay })}
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <Button
                    title="APPROVED"
                    id="Schedule"
                    onClick={this.handleCopayApproval}
                  />
                  <Button
                    title="DENIED"
                    id="Process"
                    onClick={this.handleCopayApproval}
                    style={{ 'background-color': '#000', marginLeft: 10 }}
                  />
                  <Button
                    title="FLAG FOR REVIEW"
                    id="Review"
                    onClick={this.handleClick}
                    style={{ 'background-color': '#d2000d', marginLeft: 10 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

        </div>

      )
    } else if (this.state.status === "Schedule") {
      return (
        <div className="actions">
          <p>Call the patient and schedule delivery.</p>
          <table>
            <tbody>
              <tr>
                <td className='field'>
                  Ship on
                    </td>
                <td>
                  <Input
                    type="date"
                    value={this.state.shipOn}
                    onChange={shipOn => this.setState({ shipOn })}
                  />
                </td>
              </tr>
              <tr>
                <td className='field'>
                  Delivery Method
                    </td>
                <td>
                  <Selector
                    options={deliveryOptions}
                    value={this.state.deliveryMethod}
                    onSelect={deliveryMethod => this.setState({ deliveryMethod })}
                  />
                </td>
              </tr>
              <tr>
                <td className="field">
                  Tracking Number
                    </td>
                <td>
                  <Input
                    value={this.state.trackNum}
                    onChange={trackNum => this.setState({ trackNum })}
                  />
                </td>
              </tr>
              <tr>
                <td className="field">
                  ETA
                    </td>
                <td>
                  <Input
                    type="date"
                    value={this.state.ETA}
                    onChange={ETA => this.setState({ ETA })}
                  />
                </td>
              </tr>
              <tr>
                <td className="field">
                  Payment Option
                    </td>
                <td>
                  <Selector
                    options={paymentOptions}
                    value={this.state.paymentOption}
                    onSelect={paymentOption => this.setState({ paymentOption })}
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <Button
                    title="SCHEDULE"
                    id="QA"
                    onClick={this.handleShipping}
                    style={{ 'background-color': '#000' }}
                  />
                  <Button
                    title="FLAG FOR REVIEW"
                    id="Review"
                    onClick={this.handleShipping}
                    style={{ 'background-color': '#d2000d', marginLeft: 10 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    } else if (this.state.status === "QA") {
      return (
        <div className="actions">
          <p className="large">Verify the script and approve it to be filled.</p>
          <Button
            title="APPROVED"
            id="Fill"
            onClick={this.handleClick}
            style={{ 'min-width': '175px' }}
          />
          <Button
            title="FLAG FOR REVIEW"
            id="Review"
            onClick={this.handleClick}
            style={{ 'background-color': '#d2000d', marginLeft: 10 }}
          />
        </div>
      )
    } else if (this.state.status === "Fill") {
      return (
        <div className="actions">
          <p className="large">Verify the script and fill it.</p>
          <Button
            title="FILLED"
            id="Shipped"
            onClick={this.handleClick}
            style={{ 'min-width': '175px' }}
          />
          <Button
            title="FLAG FOR REVIEW"
            id="Review"
            onClick={this.handleClick}
            style={{ 'background-color': '#d2000d', marginLeft: 10 }}
          />
        </div>
      )
    } else if (this.state.status === "Shipped") {
      return (
        <div className="actions">
          <p className="large">Sign</p>
          <Button
            title="SIGNED"
            id="Done"
            onClick={this.handleClick}
            style={{ 'min-width': '175px' }}
          />
        </div>
      )
    } else if (this.state.status === "Done") {
      return (
        <div className="actions"></div>
      )
    } else if (this.state.status === "Cancelled") {
      return (
        <div className="actions" style={{ marginTop: 40 }}>
          <Selector
            style={{ 'min-width': '200px' }}
            label="Reason for Cancelling"
            options={cancelOptions}
            selected={this.state.cancelReason}
            value={this.state.cancelReason}
            onSelect={cancelReason => this.setState({ cancelReason }, this.updateStatus)}
          />
          {this.state.scriptTransfer ?
            <table>
              <tbody>
                <tr>
                  <td>Location</td>
                  <td>{this.state.transLocation}</td>
                </tr>
                <tr>
                  <td>NPI</td>
                  <td>{this.state.transNPI}</td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>{this.state.transDate}</td>
                </tr>
              </tbody>
            </table> :
            <div>
            </div>}
        </div>
      )
    } else if (this.state.status === "Refill") {
      return (
        <div className="actions">
          <p className="large">Refill</p>
          <Button
            title="RECEIVE"
            id="Received"
            onClick={this.handleClick}
          />
          <Button
            title="FLAG FOR REVIEW"
            id="Review"
            onClick={this.handleClick}
            style={{ 'background-color': '#d2000d', marginLeft: 10 }}
          />
        </div>
      )
    }
    else if (this.state.status === "Renew") {
      return (
        <div className="actions">
          <p className="large">Renew</p>
          <Button
            title="RECEIVE"
            id="Received"
            onClick={this.handleClick}
          />
          <Button
            title="FLAG FOR REVIEW"
            id="Review"
            onClick={this.handleClick}
            style={{ 'background-color': '#d2000d', marginLeft: 10 }}
          />
        </div>
      )
    }
  }

  renderSwitchTable() {

    const notesTab = <div>Notes {this.state.notesNum > 0
      ? <span className='numberCircle'>{this.state.notesNum}</span>
      : <span></span>}</div>

    const attachmentsTab = <div>Attachments {this.state.attachmentsNum > 0
      ? <span className='numberCircle'>{this.state.attachmentsNum}</span>
      : <span></span>}</div>

    const rxHistoryTab = <div>RX History {this.state.rxHistoryNum > 0
      ? <span className='numberCircle'>{this.state.rxHistoryNum}</span>
      : <span></span>}</div>

    const statusesTab = <div>Statuses {this.state.statusesNum > 0
      ? <span className='numberCircle'>{this.state.statusesNum}</span>
      : <span></span>}</div>


    this.tabOptions = [
      {
        value: 'details',
        display: 'Details',
        renderComponent: () => this.renderDetailsTab(),
      },
      {
        value: 'notes',
        display: notesTab,
        renderComponent: () => this.renderNotesTab()
      },
      {
        value: 'attachments',
        display: attachmentsTab,
        renderComponent: () => this.renderAttachmentsTab()
      },
      {
        value: 'rxHistory',
        display: rxHistoryTab,
        renderComponent: () => this.renderRXHistoryTab()
      },
      {
        value: 'faxes',
        display: 'Faxes',
        renderComponent: () => this.renderFaxesTab()
      },
      {
        value: 'statuses',
        display: statusesTab,
        renderComponent: () => this.renderStatusesTab()
      },
      {
        value: 'payments',
        display: 'Payments',
        renderComponent: () => this.renderPaymentsTab()
      }
    ]


    const { tab } = this.state
    return (
      <div>
        <div className='pouch'>

          <input type="checkbox" checked={this.state.pouch}>
          </input>
          <label style={{ verticalAlign: 'text-top' }}>POUCH</label>
        </div>

        <SwitchTable
          tabs={this.tabOptions}
          selected={tab}
          onClick={tab => this.setState({ tab })}
        />
      </div>

    )
  }

  renderDetailsTab() {
    return (
      <DetailsTab
        className={styles.detailsTab}
        sID={this.props}
        refresh={this.state.refresh}
      />
    )
  }

  renderNotesTab() {
    return (
      <NotesTab
        className={styles.notesTab}
        state={this.state}
        patient={this.props.patient}
        setState={this.setState.bind(this)}
        onCloseModal={() => this.closeModal()}
      />
    )
  }

  renderAttachmentsTab() {
    return (
      <AttachmentsTab
        className={styles.attachmentsTab}
        state={this.state}
        patient={this.props.patient}
        setState={this.setState.bind(this)}
        onCloseModal={() => this.closeModal()}
      />
    )
  }

  renderRXHistoryTab() {
    return (
      <RXHistoryTab
        className={styles.rxHistoryTab}
        state={this.state}
        patient={this.props.patients}
        setState={this.setState.bind(this)}
      />
    )
  }

  renderFaxesTab() {
    return (
      <FaxesTab />
    )
  }

  renderStatusesTab() {
    return (
      <StatusesTab
        className={styles.notesTab}
        state={this.state}
        patient={this.props.patient}
        setState={this.setState.bind(this)} />
    )
  }

  renderPaymentsTab() {
    return (
      <PaymentsTab />
    )
  }



  render() {

    const {
      state,
      className,
      onCloseModal,
      onCreateNote,
    } = this.props


    const {
      chargeModal
    } = this.state
    console.log(this.props, this.state);

    return (
      <div>
        <Header className={styles.header} id="scriptViewHead">
          <Table>
            <tr>
              <td>
                <Button className={(this.state.status === "Received") ? 'currentStatus' : 'inactiveStatus'}>
                  Received
                </Button>
                <Button className={(this.state.status === "Review") ? 'currentStatus' : 'inactiveStatus'}>
                  Review
                </Button>
                <Button className={(this.state.status === "Prior Auth") ? 'currentStatus' : 'inactiveStatus'}>
                  Prior Auth
                </Button>
                <Button className={(this.state.status === "Process") ? 'currentStatus' : 'inactiveStatus'}>
                  Process
                </Button>
                <Button className={(this.state.status === "Copay Assistance") ? 'currentStatus' : 'inactiveStatus'}>
                  Copay Assistance
                </Button>
                <Button className={(this.state.status === "Schedule") ? 'currentStatus' : 'inactiveStatus'}>
                  Schedule
                </Button>
                <Button className={(this.state.status === "QA") ? 'currentStatus' : 'inactiveStatus'}>
                  QA
                </Button>
                <Button className={(this.state.status === "Fill") ? 'currentStatus' : 'inactiveStatus'}>
                  Fill
                </Button>
                <Button className={(this.state.status === "Shipped") ? 'currentStatus' : 'inactiveStatus'}>
                  Shipped
                </Button>
                <Button className={(this.state.status === "Done") ? 'currentStatus' : 'inactiveStatus'}>
                  Done
                </Button>
                <Button className={(this.state.status === "Cancelled") ? 'currentStatus' : 'inactiveStatus'}>
                  Cancelled
                </Button>
                <Button className={(this.state.status === "Refill") ? 'currentStatus' : 'inactiveStatus'}>
                  Refill
                </Button>
              </td>
            </tr>
            <tr>
              <td><h2>Status: {this.state.status}</h2>
                <Button
                  search
                  icon="edit"
                  title="EDIT SCRIPT"
                  link={`/scripts/${this.props.match.params.scriptId}/edit`}
                  style={{ marginLeft: 20 }}
                />
                <Button
                  id="white"
                  title="CHARGE CREDIT CARD"
                  style={{ marginLeft: 50 }}
                  onClick={() => this.openNoteModal()}
                />

                <Button
                  id="white"
                  title="RECEIPT"
                  style={{ marginLeft: 20 }}
                />
                <Button
                  id="white"
                  title="CANCEL"
                  onClick={this.cancelScript.bind(this)}
                  style={{ marginLeft: 20 }}
                />
              </td>
            </tr>
          </Table>

        </Header>

        <Body className={styles.body} id="scriptViewBody">

          {this.renderActions()}
          {this.renderSwitchTable()}

          <StripeProvider apiKey="pk_test_WdiSIq25nzdEU8SdUQOTSFHz">

            <Elements>
              <CheckoutForm
                content={chargeModal}
                onClickAway={onCloseModal}
                onSubmit={onCreateNote}
                state={this.state}
                props={this.props}
                onCloseModal={() => this.closeModal()}
              />
            </Elements>

          </StripeProvider>

        </Body>
      </div>

    );
  }
}

export default ScriptView;
