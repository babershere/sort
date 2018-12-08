import React, { Component } from 'react';
import axios from 'axios'
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf'
import Moment from 'react-moment'

import styles from './FaxModal.css'

// Components
import {
  Button,
  Selector,
  FormModal,
  Table
} from '../../common'


class FaxModal extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }


  componentWillReceiveProps() {
    if (this.props.state.scriptValue) {
      const loginToken = window.localStorage.getItem("token");
      axios.get('/api/scripts/search?scriptId=' + this.props.state.scriptValue, { headers: { "Authorization": "Bearer " + loginToken } })
        .then((resp) => {
          let script = resp.data.response[0]
          this.setState({
            patientId: script.PatientId,
            physicianId: script.PhysicianId,
            scriptId: script.id,
            physicianName: script.Physician.firstName + " " + script.Physician.lastName,
            physicianPhone: script.Physician.phone,
            physicianFax: script.Physician.fax,
            physAddressStreet: script.Physician.addressStreet,
            physAddressCity: script.Physician.addressCity,
            physAddressState: script.Physician.addressState,
            physAddressZipCode: script.Physician.addressZipCode,
            patientName: script.Patient.firstName + " " + script.Patient.lastName,
            patientDOB: script.Patient.dob,
            patientPhone: script.Patient.phone,
            patientAddressStreet: script.Patient.addressStreet,
            patientAddressCity: script.Patient.addressCity,
            patientAddressState: script.Patient.addressState,
            patientAddressZipCode: script.Patient.addressZipCode,
          })

          axios.get('/api/scripts/search?patientId=' + this.state.patientId + '&physicianId=' + this.state.physicianId + '&status=Renew', { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
              console.log(resp);
              this.setState({
                scripts: resp.data.response
              })
            }).catch((err) => {
              console.error(err)
            })

        }).catch((err) => {
          console.error(err)
        })
    }
  }

  cancelDocument(e) {
    window.location.reload();
  }

  previewDocument(e) {
    e.preventDefault();

    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const logoData = 'data:image/png;base64,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'
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0, 0, 297);
        pdf.addImage(logoData, 'PNG', 20, 20, 20, 20);

        pdf.save("Fax_Preview.pdf");

      })
  }

  printDocument(e) {
    e.preventDefault();

    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const logoData = 'data:image/png;base64,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'
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0, 0, 297);
        pdf.addImage(logoData, 'PNG', 20, 20, 20, 20);

        var fax = pdf.output('blob');
        var data = new FormData();
        data.append("faxFile", fax)
        const loginToken = window.localStorage.getItem("token");
        axios.post('/api/faxes/upload?patientId=' + this.state.patientId + '&scriptId=' + this.state.scriptId + '&faxNumber=' + this.state.physicianFax,
          data, { headers: { "Authorization": "Bearer " + loginToken } })
          .then((res) => {
            if (res.status === 'ok') console.log("Yeah!");
            else console.log(":(");
          })
      })
      ;
  }

  renderTableHead() {
    return (
      <thead>
        <tr>
          <th>RX NUMBER</th>
          <th>MEDICATION</th>
          <th>QTY</th>
          <th>LAST FILL</th>
          <th>DIRECTIONS</th>
          <th></th>
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


  renderTableRow(script) {
    return (
      <tr value={script.id}>
        <td>{script.rxNumber}</td>
        <td>{script.Product.name}</td>
        <td>{script.quantity}</td>
        <td></td>
        <td>{script.directions}</td>
        <td><div className='check'><input type="checkbox"></input><label>AUTHORIZED</label></div><br />
          WITH __ ADDITIONAL REFILLS</td>
      </tr>
    )
  }



  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  renderTable() {
    return (
      <Table className='faxTable'>
        {this.renderTableHead()}
        {this.renderTableBody()}
      </Table>
    )
  }


  render() {

    const {
      content,
      onClickAway,
    } = this.props

    if (this.state.scripts) {
      var scriptList = this.state.scripts.map(function (item, i) {
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

      <FormModal
        onClickAway={onClickAway}
        visible={!!content}
      >

        <div>
          <div className="mb5">
            {/* <button onClick={this.printDocument}>Print</button> */}
          </div>
          <div id="divToPrint" className="mt4" style={{
            backgroundColor: '#fff',
            width: '210mm',
            minHeight: '297mm',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div className="main">
              <h1 style={{ textAlign: 'center' }}>FAX PREVIEW</h1>
              <div className='flex'>
                <div className='flex-col'>
                  <img style={{ width: '75px', height: 'auto' }} alt="SortPak" src="http://www.sortpak.com/site-uploadz/2018/05/sortpak-logo-lg.png" />
                </div>
                <div className='flex-col'>
                  <h2>REFILL AUTHORIZATION REQUEST</h2>
                  <p>Sent on <Moment format="MM/DD/YYYY" /></p>
                </div>
                <div className='flex-col'>
                  124 S. GLENDALE AVE<br />
                  GLENDALE, CA 91205<br />
                  TEL: (877) 570-7787<br />
                  FAX: (877) 475-2383
                </div>
              </div>
              <br /><br />
              <table className='infoTable'>
                <th>PATIENT NAME</th>
                <th>DATE OF BIRTH</th>
                <th>PHONE</th>
                <th>ADDRESS</th>
                <tbody>
                  <tr>
                    <td>{this.state.patientName}</td>
                    <td><Moment format="MM/DD/YYYY">{this.state.patientDOB}</Moment></td>
                    <td>{this.state.patientPhone}</td>
                    <td>{this.state.patientAddressStreet},<br />
                      {this.state.patientAddressCity}, {this.state.patientAddressState}. {this.state.patientAddressZipCode}</td>
                  </tr>
                </tbody>
              </table>
              <table className='infoTable'>
                <th>PHYSICIAN NAME</th>
                <th>PHONE</th>
                <th>FAX</th>
                <th>ADDRESS</th>
                <tbody>
                  <tr>
                    <td>{this.state.physicianName}</td>
                    <td>{this.state.physicianPhone}</td>
                    <td>{this.state.physicianFax}</td>
                    <td>{this.state.physAddressStreet},<br />
                      {this.state.physAddressCity}, {this.state.physAddressState}. {this.state.physAddressZipCode}</td>
                  </tr>
                </tbody>
              </table>

              {this.renderTable()}
              {scriptList}

              <Table className='faxTable'>
                <thead>
                  <tr>
                    <th>PLEASE CHECK ONE:</th>
                    <th>DOCTORS REMARKS:</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td><div className="check"><input type="checkbox"></input>
                      <label>ALL ABOVE SCRIPTS ARE AUTHORIZED FOR __ ADDITIONAL REFILLS</label></div></td>
                    <td>____________________</td>
                  </tr>
                  <tr>
                    <td><div className="check"><input type="checkbox"></input>
                      <label>SCRIPTS ARE INDIVIDUALLY AUTHORIZED IN THE ABOVE LIST</label></div></td>
                    <td>____________________</td>
                  </tr>
                  <tr>
                    <td><div className="check"><input type="checkbox"></input>
                      <label>NOT AUTHORIZED. PATIENT NEEDS TO CALL DOCTORS OFFICE</label></div></td>
                    <td>____________________</td>
                  </tr>
                </tbody>
              </Table>

              <div className='signatures'>
                <div>
                  <p>AUTHORIZED BY</p>
                  <p>__________________________</p>
                </div>
                <div>
                  <p>SIGNATURE</p>
                  <p>__________________________</p>
                </div>
                <div>
                  <p>DATE</p>
                  <p>_________________________</p>
                </div>
              </div>

              <div>
                <h5>CONFIDENTIALITY NOTICE</h5>
                <p>The information contained in this transmittal belongs to SortPak Pharmacy and may include information that is confidential, privileged, and protected
                  from disclosure under applicable law. It is intended only for the use of the above physicians. If you are not the intended recipient of this information,
                  you are hereby notified that any disclosure, copying, or distribution of this information is strictly prohibited. If you have received this transmittal in error,
                  please immediately notify us by telephone at (877) 570-7787. Thank you.
              </p>
              </div>

            </div>
          </div>
          <div className="actions" style={{ textAlign: 'right', margin: 20 }}>
            <Button
              cancel
              title="CANCEL"
              style={{ marginRight: 10 }}
              onCLick={this.cancelDocument.bind(this)}
            />
            <Button
              style={{ backgroundColor: 'blue', color: '#fff', marginRight: 10 }}
              title="PREVIEW"
              onClick={this.previewDocument.bind(this)}
            />
            <Button
              title="SEND FAX"
              onClick={this.printDocument.bind(this)}
            />
          </div>
        </div>

      </FormModal >
    )
  }
}

export default FaxModal;
