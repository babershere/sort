import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'


import {
    patientChange,
    medicationChange,
    pharmNPIChange,
    locationChange,
    pharmDateChange,
    writtenDateChange,
    salesCodeChange,
    billOnDateChange,
    costChange,
    rxNumberChange,
    primInsPayChange,
    diagnosisChange,
    secInsPayChange,
    secDiagnosisChange,
    patientPayChange,
    refillsChange,
    refillsRemainingChange,
    quantityChange,
    daysSupplyChange,
    directionsChange,
    phoneChange,
    emailChange
} from '../../../../actions/auth'

import { Selector, Button, Header, Input, Body, Table, Form, } from '../../../common'
import styles from './AddScript.css';


class AddScript extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pouch: false,
            priorAuth: '',
            homeCare: false,
            processedOn: moment().format("YYYY-MM-DD"),
            status: 'Received',
            physicianId: '',
            value: '',
            writtenDate: '',
            billOnDate: '',
            shipOn: '',
            ETA: '',
            copayApproval: '',
            copayNetwork: '',
            diagnosis: '',
            secDiagnosis: '',
            suggestions: [],
            setPhysician: 'inactive',
            setProduct: 'inactive',
            physSearch: false,
            prodSearch: false
        }

        this.handleCheckbox = this.handleCheckbox.bind(this);
    }


    componentDidMount() {
        const loginToken = window.localStorage.getItem("token");

        axios.get('/api/current/search', { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                this.setState({
                    currentPatientID: resp.data.response[0].patientId
                })

                axios.get('/api/patients/search?patientId=' + this.state.currentPatientID, { headers: { "Authorization": "Bearer " + loginToken } })
                    .then((resp) => {
                        const patient = resp.data.response[0]
                        this.setState({
                            patientId: patient.id,
                            patientName: patient.firstName + " " + patient.lastName,
                            patientDob: patient.dob,
                            patientPhone: patient.phone,
                            patientAddressStreet: patient.addressStreet,
                            patientAddressCity: patient.addressCity,
                            patientAddressState: patient.addressState,
                            patientZipCode: patient.addressZipCode
                        })
                    }).catch((error) => {
                        console.error(error);
                    })
            }).catch((error) => {
                console.error(error);
            })

        axios.get('/api/physicians/search', { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                this.setState({
                    physicians: resp.data.response
                })
            }).catch((err) => {
                console.error(err)
            })


        axios.get('/api/products/search', { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                this.setState({
                    products: resp.data.response
                })

            }).catch((error) => {
                console.error(error);
            })
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });

    };


    onChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    searchPhysicians() {
        this.setState({
            physSearch: true
        })
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/physicians/search?name=' + this.state.physicianName, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                this.setState({
                    physicians: resp.data.response
                })
            }).catch((err) => {
                console.error(err)
            })
    }

    searchProducts() {
        this.setState({
            prodSearch: true
        })
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/products/search?search=' + this.state.productName, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                this.setState({
                    products: resp.data.response
                })
            }).catch((err) => {
                console.error(err)
            })
    }

    submitscript = (event) => {
        event.preventDefault();
        const loginToken = window.localStorage.getItem("token");
        let data = new FormData();
        axios.post('/api/scripts/add?patientId=' + this.state.patientId + '&physicianId=' + this.state.physicianId + '&productId=' + this.state.productId + '&processedOn=' + this.state.processedOn + '&pouch=' + this.state.pouch + "&status=" + this.state.status + "&pharmNPI=" + this.props.pharmNPI
            + "&priorAuth=" + this.state.priorAuth + "&location=" + this.props.location + "&pharmDate=" + this.props.pharmDate + "&writtenDate=" + this.props.writtenDate + "&salesCode=" + this.props.salesCode +
            "&billOnDate=" + this.props.billOnDate + "&cost=" + this.state.cost + "&rxNumber=" + this.props.rxNumber + "&primInsPay=" + this.props.primInsPay + "&diagnosis=" + this.state.diagnosis +
            "&secInsPay=" + this.props.secInsPay + "&secDiagnosis=" + this.state.secDiagnosis + "&patientPay=" + this.props.patientPay + "&refills=" + this.props.refills +
            "&refillsRemaining=" + this.props.refillsRemaining + "&quantity=" + this.state.quantity + "&daysSupply=" + this.props.daysSupply + "&directions=" + this.props.directions +
            "&copayApproval=" + this.state.copayApproval + "&copayNetwork=" + this.state.copayNetwork + "&homeCare=" + this.state.homeCare + '&hcHome=' + this.state.hcHome + '&hcPhone=' + this.state.hcPhone,
            data, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((data) => {
                this.props.history.push("/scripts");
            }).catch((error) => {
                console.error(error);
            })
    }

    renderPhysician() {
        if (this.state.setPhysician === 'inactive') {
            return (
                <Table className="addScriptTable">
                    <thead>
                        <th>PHYSICIAN NAME</th>
                        <th>GROUP</th>
                        <th>SPECIALIZATION</th>
                        <th>PHONE</th>
                        <th>ADDRESS</th>
                    </thead>
                    <tr>
                        <td style={{borderRight: 'none'}} className="add" onClick={() => this.setState({ setPhysician: 'search' })}>
                            + Click here to add a physician
                            </td>
                    </tr>
                </Table>
            )
        } else if (this.state.setPhysician === 'search') {
            return (
                <div>
                    <Input
                        style={{ marginLeft: 35 }}
                        placeholder="Type name of physician.."
                        value={this.state.physicianName}
                        onChange={physicianName => this.setState({ physicianName }, this.searchPhysicians)}
                    />
                    {this.state.physSearch ?
                        <div>


                            {this.renderPhysicianColumn()}
                        </div>
                        :
                        <div></div>}
                </div>
            )
        } else if (this.state.setPhysician === 'set') {
            return (
                <Table className="addScriptTable">
                    <thead>
                        <th>PHYSICIAN NAME</th>
                        <th>GROUP</th>
                        <th>SPECIALIZATION</th>
                        <th>PHONE</th>
                        <th>ADDRESS</th>
                    </thead>
                    <tr>
                        <td>{this.state.physicianName}</td>
                        <td>{this.state.physicianGroup}</td>
                        <td>{this.state.physicianSpec}</td>
                        <td>{this.state.physicianPhone}</td>
                        <td>
                            {this.state.physicianAddressStreet}<br />
                            {this.state.physicianAddressCity}, {this.state.physicianAddressState}, {this.state.physicianAddressZipCode}
                        </td>
                    </tr>
                </Table>
            )
        }
    }

    renderProduct() {
        if (this.state.setProduct === 'inactive') {
            return (
                <Table id="inactiveTable" className="addScriptTable">
                    <thead>
                        <th>NAME</th>
                        <th>NDC</th>
                        <th>PACKAGE SIZE</th>
                        <th>QUANTITY</th>
                        <th>COST</th>
                    </thead>
                    <tr>
                        <td style={{borderRight: 'none'}} className="add" onClick={() => this.setState({ setProduct: 'search' })}>
                            + Click here to add a medication
                            </td>
                    </tr>

                </Table>
            )
        } else if (this.state.setProduct === 'search') {
            return (
                <div>
                    <Input
                        style={{ marginLeft: 35 }}
                        placeholder="Type name or NDC of medication.."
                        value={this.state.productName}
                        onChange={productName => this.setState({ productName }, this.searchProducts)}
                    />
                    {this.state.prodSearch ?
                        <div>
                            {this.renderProductColumn()}
                        </div>
                        :
                        <div></div>}
                </div>
            )
        } else if (this.state.setProduct === 'set') {
            return (
                <Table className="addScriptTable">
                    <thead>
                        <th>Name</th>
                        <th>NDC</th>
                        <th>PACKAGE SIZE</th>
                        <th>QUANTITY</th>
                        <th>COST</th>
                    </thead>
                    <tr>
                        <td>{this.state.productName}</td>
                        <td>{this.state.productNDC}</td>
                        <td>{this.state.productPackageSize}</td>
                        <td>{this.state.productQuantity}</td>
                        <td>{this.state.productCost}</td>
                    </tr>
                </Table>
            )
        }
    }

    renderPhysicianColumn() {
        return (
            <div style={{ marginLeft: 35 }}>
                <Table className="addScriptSearch">
                    <thead>
                        <th>PHYSICIAN NAME</th>
                        <th>GROUP</th>
                        <th>SPECIALIZATION</th>
                        <th>PHONE</th>
                        <th>ADDRESS</th>
                    </thead>
                    {this.state.physicians.map(this.renderPhysicianRow.bind(this))}
                </Table>
            </div>
        )
    }

    renderProductColumn() {
        return (
            <div style={{ marginLeft: 35 }}>
                <Table className="addScriptSearch">
                    <thead>
                        <th>Name</th>
                        <th>NDC</th>
                        <th>PACKAGE SIZE</th>
                        <th>QUANTITY</th>
                        <th>COST</th>
                    </thead>
                    {this.state.products.map(this.renderProductRow.bind(this))}
                </Table>
            </div>
        )
    }


    renderPhysicianRow(physician) {
        return (
            <tr style={{ 'cursor': 'pointer' }} value={physician.id} onClick={() => this.setPhysician(physician.id)}>
            <td>{physician.firstName} {physician.lastName}</td>
            <td>{physician.group}</td>
            <td>{physician.specialization}</td>
            <td>{physician.phone}</td>
            <td>{physician.addressStreet}<br />
                {physician.addressCity}, {physician.addressState}, {physician.addressZipCode}</td>
            </tr>
        )
    }

    renderProductRow(product) {
        return (
            <tr style={{ 'cursor': 'pointer', marginBottom: 2 }} value={product.id} onClick={() => this.setProduct(product.id)}>
                <td>{product.name}</td>
                <td>{product.NDC}</td>
                <td>{product.packageSize}</td>
                <td>{product.quantity}</td>
                <td>{product.cost}</td>
            </tr>
        )
    }

    setPhysician(value) {
        this.setState({
            physSearch: false,
            physicianId: value,
            setPhysician: 'set'
        }, this.getPhysician)
    }

    setProduct(value) {
        this.setState({
            prodSearch: false,
            productId: value,
            setProduct: 'set'
        }, this.getProduct)
    }

    getPhysician() {
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/physicians/search?physicianId=' + this.state.physicianId,
            { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                let physician = resp.data.response[0];
                this.setState({
                    physicianName: physician.firstName + " " + physician.lastName,
                    physicianGroup: physician.group,
                    physicianSpec: physician.specialization,
                    physicianPhone: physician.phone,
                    physicianAddressStreet: physician.addressStreet,
                    physicianAddressCity: physician.addressCity,
                    physicianAddressState: physician.addressStreet,
                    physicianAddressZipCode: physician.addressZipCode
                })
            }).catch((error) => {
                console.error(error);
            })
    }

    getProduct() {
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/products/search?productId=' + this.state.productId,
            { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                let product = resp.data.response[0];
                this.setState({
                    productName: product.name,
                    productNDC: product.NDC,
                    productPackageSize: product.packageSize,
                    productQuantity: product.quantity,
                    productCost: product.cost,
                    productPackageSize: product.packageSize
                }, this.calcTabletCost)
            }).catch((error) => {
                console.error(error);
            })
    }

    calcTabletCost() {
        this.setState({
            tabletCost: this.state.productCost.replace(",","") / this.state.productPackageSize.replace(",",""),
            quantity: this.state.productPackageSize
        }, this.updateCost)
    }

    updateCost() {
        this.setState({
            cost: this.state.tabletCost * this.state.quantity.replace(",","")
        }, this.roundtoNearestCent)
    }
    
    roundtoNearestCent() {
        this.setState({
            cost: Math.floor(this.state.cost * 100) / 100
        })
    }

    handleCheckbox(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    }

    handleChangeValue = e => this.setState({ value: e.target.value });


    render() {

        const statusOptions = [
            'Received',
            'Review',
            'Prior Auth',
            'Process',
            'Copay Assistance',
            'Schedule',
            'QA',
            'Fill',
            'Shipped',
            'Done',
            'Cancelled',
            'Refill',
            'Renew'
        ]


        const {
            pharmNPI,
            pharmNPIChange,
            location,
            locationChange,
            pharmDate,
            pharmDateChange,
            writtenDate,
            writtenDateChange,
            salesCode,
            salesCodeChange,
            billOnDate,
            billOnDateChange,
            cost,
            costChange,
            rxNumber,
            rxNumberChange,
            primInsPay,
            primInsPayChange,
            secInsPay,
            secInsPayChange,
            patientPay,
            patientPayChange,
            refills,
            refillsChange,
            refillsRemaining,
            refillsRemainingChange,
            quantity,
            quantityChange,
            daysSupply,
            daysSupplyChange,
            directions,
            directionsChange
        } = this.props



        const priorAuthOptions = [
            'Approved',
            'Denied',
            'Payor Restriction',
            'Limited Distribution'
        ]

        const copayApprovalOptions = [
            '-',
            'Approved',
            'Denied'
        ]

        const copayNetworkOptions = [
            '-',
            'Cancer Care Foundation',
            'Chronice Disease Fund',
            'Health Well',
            'LLS',
            'Patient Access Network',
            'Patient Advocate',
            'Patient Service Inc',
            'Safety Net Foundation',
            'Good Days',
            'Coupon',
            'Voucher',
            'Copay Card'
        ]


        return (
            <div>
                <Header>
                    <h2>Add A New Script</h2>
                    <div className="action">
                        <Button
                            cancel
                            type="button"
                            title="CANCEL"
                            link="/patients"
                            style={{ marginRight: 10 }}
                        />
                        <Button
                            onClick={this.submitscript}
                            title="CREATE SCRIPT"
                            className="submit btn btn-default"
                            type="submit"
                            value="Submit"
                            style={{ marginRight: 8 }}
                        />
                    </div>
                </Header>
                <Body className={styles.body} id="addScript">

                    <Form className={styles.form}>
                        <Table>
                            <tr className="checkboxRow">
                                <td>
                                    <Input
                                        type="date"
                                        label="Process On"
                                        placeholder="2018/11/12"
                                        selected={this.state.processedOn}
                                        value={this.state.processedOn}
                                        onChange={processedOn => this.setState({ processedOn })}
                                    />
                                </td>
                                <td className="check">
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="pouch"
                                            checked={this.state.pouch}
                                            onChange={this.handleCheckbox}
                                        />
                                        <label>POUCH</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px 0' }}>
                                    <Selector
                                        options={statusOptions}
                                        value={this.state.status}
                                        onSelect={status => this.setState({ status })}
                                    />
                                </td>
                                <td><Button
                                    title="DO NOT REFILL"
                                /></td></tr>
                        </Table>

                        <h4 style={{ marginLeft: 30, marginBottom: 0 }}>Patient</h4>
                        <Table className="addScriptTable">
                            <thead>
                                <th>NAME</th>
                                <th>DATE OF BIRTH</th>
                                <th>PHONE NUMBER</th>
                                <th>ADDRESS</th>
                            </thead>
                            <tr>
                                <td>{this.state.patientName}</td>
                                <td>{this.state.patientDob}</td>
                                <td>{this.state.patientPhone}</td>
                                <td>{this.state.patientAddressStreet},<br />
                                    {this.state.patientAddressCity}, {this.state.patientAddressState}, {this.state.patientAddressZipCode}</td>
                            </tr>
                        </Table>

                        <h4 style={{ marginbottom: 0, marginLeft: 35 }}>Medication</h4>
                        {this.renderProduct()}

                        <h4 style={{ marginbottom: 0, marginLeft: 35 }}>Physician</h4>
                        {this.renderPhysician()}

                        <Table>
                            <tbody>
                                <tr>
                                    <td>
                                        <h4>Prior Authorization</h4>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Selector
                                            wide
                                            label="Status"
                                            options={priorAuthOptions}
                                            onSelect={priorAuth => this.setState({ priorAuth })}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            className={styles.input}
                                            label="Transfer Pharmacy NPI"
                                            value={pharmNPI}
                                            onChange={pharmNPIChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label="Location"
                                            value={location}
                                            onChange={locationChange}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            type="date"
                                            label="Transfer Pharmacy Date"
                                            placeholder="--/--/----"
                                            value={pharmDate}
                                            onChange={pharmDateChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                        <Table>
                            <tbody>
                                <tr>
                                    <td>
                                        <Input
                                            type="date"
                                            label="Written Date"
                                            placeholder="--/--/----"
                                            value={writtenDate}
                                            onChange={writtenDateChange}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            label="Sales Code"
                                            value={salesCode}
                                            onChange={salesCodeChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            type="date"
                                            label="Bill on Date"
                                            placeholder="--/--/----"
                                            value={billOnDate}
                                            onChange={billOnDateChange}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            label="Cost"
                                            placeholder={this.state.cost}
                                            value={this.state.cost}
                                            onChange={cost => this.setState({ cost })}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label="RX Number"
                                            value={rxNumber}
                                            onChange={rxNumberChange}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            label="Primary Insurance Pay"
                                            value={primInsPay}
                                            onChange={primInsPayChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label="Diagnosis"
                                            value={this.state.diagnosis}
                                            onChange={diagnosis => this.setState({ diagnosis })}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            label="Secondary Insurance Pay"
                                            value={secInsPay}
                                            onChange={secInsPayChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label="Secondary Diagnosis"
                                            value={this.state.secDiagnosis}
                                            onChange={secDiagnosis => this.setState({ secDiagnosis })}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            label="Patient Pay"
                                            value={patientPay}
                                            onChange={patientPayChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label="# of Refills"
                                            value={refills}
                                            onChange={refillsChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label="# of Refills Remaining"
                                            value={refillsRemaining}
                                            onChange={refillsRemainingChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label="Quantity"
                                            placeholder={this.state.quantity}
                                            value={this.state.quantity}
                                            onChange={quantity => this.setState({ quantity }, this.updateCost)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label="Days Supply"
                                            value={daysSupply}
                                            onChange={daysSupplyChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label="Directions"
                                            value={directions}
                                            onChange={directionsChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                        <Table>
                            <tbody>
                                <tr>
                                    <td>
                                        <h4>Copay Assistance</h4>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Selector
                                            wide
                                            options={copayApprovalOptions}
                                            placeholder="No Status"
                                            onSelect={copayApproval => this.setState({ copayApproval })}
                                        />
                                    </td>
                                    {this.state.copayApproval === "Approved" ?
                                        <td>
                                            <Selector
                                                wide
                                                label="Copay Network"
                                                placeholder="No Network"
                                                options={copayNetworkOptions}
                                                onSelect={copayNetwork => this.setState({ copayNetwork })}
                                            />

                                        </td>
                                        : <td></td>}
                                </tr>
                            </tbody>
                        </Table>

                        <Table>
                            <tbody>
                                <tr>
                                    <h4>Shipping</h4>
                                </tr>
                                <tr>
                                    <td>
                                        <Button
                                            title="CREATE SHIPPING"
                                            className=""
                                            type=""
                                            value=""
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                        <Table>
                            <tbody>
                                <tr>
                                    <td className="check">
                                        <input
                                            type="checkbox"
                                            name="homeCare"
                                            checked={this.state.homeCare}
                                            onChange={this.handleCheckbox}
                                        />
                                        <label>Home Care</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label="Home"
                                            value={this.state.hcHome}
                                            onChange={hcHome => this.setState({ hcHome })}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            label="Phone"
                                            value={this.state.hcPhone}
                                            onChange={hcPhone => this.setState({ hcPhone })}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                    </Form>
                </Body>
            </div >
        );
    }
}



const mapStateToProps = ({ auth }) => {
    const {
        patient,
        medication,
        pharmNPI,
        location,
        pharmDate,
        writtenDate,
        salesCode,
        billOnDate,
        cost,
        rxNumber,
        primInsPay,
        diagnosis,
        secInsPay,
        secDiagnosis,
        patientPay,
        refills,
        refillsRemaining,
        quantity,
        daysSupply,
        directions,
        phone,
        email,
        loading
    } = auth

    return {
        patient,
        medication,
        pharmNPI,
        location,
        pharmDate,
        writtenDate,
        salesCode,
        billOnDate,
        cost,
        rxNumber,
        primInsPay,
        diagnosis,
        secInsPay,
        secDiagnosis,
        patientPay,
        refills,
        refillsRemaining,
        quantity,
        daysSupply,
        directions,
        phone,
        email,
        loading
    }
}

const actions = {
    patientChange,
    medicationChange,
    pharmNPIChange,
    locationChange,
    pharmDateChange,
    writtenDateChange,
    salesCodeChange,
    billOnDateChange,
    costChange,
    rxNumberChange,
    primInsPayChange,
    diagnosisChange,
    secInsPayChange,
    secDiagnosisChange,
    patientPayChange,
    refillsChange,
    refillsRemainingChange,
    quantityChange,
    daysSupplyChange,
    directionsChange,
    phoneChange,
    emailChange
}


export default connect(mapStateToProps, actions)(AddScript)