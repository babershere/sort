import React, { Component } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode'

import { Header, Body, Button, Table, Input, Selector } from '../../../common'
import styles from '../ScriptView/ScriptView.css'


// Components
import {
  SwitchTable
} from '../../../shared'

import DetailsTab from './Tabs/DetailsTab'
import NotesTab from '../ScriptView/Tabs/NotesTab'
import AttachmentsTab from '../ScriptView/Tabs/AttachmentsTab'
import RXHistoryTab from '../ScriptView/Tabs/RXHistoryTab'



class ScriptView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      notesNum: ''
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
    ]

    this.state = {
      tab: this.tabOptions[0],
      ...this.initialState
    }

    this.handleClick = this.handleClick.bind(this);

  }

  state = {
    script: '',
    reversal: '',
    transfer: '',
    shipping: '',
    cancelPharmTrans: ''
  }


  componentWillMount() {
    const token = localStorage.getItem('token')
    var decoded = jwt_decode(token);
    this.setState({
      userId: decoded.id
    }, this.getUser)

    if (this.props.match.params.scriptId) {
      const loginToken = window.localStorage.getItem("token");
      axios.get('/api/scripts/search?scriptId=' + this.props.match.params.scriptId, { headers: { "Authorization": "Bearer " + loginToken } })
        .then((resp) => {
          console.log(resp);
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
            patientPay: script.patientPay,
            directions: script.directions,
            patientId: script.PatientId,
            notesNum: script.scriptNotes.length,
            attachmentsNum: script.scriptAttachments.length,
            PatientId: script.PatientId
          }, this.getRxHistoryNum)


          this.setState({
            cancelPharmTrans: true
          })

        }).catch((err) => {
          console.error(err)
        })

    }
  }

  getUser() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/user/search?userId=' + this.state.userId, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);
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
        console.log(resp);
        this.setState({
          statusesNum: resp.data.response.length
        })
      }).catch((err) => {
        console.error(err)
      })
  }

  closeModal() {
    this.setState({
      noteModal: null,
      attachmentModal: null
    })
  }

  handleClick(event) {
    this.setState({
      status: event.target.id
    },
      this.updateStatus
    )
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
      }
    ]


    const { tab } = this.state
    return (
      <div style={{ marginTop: 25 }}>
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




  render() {
    return (
      <div>
        <Header className={styles.header} id="scriptViewHead">
          <Table>
            <tbody>
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

                </td>
              </tr>
            </tbody>
          </Table>

        </Header>

        <Body className={styles.body} id="scriptViewBody">

          {this.renderSwitchTable()}

        </Body>
      </div>

    );
  }
}

export default ScriptView;
