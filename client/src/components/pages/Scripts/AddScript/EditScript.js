import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment';

import { Selector, Button, Header, Input, Body, Table, Form, } from '../../../common'
import styles from './EditScript.css';

class EditScript extends Component {

    constructor(props) {
        super(props)
        this.state = {
            processedOn: '',
            transNPI: '',
            physicians: '',
            physicianOptions: [],
            medicationVal: '',
            patientSearch: false,
            physSearch: false,
            prodSearch: false
        }

        this.handleCheckbox = this.handleCheckbox.bind(this);
    }


    componentDidMount() {
        if (this.props.match.params.scriptId) {
            const loginToken = window.localStorage.getItem("token");
            axios.get('/api/scripts/search?scriptId=' + this.props.match.params.scriptId, { headers: { "Authorization": "Bearer " + loginToken } })
                .then((resp) => {
                    let script = resp.data.response[0];
                    this.setState({
                        id: script.id,
                        processedOn: script.processedOn,
                        pouch: script.pouch,
                        patient: script.patient,
                        status: script.status,
                        priorAuth: script.priorAuth,
                        location: script.location,
                        transNPI: script.transNPI,
                        transDate: script.transDate,
                        writtenDate: script.writtenDate,
                        salesCode: script.salesCode,
                        billOnDate: script.billOnDate,
                        cost: script.cost,
                        rxNumber: script.rxNumber,
                        diagnosis: script.diagnosis,
                        secDiagnosis: script.secDiagnosis,
                        primInsPay: script.primInsPay,
                        secInsPay: script.secInsPay,
                        patientPay: script.patientPay,
                        cost: script.cost,
                        refills: script.refills,
                        refillsRemaining: script.refillsRemaining,
                        quantity: script.quantity,
                        daysSupply: script.daysSupply,
                        directions: script.directions,
                        copayApproval: script.copayApproval,
                        copayNetwork: script.copayNetwork,
                        networkPay: script.networkPay,
                        shipOn: script.shipOn,
                        deliveryMethod: script.deliveryMethod,
                        trackNum: script.trackNum,
                        ETA: script.ETA,
                        paymentOption: script.paymentOption,
                        homeCare: script.homeCare,
                        hcHome: script.hcHome,
                        hcPhone: script.hcPhone,
                        patientId: script.PatientId,
                        patientName: script.Patient.firstName + " " + script.Patient.lastName,
                        physicianName: script.Physician.firstName + " " + script.Physician.lastName,
                        productName: script.Product.name,
                        physicianId: script.PhysicianId,
                        productId: script.ProductId,
                        productCost: script.Product.cost,
                        productPackageSize: script.Product.packageSize
                    }, this.calcTabletCost)
                }).catch((err) => {
                    console.error(err)
                })
        }

        const loginToken = window.localStorage.getItem("token");

        axios.get('/api/patients/search', { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                this.setState({
                    patients: resp.data.response
                })
            }).catch((err) => {
                console.error(err)
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

    onChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    renderCopayApproval() {

        const copayApprovalOptions = [
            '--',
            'Approved',
            'Denied'
        ]

        const copayNetworkOptions = [
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


        if (this.state.copayApproval === "Approved") {
            return (
                <Table>
                    <thead><h3>COPAY ASSISTANCE</h3></thead>

                    <tr>
                        <td>
                            <Selector
                                label="Status"
                                options={copayApprovalOptions}
                                selected={this.state.copayApproval}
                                value={this.state.copayApproval}
                                onSelect={copayApproval => this.setState({ copayApproval })}
                            />
                        </td>

                        <td>
                            <Selector
                                label="Copay Network"
                                options={copayNetworkOptions}
                                selected={this.state.copayNetwork}
                                value={this.state.copayNetwork}
                                onSelect={copayNetwork => this.setState({ copayNetwork })}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <Input
                                label="Network Pay"
                                placeholder={this.state.networkPay}
                                value={this.state.networkPay}
                                onChange={networkPay => this.setState({ networkPay })}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <Input
                                label="Patient Pay"
                                placeholder={this.state.patientPay}
                                value={this.state.patientPay}
                                onChange={patientPay => this.setState({ patientPay })}
                            />
                        </td>
                    </tr>
                </Table>
            )
        } else if (this.state.copayApproval === "Denied") {
            return (
                <Table>
                    <thead><h3>COPAY ASSISTANCE</h3></thead>
                    <tr>
                        <td>
                            <Selector
                                label="Status"
                                options={copayApprovalOptions}
                                selected={this.state.copayApproval}
                                value={this.state.copayApproval}
                                onSelect={copayApproval => this.setState({ copayApproval })}

                            />
                        </td>
                    </tr>
                </Table>
            )
        } else {
            return (
                <Table>
                    <thead><h3>COPAY ASSISTANCE</h3></thead>
                    <tr>
                        <td>
                            <Selector
                                label="Status"
                                options={copayApprovalOptions}
                                selected={this.state.copayApproval}
                                value={this.state.copayApproval}
                                onSelect={copayApproval => this.setState({ copayApproval }, this.handleCopayApproval)}
                            />
                        </td>
                    </tr>
                </Table>
            )
        }
    }

    handleCheckbox(event) {
        const target = event.target
        const name = target.name;

        if (target.checked === true) {
            this.setState({
                [name]: target.checked
            })
        } else if (target.checked === false) {
            this.setState({
                [name]: target.checked
            })
        }
    }

    searchPatients() {
        this.setState({
            patientSearch: true
        })
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/patients/search?name=' + this.state.patientName, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                this.setState({
                    patients: resp.data.response
                })
            }).catch((err) => {
                console.error(err)
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

    renderPatientColumn() {
        return (
            <div style={{ marginLeft: 35 }}>
                <Table className="addScriptSearch">
                    <thead>
                        <th>NAME</th>
                        <th>DATE OF BIRTH</th>
                        <th>PHONE NUMBER</th>
                        <th>ADDRESS</th>
                    </thead>
                    {this.state.patients.map(this.renderPatientRow.bind(this))}
                </Table>
            </div>
        )
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

    renderPatientRow(patient) {
        return (
            <tr style={{ 'cursor': 'pointer' }} value={patient.id} onClick={() => this.setPatient(patient.id)}>
                <td>{patient.firstName} {patient.lastName}</td>
                <td>{patient.dob}</td>
                <td>{patient.phone}</td>
                <td>{patient.addressStreet}<br />
                    {patient.addressCity}, {patient.addressState}, {patient.addressZipCode}</td>
            </tr>
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

    setPatient(value) {
        this.setState({
            patientSearch: false,
            patientId: value,
            setPatient: 'set'
        }, this.getPatient)
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

    getPatient() {
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/patients/search?patientId=' + this.state.patientId,
            { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                let patient = resp.data.response[0];
                this.setState({
                    patientName: patient.firstName + " " + patient.lastName,
                })
            }).catch((error) => {
                console.error(error);
            })
    }

    getPhysician() {
        const loginToken = window.localStorage.getItem("token");
        axios.get('/api/physicians/search?physicianId=' + this.state.physicianId,
            { headers: { "Authorization": "Bearer " + loginToken } })
            .then((resp) => {
                let physician = resp.data.response[0];
                this.setState({
                    physicianName: physician.firstName + " " + physician.lastName,
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
                    productPackageSize: product.packageSize,
                    quantity: product.packageSize
                }, this.calcTabletCost)
            }).catch((error) => {
                console.error(error);
            })
    }

    calcTabletCost() {
        console.log(this.state.productCost, this.state.quantity)
        this.setState({
            tabletCost: this.state.productCost.replace(",","") / this.state.productPackageSize.replace(",","")
        }, this.updateCost)
    }

    updateCost() {
        console.log(this.state.tabletCost, this.state.quantity)
        this.setState({
            cost: this.state.tabletCost * this.state.quantity.replace(",","")
        }, this.roundtoNearestCent)
    }
    
    roundtoNearestCent() {
        this.setState({
            cost: Math.floor(this.state.cost * 100) / 100
        })
    }

    updateScript = (event) => {
        event.preventDefault();
        const loginToken = window.localStorage.getItem("token");
        let data = new FormData();
        let ifParams = '';
        if (this.state.shipOn) ifParams += '&shipOn=' + this.state.shipOn;
        if (this.state.ETA) ifParams += '&ETA=' + this.state.ETA;
        if (this.state.deliveryMethod) ifParams += '&deliveryMethod=' + this.state.deliveryMethod;
        if (this.state.trackNum) ifParams += '&trackNum=' + this.state.trackNum;
        if (this.state.networkPay) ifParams += '&networkPay=' + this.state.networkPay
        if (this.state.paymentOption) ifParams += '&paymentOption=' + this.state.paymentOption

        axios.put('/api/scripts/update?id=' + this.state.id + '&patientId=' + this.state.patientId + '&physicianId=' + this.state.physicianId + '&productId=' + this.state.productId + '&processedOn=' + this.state.processedOn + '&pouch=' + this.state.pouch +
            '&status=' + this.state.status + '&priorAuth=' + this.state.priorAuth + '&location=' + this.state.location + '&transNPI=' + this.state.transNPI + '&transDate=' + this.state.transDate +
            '&writtenDate=' + this.state.writtenDate + '&salesCode=' + this.state.salesCode + '&billOnDate=' + this.state.billOnDate + '&cost=' + this.state.cost + '&rxNumber=' +
            this.state.rxNumber + '&primInsPay=' + this.state.primInsPay + '&diagnosis=' + this.state.diagnosis + '&secInsPay=' + this.state.secInsPay + '&secDiagnosis=' + this.state.secDiagnosis + '&patientPay=' + this.state.patientPay + '&refills=' + this.state.refills + '&refillsRemaining=' +
            this.state.refillsRemaining + '&quantity=' + this.state.quantity + '&daysSupply=' + this.state.daysSupply + '&directions=' + this.state.directions + '&copayApproval=' + this.state.copayApproval + '&copayNetwork=' +
            this.state.copayNetwork + '&homeCare=' + this.state.homeCare + '&hcHome=' + this.state.hcHome + '&hcPhone=' + this.state.hcPhone + ifParams,
            data, { headers: { "Authorization": "Bearer " + loginToken } })
            .then((data) => {
                this.props.history.push(`/scripts/${this.props.match.params.scriptId}`);
            }).catch((error) => {
                console.error(error);
            })
    }


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

        const priorAuthOptions = [
            'Approved',
            'Denied',
            'Payor Restriction',
            'Limited Distribution'
        ]

        const deliveryOptions = [
            'UPS',
            'Fedex',
            'GSO',
            'Deliver-it',
            'US Postal',
            'Delivery Driver'
        ]

        const paymentOptions = [
            'Collect on Delivery',
            'Mail in Check',
            'Credit Card',
            'No Copay'
        ]

        return (
            <div>
                <Header>
                    <h2>Edit Script</h2>
                    <Button
                        onClick={this.updateScript}
                        title="SAVE"
                        className="submit btn btn-default"
                        type="submit"
                        value="Submit"
                        style={{ marginRight: 8 }}
                    />
                </Header>
                <Body className={styles.body} id="editScript">

                    <Form className={styles.form}>
                        <Table>
                            <thead><h3>GENERAL INFORMATION</h3></thead>
                            <tr>
                                <td>
                                    <Input
                                        type="date"
                                        label="Processed On"
                                        value={this.state.processedOn}
                                        onChange={processedOn => this.setState({ processedOn })}
                                    />
                                </td>
                                <td className="check">
                                    <div>
                                        <input
                                            name="pouch"
                                            className="checkbox"
                                            type="checkbox"
                                            checked={this.state.pouch}
                                            onChange={this.handleCheckbox}
                                        />
                                        <label>POUCH</label>
                                    </div>
                                </td>
                                <td>
                                    <Button
                                        title="DO NOT REFILL"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        placeholder={this.state.patientName}
                                        label="Patient"
                                        value={this.state.patientName}
                                        onChange={patientName => this.setState({ patientName }, this.searchPatients)}
                                    />
                                    {this.state.patientSearch ?
                                        <div>
                                            {this.renderPatientColumn()}
                                        </div>
                                        :
                                        <div></div>}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label="Physician"
                                        value={this.state.physicianName}
                                        onChange={physicianName => this.setState({ physicianName }, this.searchPhysicians)}
                                    />
                                    {this.state.physSearch ?
                                        <div>
                                            {this.renderPhysicianColumn()}
                                        </div>
                                        :
                                        <div></div>}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label="Medication"
                                        value={this.state.productName}
                                        onChange={productName => this.setState({ productName }, this.searchProducts)}
                                    />
                                    {this.state.prodSearch ?
                                        <div>
                                            {this.renderProductColumn()}
                                        </div>
                                        :
                                        <div></div>}
                                </td>
                                <td>
                                    <Selector
                                        options={statusOptions}
                                        selected={this.state.status}
                                        onSelect={status => this.setState({ status })}
                                    />
                                </td>
                            </tr>
                        </Table>

                        <Table>
                            <thead><h3>PRIOR AUTHORIZATION</h3></thead>
                            <tr>
                                <td>
                                    <Selector
                                        options={priorAuthOptions}
                                        selected={this.state.priorAuth}
                                        onSelect={priorAuth => this.setState({ priorAuth })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label="Location"
                                        value={this.state.location}
                                        onChange={location => this.setState({ location })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label="Transfer Pharmacy NPI"
                                        placeholder={this.state.transNPI}
                                        value={this.state.transNPI}
                                        onChange={transNPI => this.setState({ transNPI })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        type="date"
                                        label="Transfer Pharamcy Date"
                                        placeholder={this.state.transDate}
                                        value={this.state.transDate}
                                        onChange={transDate => this.setState({ transDate })}
                                    />
                                </td>
                            </tr>
                        </Table>

                        <Table>
                            <thead><h3>PROCESSING</h3></thead>
                            <tr>
                                <td>
                                    <Input
                                        type="date"
                                        label="Written Date"
                                        placeholder={this.state.writtenDate}
                                        value={this.state.writtenDate}
                                        onChange={writtenDate => this.setState({ writtenDate })}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label="Sales Code"
                                        placeholder={this.state.salesCode}
                                        value={this.state.salesCode}
                                        onChange={salesCode => this.setState({ salesCode })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        type="date"
                                        label="Bill On"
                                        placeholder={this.state.billOnDate}
                                        value={this.state.billOnDate}
                                        onChange={billOnDate => this.setState({ billOnDate })}
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
                                        placeholder={this.state.rxNumber}
                                        value={this.state.rxNumber}
                                        onChange={rxNumber => this.setState({ rxNumber })}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label="Primary Insurance Pay"
                                        placeholder={this.state.primInsPay}
                                        value={this.state.primInsPay}
                                        onChange={primInsPay => this.setState({ primInsPay })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label="Diagnosis"
                                        placeholder={this.state.diagnosis}
                                        value={this.state.diagnosis}
                                        onChange={diagnosis => this.setState({ diagnosis })}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label="Secondary Insurance Pay"
                                        placeholder={this.state.secInsPay}
                                        value={this.state.secInsPay}
                                        onChange={secInsPay => this.setState({ secInsPay })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label="Secondary Diagnosis"
                                        placeholder={this.state.secDiagnosis}
                                        value={this.state.secDiagnosis}
                                        onChange={secDiagnosis => this.setState({ secDiagnosis })}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label="Patient Pay"
                                        placeholder={this.state.patientPay}
                                        value={this.state.patientPay}
                                        onChange={patientPay => this.setState({ patientPay })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label="Refill #"
                                        placeholder={this.state.refills}
                                        value={this.state.refills}
                                        onChange={refills => this.setState({ refills })}
                                    />
                                </td>
                            </tr>
                            {this.state.status === 'Shipped' || this.state.status === 'Done' ?
                                <tr>
                                    <td className="refillsRemaining">
                                        <Input
                                            style={{ 'display': 'inline-block', paddingRight: 40 }}
                                            label="Refills Remaining"
                                            placeholder={this.state.refillsRemaining}
                                            value={this.state.refillsRemaining}
                                            onChange={refillsRemaining => this.setState({ refillsRemaining })}
                                        />
                                        </td></tr>

                                : <tr>
                                    <td className="refillsRemaining">
                                        <Input
                                            style={{ 'display': 'inline-block', paddingRight: 40 }}
                                            label="Refills Remaining"
                                            placeholder={this.state.refillsRemaining}
                                            value={this.state.refillsRemaining}
                                            onChange={refillsRemaining => this.setState({ refillsRemaining })}
                                        />
                                    </td>
                                </tr>
                            }



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
                                        placeholder={this.state.daysSupply}
                                        value={this.state.daysSupply}
                                        onChange={daysSupply => this.setState({ daysSupply })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label="Directions"
                                        placeholder={this.state.directions}
                                        value={this.state.directions}
                                        onChange={directions => this.setState({ directions })}
                                    />
                                </td>
                            </tr>
                        </Table>

                        {this.renderCopayApproval()}

                        <Table>
                            <thead><h3>SHIPPING</h3></thead>
                            <tr>
                                <td>
                                    <Input
                                        type="date"
                                        label="Ship On"
                                        placeholder={this.state.shipOn}
                                        value={this.state.shipOn}
                                        onChange={shipOn => this.setState({ shipOn })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Selector
                                        label="Delivery Method"
                                        options={deliveryOptions}
                                        selected={this.state.deliveryMethod}
                                        value={this.state.deliveryMethod}
                                        onSelect={deliveryMethod => this.setState({ deliveryMethod })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label="Tracking Number"
                                        placeholder={this.state.trackNum}
                                        value={this.state.trackNum}
                                        onChange={trackNum => this.setState({ trackNum })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        type="date"
                                        label="ETA"
                                        placeholder={this.state.ETA}
                                        value={this.state.ETA}
                                        onChange={ETA => this.setState({ ETA })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Selector
                                        label="Payment Option"
                                        options={paymentOptions}
                                        selected={this.state.paymentOption}
                                        value={this.state.paymentOption}
                                        onSelect={paymentOption => this.setState({ paymentOption })}
                                    />
                                </td>
                            </tr>
                        </Table>

                        <Table>
                            <thead><h3>HOME CARE</h3></thead>
                            <tr>
                                <td className="check">
                                    <input
                                        name="homeCare"
                                        className="checkbox"
                                        type="checkbox"
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
                                        placeholder={this.state.hcHome}
                                        value={this.state.hcHome}
                                        onChange={hcHome => this.setState({ hcHome })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label="Phone"
                                        placeholder={this.state.hcPhone}
                                        value={this.state.hcPhone}
                                        onChange={hcPhone => this.setState({ hcPhone })}
                                    />
                                </td>
                            </tr>
                        </Table>

                    </Form>
                </Body>
            </div >
        );
    }
}



export default EditScript;