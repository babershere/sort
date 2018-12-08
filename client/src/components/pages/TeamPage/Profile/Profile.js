import React, { Component } from 'react';
import { connect } from 'react-redux'
// import validator from 'validator'

import axios from 'axios'

import {
    Button,
    Header,
    Body,
    Input,
    Form
} from '../../../common'

// Actions
import {
    createTeamMember,
} from '../../../../actions/team'

import styles from './Profile.css'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            role: '',
            title: '',
            phone: '',
            fax: '',
            username: '',
            password: '',
            confirmpw: '',
            active: false,
            imageAttached: false,
            passwordWillChange: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handlePasswordCheck = this.handlePasswordCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }

    state = {
        picFile: ''
    }

    componentDidMount() {
        if (this.props.match.params.userId) {
            const loginToken = window.localStorage.getItem("token");
            axios.get('/api/user/search?userId=' + this.props.match.params.userId, { headers: { "Authorization": "Bearer " + loginToken } })
                .then((resp) => {
                    let user = resp.data.response[0]
                    this.setState({
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        title: user.title,
                        phone: user.phone,
                        fax: user.fax,
                        email: user.email,
                        link: user.link,
                        active: user.active,
                        notifyReceived: user.notifyReceived,
                        notifyProcess: user.notifyProcess,
                        notifyPriorAuth: user.notifyPriorAuth,
                        notifyCopayAssistance: user.notifyCopayAssistance,
                        notifyShipped: user.notifyShipped
                    })
                }).catch((err) => {
                    console.error(err)
                })
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleCheckbox(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => console.log(this.state));

    }

    onChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.name === "picFile") {
            this.setState({
                imageAttached: true
            })
        }
    }

    handlePasswordCheck(e) {
        if (this.state.password) {
            this.setState({
                passwordWillChange: true
            }, this.handleSubmit)
        } else {
            this.handleSubmit();
        }
    }

    handleSubmit(e) {
        if (this.state.passwordWillChange) {
            if (this.state.password === this.state.confirmpw) {
                const loginToken = window.localStorage.getItem("token");
                let data = new FormData();
                data.append("picFile", document.getElementById("pic-file").files[0])
                axios.put('/api/user/update?id=' + this.state.id + '&username=' + this.state.username + '&title=' + this.state.title + '&name=' + this.state.name + '&phone=' + this.state.phone + '&fax=' + this.state.fax + '&email=' + this.state.email +
                    '&password=' + this.state.password + '&role=' + this.state.role + '&active=' + this.state.active + 
                    '&notifyReceived=' + this.state.notifyReceived + '&notifyProcess=' + this.state.notifyProcess + '&notifyPriorAuth=' + this.state.notifyPriorAuth + '&notifyCopayAssistance=' + this.state.notifyCopayAssistance + '&notifyShipped=' + this.state.notifyShipped + '&image=' + this.state.imageAttached,
                    data, { headers: { "Authorization": "Bearer " + loginToken } })
                    .then((data) => {
                        window.location.reload();
                    }).catch((error) => {
                        console.error(error);
                    })
            } else {
                alert("Passwords do not match");
            }
        } else {
            const loginToken = window.localStorage.getItem("token");
            let data = new FormData();
            data.append("picFile", document.getElementById("pic-file").files[0])
            axios.put('/api/user/update?id=' + this.state.id + '&username=' + this.state.username + '&title=' + this.state.title +'&name=' + this.state.name + '&phone=' + this.state.phone + '&fax=' + this.state.fax + '&email=' + this.state.email +
                '&password=' + this.state.password + '&role=' + this.state.role + '&active=' + this.state.active + 
                '&notifyReceived=' + this.state.notifyReceived + '&notifyProcess=' + this.state.notifyProcess + '&notifyPriorAuth=' + this.state.notifyPriorAuth + '&notifyCopayAssistance=' + this.state.notifyCopayAssistance + '&notifyShipped=' + this.state.notifyShipped + '&image=' + this.state.imageAttached,
                data, { headers: { "Authorization": "Bearer " + loginToken } })
                .then((data) => {
                    window.location.reload();
                }).catch((error) => {
                    console.error(error);
                })
        }
    }

    render() {
        const {
            username,
            name,
            email,
            password,
            confirmpw,
        } = this.state

        // const invalid = (
        //   !name
        //   || !validator.isEmail(email)
        //   || !role
        // )

        const roleOptions = [
            {
                display: 'Select Role...'
            },
            {
                value: 'Admin',
                display: 'Admin',
            },
            {
                value: 'Rep',
                display: 'Sales Rep',
            },
            {
                value: 'Physician',
                display: 'Physician'
            }
        ]

        return (
            <div className='addMember'>
                <Header>
                    <h2>Profile</h2>
                    <div className='action'>
                        <Button
                            large
                            cancel
                            link="/team"
                            title="CANCEL"
                            style={{ marginRight: 10, verticalAlign: 'middle', padding: '12px 24px' }}
                        />
                        <Button
                            onClick={this.handlePasswordCheck}
                            title="SAVE"
                            className="submit btn btn-default"
                            type="submit"
                            value="Submit"
                            style={{ marginRight: 8 }}
                        />
                    </div>
                </Header>
                <Body className={styles.body} style={{padding: '10px 35px'}}>
                    <Form
                        className="form"
                        onSubmit={this.handlePasswordCheck}
                    >
                        <div>
                            <div className="userImage" style={{ 'background-image': `url(/images/${this.state.id}/${this.state.link}`, width: '100px', height: '100px' }}></div>
                            <label htmlFor="picFile">Change My Profile Picture:</label>
                            <input name="picFile" onChange={this.onChangeHandler} accept=".png" id="pic-file" type="file" />
                        </div>
                        <br />
                        <Input
                            label="Full Name:"
                            placeholder={this.state.name}
                            value={name}
                            onChange={name => this.setState({ name })}
                        />
                        <Input
                            label='Title:'
                            placeholder={this.state.title}
                            value={this.state.title}
                            onChange={title => this.setState({ title })}
                        />
                        <Input
                            label='Username:'
                            placeholder={this.state.username}
                            name='username'
                            value={username}
                            onChange={username => this.setState({ username })}
                        />
                        <br />

                        <h3 style={{'border-bottom': '1px solid #cac9c9', padding: '7px 0'}}>Password</h3>

                        <Input
                            label='Current Password:'
                            placeholder="Enter old password"
                            name='password'
                            type='password'
                            value={this.state.oldPassword}
                            onChange={oldPassword => this.setState({ oldPassword })}
                        />
                        <Input
                            label='New Password:'
                            placeholder="Enter new password"
                            name='password'
                            type='password'
                            value={password}
                            onChange={password => this.setState({ password })}
                        />

                        <Input
                            label='Confirm New Password:'
                            placeholder="Confirm new password"
                            name='confirmpw'
                            type='confirmpw'
                            value={confirmpw}
                            onChange={confirmpw => this.setState({ confirmpw })}
                        />

                        <br />

                        <h3 style={{'border-bottom': '1px solid #cac9c9', padding: '7px 0'}}>Notifications</h3>

                        <Input
                            label="Phone:"
                            placeholder={this.state.phone}
                            value={this.state.phone}
                            onChange={phone => this.setState({ phone })}
                        />

                        <Input
                            label="Fax:"
                            placeholder={this.state.fax}
                            value={this.state.fax}
                            onChange={fax => this.setState({ fax })}
                        />

                        <Input
                            label="Email:"
                            placeholder={this.state.email}
                            value={email}
                            onChange={email => this.setState({ email })}
                        />

                        <br />
                        <h6>Statuses:</h6>

                        <div className='check'>
                            <input
                                type="checkbox"
                                name="notifyReceived"
                                checked={this.state.notifyReceived}
                                value={this.state.notifyReceived}
                                onChange={this.handleCheckbox}
                            />
                            <label>Received</label>
                        </div>

                        <div className='check'>
                            <input
                                type="checkbox"
                                name="notifyProcess"
                                checked={this.state.notifyProcess}
                                value={this.state.notifyProcess}
                                onChange={this.handleCheckbox}
                            />
                            <label>Process</label>
                        </div>

                        <div className='check'>
                            <input
                                type="checkbox"
                                name="notifyPriorAuth"
                                checked={this.state.notifyPriorAuth}
                                value={this.state.notifyPriorAuth}
                                onChange={this.handleCheckbox}
                            />
                            <label>Prior Authorization</label>
                        </div>

                        <div className='check'>
                            <input
                                type="checkbox"
                                name="notifyCopayAssistance"
                                checked={this.state.notifyCopayAssistance}
                                value={this.state.notifyCopayAssistance}
                                onChange={this.handleCheckbox}
                            />
                            <label>Copay Assistance</label>
                        </div>

                        <div className='check'>
                            <input
                                type="checkbox"
                                name="notifyShipped"
                                checked={this.state.notifyShipped}
                                value={this.state.notifyShipped}
                                onChange={this.handleCheckbox}
                            />
                            <label>Shipped</label>
                        </div>

                        <br />
                    </Form>
                </Body>
            </div >
        );
    }
}

const mapStateToProps = ({ main }) => {
    const {
        loading,
    } = main

    return {
        loading,
    }
}

const actions = {
    createTeamMember,
}

export default connect(mapStateToProps, actions)(Profile)
