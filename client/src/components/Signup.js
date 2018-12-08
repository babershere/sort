
import React from 'react'
import axios from 'axios'

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            confirmpw: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.password === this.state.confirmpw) {
            axios.post("/api/user/new",
                {
                    email: this.state.email,
                    username: this.state.username,
                    password: this.state.password
                })
                .then((resp) => {
                    console.log(resp);
                    window.localStorage.setItem("token", resp.data.token);
                    window.location = '/team';
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            alert("Passwords do not match");
        }
    }

    render() {
        return (
            <form className="login-form" onSubmit={this.handleSubmit}>
                <div className="row">
                    <h3>SortPak Sign Up</h3>
                    <label>
                        Email:
                    <input name="email" type="text" value={this.state.email} onChange={this.handleChange} />
                    </label>
                    <label>
                        Username:
                    <input name="username" type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <label>
                        Password:
                    <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Password:
                    <input name="confirmpw" type="password" value={this.state.confirmpw} onChange={this.handleChange} />
                    </label><br />
                </div>
                <div className="row">
                    <input className="submit btn btn-default" type="submit" value="Submit" />
                    <button className="btn btn-primary" onClick={this.props.changeForm}>Login with existing account.</button>
                </div>
            </form>
        );
    }
}

export default Signup;