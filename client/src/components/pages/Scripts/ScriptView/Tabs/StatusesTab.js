import React, { Component } from 'react';
import axios from 'axios'
import Moment from 'react-moment'

// Components
import {
  Span, Table
} from '../../../../common'


class StatusesTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      statuses: ''
    }
  }

  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/scripts/statuses/search/?ScriptId=' + this.props.state.id, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);
        this.setState({
          statuses: resp.data.response
        })
        console.log(this.state)
      }).catch((error) => {
        console.error(error);
      })
  }

  renderTableHead() {
    return (
      <thead>

      </thead>
    )
  }

  renderTableBody() {
    return (
      <tbody>
        {this.state.statuses.map(this.renderTableRow.bind(this))}
      </tbody>
    )
  }

  renderTableRow(status) {
    return (<div>

    </div>

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

    if (this.state.statuses) {

      var statusList =

        //   .sort((a, b) => a.createdAt < b.createdAt)
        this.state.statuses.reverse().map((item, i) =>
          <div key={i}>
            <div className="statusesTab" key={item.id}>
            <div className="userImage" style={{'background-image': `url(/images/${item.UserId}/${item.userImage}`}}>
            
            {/* <img src={`/images/${item.User.id}/${item.User.link}`} /> */}
            </div>
            <div className='statusDateTime'>
              <Span icon="calendar" />
              <Moment format={"MM/DD/YY"}>{item.createdAt}</Moment>
              &nbsp;&nbsp;
              <Span icon="clock-o" />
              <Moment format={"hh:mm A"}>{item.createdAt}</Moment>
              &nbsp;&nbsp; {item.name}
              <br />
              This script has been changed from <b>{item.fromStatus}</b> to <b>{item.toStatus}</b>
              </div>
              

            </div>
          </div>
        );

    }
    else {
      return <div>
        <p></p>
      </div>
    }


    return (
      <div>

        <div className="notes">
          {this.renderTable()}
          {statusList}
        </div>
      </div>
    )
  }
}

export default StatusesTab;
