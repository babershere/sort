import React, { Component } from 'react';
import axios from 'axios'

import { Span, Table } from '../../../../common'

class ScriptsTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            test: ''
        }
    }

    componentDidMount() {
        const physicianNum = this.props.pID.match.params.physicianId;
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/physicians/search?physicianId=' + physicianNum, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                console.log(resp);
                // let patient = resp.data.response[0];
                this.setState({
                    physicianId: resp.data.response[0].id,
                    scripts: resp.data.response[0].Scripts
                })

                axios.get('/api/scripts/search?physicianId=' + this.state.physicianId, { headers: { "Authorization": "Bearer " + loginToken } })
                    .then((resp) => {
                        console.log(resp);
                        this.setState({
                            scripts: resp.data.response
                        })
                    })
            }).catch((error) => {
                console.error(error);
            })

    }

    renderTableHead() {
        return (
            <thead>
                <tr>
                    <th>
                        STATUS
                </th>
                    <th>
                        DATE
                </th>
                    <th>
                        PATIENT
                </th>
                    <th>
                        MEDICATION
                </th>
                    <th>
                        OTHER
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
                    {script.status}
                </td>

                <td>
                    <Span icon="calendar">
                        {script.processedOn}
                    </Span>
                </td>

                <td>
                    {script.Patient.firstName} {script.Patient.lastName}
                </td>

                <td>
                    {script.Product.name}
                </td>

                <td>

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
            // const self = this;

            var scriptList = this.state.scripts.map(function (item, i) {
                console.log(item);
                return (
                    <div key={i}>
                        {/* <div className="story-title-author">
                          <h3 className="story-title">{item.patient}</h3>
                
                      <h5 className="story-author">
                          {!(self.props.match.params.username)
                              ?
                              <div style={{ marginLeft: "5px" }} className="btn-group" role="group">
                                  <button onClick={() => self.showUpdForm(item)} type="button" className="btn btn-primary btn-xs"><span className="glyphicon glyphicon-pencil"></span></button>
                                  <button onClick={() => self.deleteBook(item.id)} type="button" className="btn btn-primary btn-xs"><span className="glyphicon glyphicon-remove"></span></button>
                              </div>
                              : null
                          }
                      </h5>
                  </div>
                  
                  <p>{item.description}</p>
                  <br /> */}
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
            <div>
                {this.renderTable()}
                {scriptList}
                <p></p>
            </div>
        )
    }
}


export default ScriptsTab;
