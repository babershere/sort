
import React from 'react'
import LoginForm from '../components/Login'
import SignupForm from '../components/Signup'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formState: "login"
        };

        this.changeFormState = this.changeFormState.bind(this);
    }

    changeFormState(event) {
        event.preventDefault()
        if (this.state.formState === "login") {
            this.setState({
                formState: "signup"
            })
        } else {
            this.setState({
                formState: "login"
            })
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-12">
                    {
                        (this.state.formState === "login")
                            ? <LoginForm changeForm={this.changeFormState} />
                            : <SignupForm changeForm={this.changeFormState} />
                    }
                </div>
            </div>
        );
    }
}

export default Login;