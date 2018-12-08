
import React from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import styles from './LoginMain.css'

import {
    ErrorMessage,
    FloatBox,
    Button,
    Form,
} from '../../common'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    decode() {
        const loginToken = window.localStorage.getItem("token");
        var decoded = jwt_decode(loginToken);
        console.log(decoded);
        this.setState({
            userId: decoded.id
        }, this.getUserRole)

    }

    getUserRole() {
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/user/search?userId=' + this.state.userId, { headers: { "Authorization": "Bearer " + loginToken } })
        .then((resp) => {
            console.log(resp);
            this.setState({
                userRole: resp.data.response[0].role,
                active: resp.data.response[0].active
            }, this.redirect)
        }).catch((err) => {
            console.error(err)
        })
    }
    
    redirect() {
        console.log(this.state.active);
        if (this.state.active === true) {
            if (this.state.userRole === "Physician") {
                window.location = '/patients';
            } else {
                window.location = '/scripts';
            }
        } else if (this.state.active === false) {
            localStorage.clear()
            window.alert("User is inactive");
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        axios.post("/api/user/login",
            {
                user: this.state.user,
                password: this.state.password
            })
            .then((resp) => {
                window.localStorage.setItem("token", resp.data.token);
                this.decode();

            })
            .catch((err) => {
                alert('Login failed');
                console.error(err);
            })
    }



    render() {
        const {
            error,
            loading
        } = this.props
        return (
            <div className={styles.container}>
                <FloatBox classname={styles.floatBox} >
                    <img src="/sortpak-logo.png" className="logo" />
                    <h2 style={{ margin: '0 auto', marginBottom: 30 }}>Welcome to SortPak</h2>
                    <Form
                        className={styles.body}
                        onSubmit={this.handleSubmit}
                    >
                        <label>Username or Email</label>
                        <input name="user" placeholder="Username" type="text" value={this.state.value} onChange={this.handleChange} />
                        <label>Password</label>
                        <input name="password" placeholder="Password" type="password" value={this.state.value} onChange={this.handleChange} />

                        <Button
                            className="button"
                            type="submit"
                            title="Login"
                            inactive={loading}
                            style={{ display: 'block', margin: '25px auto' }}
                        />
                        <ErrorMessage error={error} />
                        {/* <Link to="login/reset-password">Reset Password</Link> */}
                    </Form>
                </FloatBox>
            </div>
        );
    }
}

export default Login;