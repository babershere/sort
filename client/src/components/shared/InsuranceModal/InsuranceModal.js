import React, { Component } from 'react';
import axios from 'axios'
import jwt_decode from 'jwt-decode'

// Components
import {
    Button,
    Input,
    Selector,
    FormModal,
} from '../../common'

import styles from './InsuranceModal.css'


export default class InsuranceModal extends Component {
    /* constructor(props) {
      super(props)
    } */
    state = {
        insuranceFile: '',
        dateAttached: '',
        attachedBy: '',
        type: ''
    }

    componentDidMount() {
        console.log(this.props, this.state);

    }

    onChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    get inactive() {
        const {
            insuranceReplace
        } = this.state

        return !insuranceReplace
    }

    changeInsurance() {
        const loginToken = window.localStorage.getItem("token");
        const patientId = this.props.props.state.id;
        let data = new FormData();

        axios.post('/api/pastInsurance/add?patientId=' + patientId + '&plan=' + this.state.oldPlan + '&BIN=' + this.state.oldBIN + '&PCN=' + this.state.oldPCN
            + '&insID=' + this.state.oldID + '&group=' + this.state.oldGroup + '&type=' + this.state.oldType,
            data, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((data) => {
                console.log(data);
            }).catch((error) => {
                console.error(error);
            })

        if (this.state.insuranceReplace === 'Primary') {
            axios.put('/api/patients/update?id=' + patientId + '&primInsPlan=' + this.state.plan + '&primInsBIN=' + this.state.BIN + '&primInsPCN=' + this.state.PCN
                + '&primInsID=' + this.state.insID + '&primInsGroup=' + this.state.group + '&primInsType=' + this.state.type,
                data, { headers: { "Authorization": "Bearer " + loginToken } })
                .then((data) => {
                    console.log(data);
                    // this.props.onClickAway()
                    // window.location.reload();
                }).catch((error) => {
                    console.error(error);
                })
        } else if (this.state.insuranceReplace === 'Secondary') {
            axios.put('/api/patients/update?id=' + patientId + '&secInsPlan=' + this.state.plan + '&secInsBIN=' + this.state.BIN + '&secInsPCN=' + this.state.PCN
                + '&secInsID=' + this.state.insID + '&secInsGroup=' + this.state.group + '&secInsType=' + this.state.type,
                data, { headers: { "Authorization": "Bearer " + loginToken } })
                .then((data) => {
                    console.log(data);
                    // this.props.onClickAway()
                    // window.location.reload();
                }).catch((error) => {
                    console.error(error);
                })
        }
    }

    replaceInsurance() {
        if (this.state.insuranceReplace === 'Primary') {
            this.setState({
                oldPlan: this.props.props.state.primInsPlan,
                oldBIN: this.props.props.state.primInsBIN,
                oldPCN: this.props.props.state.primInsPCN,
                oldID: this.props.props.state.primInsID,
                oldGroup: this.props.props.state.primInsGroup,
                oldType: this.props.props.state.primInsType
            })
        } else if (this.state.insuranceReplace === 'Secondary') {
            this.setState({
                oldPlan: this.props.props.state.secInsPlan,
                oldBIN: this.props.props.state.secInsBIN,
                oldPCN: this.props.props.state.secInsPCN,
                oldID: this.props.props.state.secInsID,
                oldGroup: this.props.props.state.secInsGroup,
                oldType: this.props.props.state.secInsType
            })
        }
    }


    render() {
        const {
            content,
            onClickAway,
        } = this.props

        const insTypeOptions = [
            '--',
            'Medicare Part B',
            'Medicare Part D',
            'Medicaid',
            'Commercial',
            'Patient Pay'
        ]

        const replaceOptions = [
            '',
            'Primary',
            'Secondary'
        ]

        return (

            <FormModal
                title="Add Insurance"
                onClickAway={onClickAway}
                visible={!!content}
                onSubmit={this.changeInsurance.bind(this)}
                className="insuranceModal"
            >


                <br />
                <Selector
                    label="Insurance to Replace"
                    options={replaceOptions}
                    value={this.state.insuranceReplace}
                    onSelect={insuranceReplace => this.setState({ insuranceReplace }, this.replaceInsurance)}
                />
                <Input
                    label="Plan"
                    value={this.state.plan}
                    onChange={plan => this.setState({ plan })}
                />
                <Input
                    label="BIN"
                    value={this.state.BIN}
                    onChange={BIN => this.setState({ BIN })}
                />
                <Input
                    label="PCN"
                    value={this.state.PCN}
                    onChange={PCN => this.setState({ PCN })}
                />
                <Input
                    label="ID"
                    value={this.state.insID}
                    onChange={insID => this.setState({ insID })}
                />
                <Input
                    label="Group"
                    value={this.state.group}
                    onChange={group => this.setState({ group })}
                />
                <Selector
                    label="Type"
                    options={insTypeOptions}
                    value={this.state.type}
                    onSelect={type => this.setState({ type })}
                    style={{ marginTop: 25 }}
                />

                <br />
                <div className="buttons">
                    <Button
                        large
                        cancel
                        type="button"
                        title="Cancel"
                        onClick={onClickAway}
                    />
                    <Button
                        large
                        inactive={this.inactive}
                        type="submit"
                        title="Change Insurance"
                        onClick={this.changeInsurance}
                    />
                </div>
            </FormModal>
        )
    }
}
