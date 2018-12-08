import React, { Component } from 'react';
import axios from 'axios'
import Moment from 'react-moment'

// Components
import {
  Button,
  Header,
  Span,
  Table
} from '../../../../common'

import {
  InsuranceModal
} from '../../../../shared'

class InsuranceTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPastInsurance: false,
      hidePastInsurance: false
    }
  }


  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/pastInsurance/search?patientId=' + this.props.props.match.params.patientId, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp.data)
        if (resp.data.response.length == 0) {
          this.setState({
            hidePastInsurance: true
          }) 
        }
        this.setState({
          pastInsurance: resp.data.response
        }, () => console.log(this.state.pastInsurance))
      }).catch((err) => {
          console.error(err)
        })
      }

  openNoteModal() {
    this.props.setState({ insuranceModal: {} })
  }

  showPastInsurance() {
    this.setState({
      showPastInsurance: true
    })
  }

  renderTableHead() {
    return (
      <thead>
        <tr>
          <th>Plan</th>
          <th>BIN</th>
          <th>Group</th>
          <th>ID</th>
          <th>PCN</th>
          <th>Type</th>
          <th>Date Replaced</th>
        </tr>
      </thead>
    )
  }

  renderTableBody() {
    return (
      <tbody>
        {this.state.pastInsurance.map(this.renderTableRow.bind(this))}
      </tbody>
    )
  }


  renderTableRow(pastInsurance) {
    return (
      <tr value={pastInsurance.id}>
        <td>{pastInsurance.plan}</td>
        <td>{pastInsurance.BIN}</td>
        <td>{pastInsurance.group}</td>
        <td>{pastInsurance.insID}</td>
        <td>{pastInsurance.PCN}</td>
        <td>{pastInsurance.type}</td>
        <td>
          <Span icon="calendar">
            <Moment format="MM/DD/YYYY">{pastInsurance.createdAt}</Moment>
          </Span></td>
      </tr>
    )
  }

  renderTable() {
    return (
      <Table>
        {this.renderTableHead()}
        {this.renderTableBody()}
      </Table>
    )
  }

  render() {

    if (this.state.pastInsurance) {
      var pastInsuranceList = this.state.pastInsurance.map(function (item, i) {
        return (
          <div key={i}>
          </div>
        )
      })
    }
    else {
      return <div>
        <p></p>
      </div>
    }

    const {
      state,
      className,
      onCloseModal,
      onCreateNote,
    } = this.props

    const {
      insuranceModal
    } = state
    console.log(this.state.hidePastInsurance);

    return (
      <div>
        <Header style={{ 'display': 'initial' }}>
          <h2 style={{ 'display': 'inline' }}>Insurance Information</h2>
          <Button
            icon="plus"
            title="ADD NEW INSURANCE"
            onClick={() => this.openNoteModal()}
            style={{ marginLeft: 20}}
          />
          <Button
            search
            icon="edit"
            title="EDIT INSURANCE"
            link={`/patients/${this.props.props.match.params.patientId}/edit`}
            style={{ backgroundColor: "#ff7d38", color: '#fff', marginLeft: 10, height: 'initial' }}
          />
        </Header>
        <div className='insuranceTab'>

          <table>
            <h2>Primary Insurance</h2><br /><br />
            <tr><td><Span
              label='Plan'
            >{this.props.state.primInsPlan}</Span></td></tr>
            <tr><td><Span label='BIN'>{this.props.state.primInsBIN}</Span></td></tr>
            <tr><td><Span label='Group'>{this.props.state.primInsGroup}</Span></td></tr>
            <tr><td><Span label='ID'>{this.props.state.primInsID}</Span></td></tr>
            <tr><td><Span label='PCN'>{this.props.state.primInsPCN}</Span></td></tr>
            <tr><td><Span label='Type'>{this.props.state.primInsType}</Span></td></tr>
          </table>
          <table>
            <h2>Secondary Insurance</h2><br /><br />
            <tr><td><Span
              label='Plan'
            >{this.props.state.secInsPlan}</Span></td></tr>
            <tr><td><Span label='BIN'>{this.props.state.secInsBIN}</Span></td></tr>
            <tr><td><Span label='Group'>{this.props.state.secInsGroup}</Span></td></tr>
            <tr><td><Span label='ID'>{this.props.state.secInsID}</Span></td></tr>
            <tr><td><Span label='PCN'>{this.props.state.secInsPCN}</Span></td></tr>
            <tr><td><Span label='Type'>{this.props.state.secInsType}</Span></td></tr>
          </table>

        </div>
{this.state.hidePastInsurance ?
<div></div>
:
<div>
{this.state.showPastInsurance ?
        <div>
        <h2>▼ Past Insurance</h2>
        {this.renderTable()}
          {pastInsuranceList}
          </div>
          :
          <div>
        <h2 style={{'cursor': 'pointer'}} onClick={this.showPastInsurance.bind(this)}>► Past Insurance</h2>  
        </div>
        
        }</div>}

        <InsuranceModal
          content={insuranceModal}
          onClickAway={onCloseModal}
          onSubmit={onCreateNote}
          state={this.state}
          props={this.props}
        />
      </div>
    )
  }
}

export default InsuranceTab;
