import React, { Component } from 'react';
import axios from 'axios'
import Moment from 'react-moment'

import { Span, Table, TextArea } from '../../../../common'

class PrescriptionsTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      test: ''
    }
  }

  componentDidMount() {
    const patientNum = this.props.pID.match.params.patientId;
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/patients/search?patientId=' + patientNum, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);
        this.setState({
          patientId: resp.data.response[0].id,
          conditions: resp.data.response[0].conditions,
          allergies: resp.data.response[0].allergies,
          patientWarning: resp.data.response[0].patientWarning,
        })

        console.log(this.state.patientId);
        axios.get('/api/scripts/search?patientId=' + this.state.patientId, { headers: { "Authorization": "Bearer " + loginToken } })
          .then((resp) => {
            console.log(resp);
            this.setState({
              scripts: resp.data.response
            })
          })
      }).catch((error) => {
        console.error(error);

      }).catch((error) => {
        console.error(error);
      })
  }

  renderTableHead() {
    return (
      <thead>
        <tr>
          <th>
            PROCESS ON
                </th>
          <th>
            PHYSICIAN
                </th>
          <th>
            MEDICATION
                </th>
          <th>
            STATUS
                </th>
        </tr>
      </thead>
    )
  }

  renderTableBody() {

    return (
      <tbody>
        {this.state.scripts.map(this.renderTableRow.bind(this))}
      </tbody>
    )
  }

  handleClick(value) {
    window.location = `/scripts/${value}`
  }

  renderTableRow(script) {
    return (
      <tr value={script.id} onClick={() => this.handleClick(script.id)}>
        <td>
          <Span icon="calendar">
          <Moment format='MM/DD/YYYY'>{script.processedOn}</Moment>
          </Span>
        </td>

        <td>
          {script.Physician.firstName} {script.Physician.lastName}
        </td>

        <td>
          {script.Product.name}
        </td>

        <td>
          {script.status}
        </td>

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

    if (this.state.scripts) {

      var scriptList = this.state.scripts.sort(function(a,b) { 
        return new Date(b.processedOn).getTime() - new Date(a.processedOn).getTime() 
    });

      var scriptList = this.state.scripts.map(function (item, i) {
        console.log(item);
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

    return (
      <div className='flex-row'>
        <div className='col'>
          {this.renderTable()}
          {scriptList}
        </div>

        <div className='col'>
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
                      placeholder={this.state.conditions}
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
                      placeholder={this.state.allergies}
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
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}



export default PrescriptionsTab;
