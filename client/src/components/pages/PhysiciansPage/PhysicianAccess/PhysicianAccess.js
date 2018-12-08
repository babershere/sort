import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'

import { Table, Header, Input, ActionBox, Button, Selector } from '../../../common'

import styles from '../PhysicianView/PhysicianView.css'

class PhysicianAccess extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }

        this.giveAccess = this.giveAccess.bind(this);

    }

    componentDidMount() {
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/user/search?role=Physician', { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                this.setState({
                    users: resp.data.response
                })

            }).catch((error) => {
                console.error(error);
            })

        axios.get('/api/physicians/search?physicianId=' + this.props.match.params.physicianId, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                console.log(resp);
                let physician = resp.data.response[0]
                this.setState({
                    name: physician.firstName + ' ' + physician.lastName,
                    group: physician.group
                })

            }).catch((error) => {
                console.error(error);
            })

    }

    searchQuery() {
        const loginToken = window.localStorage.getItem("token");
        axios.get('api/users/search?role=Physician' + '&name=' + this.state.searchName, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                console.log(resp.data.response);
                this.setState({
                    users: resp.data.response,
                }, () => console.log(this.state.users))
            }).catch((error) => {
                console.error(error);
            })
    }



    accessConfirm(value) {
        if (window.confirm('Give access to this user?')) {
            this.giveAccess(value);
        } else {
            return;
        }
    }

    giveAccess(value) {
        const loginToken = window.localStorage.getItem("token");
        let data = new FormData();
        axios.put('/api/user/update?id=' + value + '&physicianId=' + this.props.match.params.physicianId + `&active=${true}`,
            data, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((data) => {
                console.log(data);
                this.reRender();

            }).catch((error) => {
                console.error(error);
            })
    }

    reRender() {
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/user/search?role=Physician', { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                this.setState({
                    users: resp.data.response
                })

            }).catch((error) => {
                console.error(error);
            })
    }

    enterPressed(event) {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            this.searchQuery();
        }
    }

    renderTableHead() {
        return (
            <thead>
                <tr>
                    <th>
                        Username
          </th>
                    <th>

                    </th>
                    <th>
                        Give Access
          </th>
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



    renderTableRow(user) {
        console.log(user.PhysicianId, this.props.match.params.physicianId)
        return (
            <tr value={user.id}>

                <td>
                    {user.username}
                </td>

                <td style={{ 'width': '60%' }}>

                </td>

                <td>
                    {user.PhysicianId == this.props.match.params.physicianId ?
                    
                    <div>Access Granted</div> :
                    
                    <Button
                        className="access"
                        search
                        icon="lock"
                        title="GIVE ACCESS"
                        style={{ marginLeft: 8 }}
                        onClick={() => this.accessConfirm(user.id)}
                    />
                    }
                </td>

            </tr>
        )
    }

    renderTable() {
        return (
            <Table className={styles.table}>
                {this.renderTableHead()}
                {this.renderTableBody()}
            </Table>
        )
    }

    render() {
        if (this.state.users) {
            var userList = this.state.users.map(function (item, i) {
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

        console.log(this.props, this.state);
        return (
            <div className={styles.app}>

                <Header className={styles.header}>

                    <h2 style={{ marginBottom: 25 }}>
                        {this.state.name}
                        <span className="group">
                            {this.state.group || 'No Group Available'}
                        </span>
                    </h2>
                    <div className="action">
                        <Button
                            cancel
                            title="CANCEL"
                            link={`/physicians/${this.props.match.params.physicianId}`}
                        />


                    </div>
                </Header>

                <div className="body">
                    <p style={{ marginBottom: -15, marginLeft: 40 }}>Give a user access to this physician</p>

                    <ActionBox className='searchBar'>
                        <div className="main">

                            <Input
                                label="Search By Name"
                                placeholder="First or Last Name..."
                                value={this.state.searchName}
                                onChange={searchName => this.setState({ searchName })}
                                onKeyPress={this.enterPressed.bind(this)}
                            />



                            <Button
                                search
                                icon="search"
                                title="SEARCH"
                                onClick={this.searchQuery}
                            />

                        </div>

                    </ActionBox>

                    {this.renderTable()}
                    {userList}

                </div>
            </div>
        );
    }
}

export default PhysicianAccess;
