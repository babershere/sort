import React, { Component } from 'react';
import axios from 'axios'
import Moment from 'react-moment'

import { DateBox, Button, Span, Table } from '../../../../common'

import {
    VisitModal,
    PhysicianNoteModal
} from '../../../../shared'

class AppointmentsNotesTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visits: [],
            visitNotes: []
        }
    }

    openNoteModal() {
        this.props.setState({ noteModal: {} })
    }

    openVisitModal() {
        this.setState({ visitModal: {} })
    }

    closeModal() {
        this.setState({
          noteModal: null,
          visitModal: null
        })
      }


    componentWillMount() {
        console.log(this.props)
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/visits/notes/search?physicianId=' + this.props.pID.match.params.physicianId, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                console.log(resp);
                this.setState({
                    visitNotes: resp.data.response.reverse()
                })
            }).catch((error) => {
                console.error(error);
            })

        axios.get('/api/visits/search?physicianId=' + this.props.pID.match.params.physicianId, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                console.log(resp);
                this.setState({
                    visits: resp.data.response
                })
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
                {this.state.visitNotes.map(this.renderTableRow.bind(this))}
                {this.state.visits.map(this.renderTableRow.bind(this))}

            </tbody>
        )
    }

    renderTableRow(visitNote) {
        return (
            <div></div>
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
        console.log(this.state.noteModal)

        var visitNoteList =
            this.state.visitNotes.map((item, i) =>
                <div className="physicianNotes" key={i}>
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
        console.log(visitNoteList)
        var visitList = this.state.visits.sort(function(a,b) { 
            return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime() 
        });
        var visitList =
            this.state.visits.map((item, i) =>
                <DateBox
                    key={item.id}
                    visit={item}
                    dateTime={item.dateTime}
                />



            );

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

                <div style={{ 'display': 'flex' }}>

                    <div style={{ 'flex': '1 1', padding: '0 20px', borderRight: '1px solid #edefef' }} className="notes">
                        <div style={{ 'display': 'flex' }}>
                            <h5 style={{ 'flex': '1 1' }}>Notes</h5>
                            <Button
                                style={{ 'font-weight': 'lighter' }}
                                icon="plus"
                                title="ADD NOTE"
                                onClick={() => this.openNoteModal()}
                            />
                        </div>
                        {this.renderTable()}
                        {visitNoteList}
                    </div>

                    <div style={{ 'flex': '1 1', padding: '0 40px' }} className="appointments">
                        <div style={{ 'display': 'flex' }}>
                            <h5 style={{ 'flex': '1 1' }}>Upcoming Appointments</h5>
                            <Button
                                style={{ 'font-weight': 'lighter' }}
                                icon='plus'
                                title='SET APPOINTMENT'
                                onClick={() => this.openVisitModal()}

                            />
                        </div>
                        {this.renderTable()}
                        {visitList}
                    </div>
                </div>

                <VisitModal
                    // month={month}
                    // year={year}
                    content={this.state.visitModal}
                    onClickAway={() => this.setState({ visitModal: null })}
                    // onSubmit={this.props.createVisit.bind(this)}
                />

                <PhysicianNoteModal
                    content={noteModal}
                    state={this.state}
                    props={this.props}
                    onClickAway={() => this.props.setState({ noteModal: null })}
                    onSubmit={onCreateNote}
                />
            </div>
        )
    }
}


export default AppointmentsNotesTab;
