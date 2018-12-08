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

import styles from './AddMember.css'

class EditMember extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      username: '',
      password: '',
      confirmpw: '',
      active: false,
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
          console.log(resp);
          let user = resp.data.response[0]
          this.setState({
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            active: user.active
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
    });

  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handlePasswordCheck(e) {
    console.log("HI")
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
      console.log("HI")
      if (this.state.password === this.state.confirmpw) {
        const loginToken = window.localStorage.getItem("token");
        let data = new FormData();
        // data.append("picFile", document.getElementById("pic-file").files[0])
        axios.put('/api/user/update?id=' + this.state.id + '&username=' + this.state.username + '&name=' + this.state.name + '&email=' + this.state.email +
          '&password=' + this.state.password + '&role=' + this.state.role + '&active=' + this.state.active,
          data, { headers: { "Authorization": "Bearer " + loginToken } })
          .then((data) => {
            console.log(data);
            this.props.history.push('/team');
          }).catch((error) => {
            console.error(error);
          })
      } else {
        alert("Passwords do not match");
      }
    } else {
      const loginToken = window.localStorage.getItem("token");
      let data = new FormData();
      // data.append("picFile", document.getElementById("pic-file").files[0])
      axios.put('/api/user/update?id=' + this.state.id + '&username=' + this.state.username + '&name=' + this.state.name + '&email=' + this.state.email +
        '&password=' + this.state.password + '&role=' + this.state.role + '&active=' + this.state.active,
        data, { headers: { "Authorization": "Bearer " + loginToken } })
        .then((data) => {
          console.log(data);
          this.props.history.push('/team');
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
          <h2>Edit Member</h2>
          <div className='action'>
            <Button
              large
              cancel
              link="/team"
              title="CANCEL"
              style={{ marginRight: 10, verticalAlign: 'middle', padding: '12px 24px'}}
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
        <Body className={styles.body}>
          <Form
            className="form"
            onSubmit={this.handlePasswordCheck}
          >
            <Input
              label='User Name'
              placeholder={this.state.username}
              name='username'
              value={username}
              onChange={username => this.setState({ username })}
            />
            <label>
              Name:
            </label>
            <Input
              placeholder={this.state.name}
              value={name}
              onChange={name => this.setState({ name })}
            />


            <br />

            <label>
              Email:
            </label>
            <Input
              placeholder={this.state.email}
              value={email}
              onChange={email => this.setState({ email })}
            />

            <br />

            <Input
              label='Password:'
              placeholder="Enter only if changing password"
              name='password'
              type='password'
              value={password}
              onChange={password => this.setState({ password })}
            />

            <Input
              label='Confirm Password:'
              placeholder="Enter only if changing password"
              name='confirmpw'
              type='confirmpw'
              value={confirmpw}
              onChange={confirmpw => this.setState({ confirmpw })}
            />

            <div className='check'>
              <input
                type="checkbox"
                name="active"
                checked={this.state.active}
                onChange={this.handleCheckbox}
              />
              <label>ACTIVE</label>
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

export default connect(mapStateToProps, actions)(EditMember)
