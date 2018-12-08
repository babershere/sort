import React, { Component } from 'react';
import axios from 'axios'
import Moment from 'react-moment'

// Components
import {
  Span, Table
} from '../../../../common'


class RXHistoryTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scripts: ''
    }
  }

  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/scripts/search?patientId=' + this.props.state.patientId, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);
        this.setState({
          scripts: resp.data.response
        })
      }).catch((err) => {
        console.error(err)
      })
  }

  renderTableHead() {
    return (
      <thead>
        <tr>
          <th>
            BILL ON
                </th>
          <th>
            MEDICATION
                </th>
          <th>
            SHIP ON
                </th>
          <th>
            STATUS
                </th>
          <th>PROCESS ON</th>
          {/* <th>THERAPY END</th> */}
                  <th>REFILL #</th>
            <th>REMAINING</th>
            <th>PATIENT PAY</th>
            <th>QUANTITY</th>
            <th>RX NUMBER</th>
            <th>POUCH</th>
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
            {script.billOn}
          </Span>
        </td>

        <td>
          {script.Product.name}
        </td>

        <td>
          {script.shipOn}
        </td>

        <td>
          {script.status}
        </td>
        <td><Span icon="calendar"><Moment format='MM-DD-YYYY'>{script.processedOn}</Moment></Span></td>
        {/* <td>
        </td> */}
        <td>{script.refills}</td>
        <td>{script.refillsRemaining}</td>
        <td>{script.patientPay}</td>
        <td>{script.quantity}</td>
        <td>{script.rxNumber}</td>
        <td>{script.pouch ? 'YES' : 'NO'}</td>

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
      <div className="rxHistoryTab">
        {this.renderTable()}
        {scriptList}
      </div>
    )
  }
}

export default RXHistoryTab;
