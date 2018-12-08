import React, { Component } from 'react';
import axios from 'axios'

import { Table } from '../../../../common'

class UsersTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/user/search?physicianId=' + this.props.pID.match.params.physicianId, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                this.setState({
                    users: resp.data.response
                })
            })
    }

    renderTableHead() {
        return (
            <thead>
                <tr>
                    <th>NAME</th>
                    <th>USERNAME</th>
                    <th>EMAIL ADDRESS</th>
                </tr>
            </thead>
        )
    }

    renderTableBody() {

        return (
            <tbody>
                {this.state.users.map(this.renderTableRow.bind(this))}
            </tbody>
        )
    }

    handleClick(value) {
        window.location = `/team/${value}/edit`
    }

    renderTableRow(user) {
        return (
            <tr value={user.id} key={user.id} onClick={() => this.handleClick(user.id)}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email} </td>
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

        if (this.state.users) {
            var userList = this.state.users.map(function (item, i) {
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
            <div>
                {this.renderTable()}
                {userList}
            </div>
        )
    }
}


export default UsersTab;
