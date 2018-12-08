import React, { Component } from 'react';

import axios from 'axios'
import Moment from 'react-moment'

// Components
import {
  Span,
  Button,
  Table
} from '../../../../common'

import {
  NoteModal,
} from '../../../../shared'



class NotesTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      test: ''
    }
  }

  openNoteModal() {
    this.props.setState({ noteModal: {} })
  }

  componentWillReceiveProps() {
    this.componentUpdate();
  }

  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/scripts/notes/search/?ScriptId=' + this.props.state.id, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);
        this.setState({
          notes: resp.data.response,
        })
        console.log(this.state)
      }).catch((error) => {
        console.error(error);
      })
  }

  componentUpdate() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/scripts/notes/search/?ScriptId=' + this.props.state.id, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);
        this.setState({
          notes: resp.data.response,
        }, () => console.log(this.state.notes))
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
        {this.state.notes.map(this.renderTableRow.bind(this))}
      </tbody>
    )
  }

  renderTableRow(note) {
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

    if (this.state.notes) {
      var noteList = this.state.notes.sort(function(a,b) { 
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() 
    });
      var noteList =
        this.state.notes.map((item, i) =>
          <div key={i}>
            <Table className="nt">
              <thead><th>
                <div className="userImage" style={{ 'background-image': `url(/images/${item.UserId}/${item.userImage}` }}></div>
                <div className='noteName'>{item.name}</div></th></thead>
              <tr>
                <td>{item.note}</td>
              </tr>
            </Table>

            <Table className="noteDateTime" key={item.id}>
              <td>
                <Span icon="calendar" />
                <Moment format={"MM/DD/YY"}>{item.createdAt}</Moment>
                &nbsp;&nbsp;
                <Span icon="clock-o" />
                <Moment format={"hh:mm A"}>{item.createdAt}</Moment>
              </td>
            </Table>
          </div>
        );

    }
    else {
      return <div>
        <p></p>
      </div>
    }

    const {
      state,
      className,
      onCloseModal,
      onCreateNote,
    } = this.props

    const {
      noteModal
    } = state

    return (
      <div id="notesTab" className={className}>

        <Button
          icon="plus"
          title="ADD NOTE"
          onClick={() => this.openNoteModal()}
        />

        <div className="notes">
          {this.renderTable()}
          {noteList}
        </div>

        <NoteModal
          content={noteModal}
          state={this.state}
          props={this.props}
          onClickAway={onCloseModal}
          onSubmit={onCreateNote}
        />
      </div>
    )
  }
}

export default NotesTab;