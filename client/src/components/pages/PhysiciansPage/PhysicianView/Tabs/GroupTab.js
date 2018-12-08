import React, { Component } from 'react';
import axios from 'axios'

import { Span, Table } from '../../../../common'

class GroupTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            test: ''
        }
    }

    getGroup() {
        const loginToken = window.localStorage.getItem("token");
        console.log(this.state.group)
        axios.get('/api/physicians/search?group=' + this.state.group, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                console.log(resp);
                // let patient = resp.data.response[0];
                this.setState({
                    physicians: resp.data.response
                }, () => console.log(this.state.physicians))

            })
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
                    scripts: resp.data.response[0].Scripts,
                    group: resp.data.response[0].group
                }, this.getGroup)

            })

    }

    renderTableHead() {
        return (
            <thead>
                <tr>
                    <th>
                        PHYSICIAN NAME
                </th>
                    <th>
                        PHONE
                </th>
                    <th>
                        EMAIL
                </th>
                
                    <th>
                        GROUP
                    </th>
                </tr>
            </thead>
        )
    }

    renderTableBody() {

        return (
            <tbody>
                {this.state.physicians.map(this.renderTableRow.bind(this))}
            </tbody>
        )
    }

    handleClick(value) {
        window.location = `/physicians/${value}`
    }

    renderTableRow(physician) {
        return (
            <tr value={physician.id} onClick={() => this.handleClick(physician.id)}>
                <td>
                    {physician.firstName} {physician.lastName}
                </td>

                <td>
                    <Span icon="phone">
                        {physician.phone}
                    </Span>
                </td>


                <td>
{physician.email}
                </td>

<td>{physician.group}</td>
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

        if (this.state.physicians) {
            // const self = this;

            var physicianList = this.state.physicians.map(function (item, i) {
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
                {physicianList}
                <p></p>
            </div>
        )
    }
}


export default GroupTab;
