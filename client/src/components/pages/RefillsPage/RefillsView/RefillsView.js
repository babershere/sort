import React, { Component } from 'react';

import { ButtonGroup } from 'react-bootstrap';
import { FaxModal } from '../../../shared'
import Moment from 'react-moment'

import axios from 'axios'

import {
  Table,
  Button,
  Header,
  ActionBox,
  SearchBar,
  Selector
} from '../../../common'

import styles from './RefillsView.css'

class RefillsView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue: 'Any',
      refillOK: true,
      specialization: '',
      fax: false
    }

    this.handleChange = this.handleChange.bind(this);
  }

  openFax() {
    this.setState({
      faxModal: {},
    })
  }

  openFaxModal(e) {
    this.setState({
      scriptValue: e.target.value,
      fax: true,
    }, this.openFax)
    e.stopPropagation();
  }

  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");

    axios.get('/api/scripts/search?status=Refill', { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          refills: resp.data.response,
          refillNum: resp.data.response.length
        })
      }).catch((err) => {
        console.error(err)
      })

    axios.get('/api/scripts/search?status=Renew', { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          renewals: resp.data.response,
          renewNum: resp.data.response.length
        })

      }).catch((err) => {
        console.error(err)
      })
  }

 

  closeModal() {
    this.setState({
      faxModal: null
    })
  }

  submitSearch() {
    const loginToken = window.localStorage.getItem("token");
    let searchParams = ''
    if (this.state.refillOK) {
      searchParams = 'Refill'
    } else {
      searchParams = 'Renew'
    }
    // searchParams += '&specialization=' + this.state.specialization
    axios.get('/api/scripts/search?status=' + searchParams, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        this.setState({
          refills: resp.data.response
        })
      }).catch((err) => {
        console.error(err)
      })
  }


  handleChange(e) {
    const key = e.target.value; // e.g. 'A'
    if (key === 'refill') { this.setState({ refillOK: true }, this.submitSearch) }
    else if (key === 'renew') { this.setState({ refillOK: false }, this.submitSearch) }
  }



  renderTableHead() {
    return (
      <thead>
        {this.state.refillOK ?
          <tr>
            <th>Process On</th>
            <th>Physician</th>
            <th>Patient</th>
            <th>Medication</th>
            <th>Rx Number</th>
          </tr>
          :
          <tr>
            <th>Refill On</th>
            <th>Physician</th>
            <th>Patient</th>
            <th>Medication</th>
            <th>Rx Number</th>
            <th>Dob</th>
            <th>Last Faxed</th>
          </tr>
        }
      </thead>
    )
  }

  renderTableBody() {
    if (this.state.refillOK) {
      return (
        <tbody>
          {this.state.refills.map(this.renderTableRow.bind(this))}
        </tbody>
      )
    } else {
      return (
        <tbody>
          {this.state.renewals.map(this.renderTableRow.bind(this))}
        </tbody>

      )
    }
  }

  handleClick(value) {
    window.location = `/scripts/${value}`
  }

  renderTableRow(script) {
    if (this.state.refillOK) {
      return (
        <tr value={script.id} onClick={() => this.handleClick(script.id)}>
          <td><Moment format="MM/DD/YYYY">{script.processedOn}</Moment></td>
          <td>{script.Physician.firstName} {script.Physician.lastName}</td>
          <td>{script.Patient.firstName} {script.Patient.lastName}</td>
          <td>{script.Product.name}</td>
          <td>{script.rxNumber}</td>
        </tr>
      )
    }
    else {
      return (
        <tr value={script.id} onClick={() => this.handleClick(script.id)}>
          <td>
          <Button
            value={script.id}
            icon="print"
            style={{padding: 2, 'min-width': '100px'}}
            onClick={this.openFaxModal.bind(this)}
            title="FAX"
          />
          &nbsp;&nbsp;&nbsp;<Moment format="MM/DD/YYYY">{script.processedOn}</Moment></td>
          <td>{script.Physician.firstName} {script.Physician.lastName}</td>
          <td>{script.Patient.firstName} {script.Patient.lastName}</td>
          <td>{script.Product.name}</td>
          <td>{script.rxNumber}</td>
          <td>{script.Patient.dob}</td>
          <td></td>
        </tr>
      )
    }
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
    const { searchValue } = this.state

    const reps = [
      'All Reps'
    ]

    const specOptions = [
      'All Specializations',
      'Internal Medicine',
      'Home Health',
      'Hospice',
      'Skilled Nursing Center',
      'Assisted Living',
      'Hospital',
      'Residential Living',
      'Oncology',
      'Rheumatology',
      'Dermatology',
      'Nephrology',
      'Neurology',
      'Gastroenterology',
      'Allergy',
      'Infectious Disease',
      'Transplant',
      'Orthopedic',
      'Endocrinology',
      'Urology',
      'Cardiology',
      'Hepatology',
      'Pulmonology'
    ]


    const {
      state,
      className,
      onCloseModal,
      onCreateNote,
    } = this.props

    const {
      faxModal
    } = this.state

    if (this.state.refills) {
      var refillList = this.state.refills.sort(function(a,b) { 
        return new Date(a.processedOn).getTime() - new Date(b.processedOn).getTime() 
    });
      var refillList = this.state.refills.map(function (item, i) {
        return (
          <div key={i}>
          </div>
        )
      })
    }
    else {
      return <div>
        <p></p>
      </div>
    }

    if (this.state.renewals) {
      var renewList = this.state.renewals.sort(function(a,b) { 
        return new Date(a.processedOn).getTime() - new Date(b.processedOn).getTime() 
    });
      var renewList = this.state.renewals.map(function (item, i) {
        return (
          <div key={i}>
          </div>
        )
      })
    }
    else {
      return <div>
        <p></p>
      </div>
    }

    return (
      <div className={styles.app}>
        <Header>
          <h2>
            Refills
          </h2>
        </Header>
        <div className="body">
          <ActionBox>
            <div className="main">
              <ButtonGroup
                className="scriptSearch"
                value={this.state.value}
                onClick={this.handleChange}
              >
                <label>Type</label>
                {this.state.refillNum ?
                <Button className="first" value='refill' autofocus='true' >
                
                OK to Refill ({this.state.refillNum})
                </Button>
                :
                <Button className="first" value='refill' autofocus='true' >
                OK to Refill
                
                </Button>
                }
                
                {this.state.renewNum ?
                <Button className="last" value='renew'>
                
                Refill Request ({this.state.renewNum})
           </Button>
                :
                <Button className="last" value='renew'>
               Refill Request
                </Button>}
              </ButtonGroup>

            </div>
          </ActionBox>

          <ActionBox>
            <div className="main">
              <SearchBar
                selected={searchValue}
                onSelect={searchValue => this.setState({ searchValue })}
                label="Search"
                placeholder="Search..."
              />
              <Selector
                wide
                label="Rep"
                options={reps}
              />
              <Selector
                wide
                label="Specialization"
                options={specOptions}
                onSelect={specialization => this.setState({ specialization }, this.submitSearch)}
              />
            </div>
          </ActionBox>

          {this.renderTable()}
          {refillList}
          {renewList}

      <div className="faxModal">
        <FaxModal
          content={faxModal}
          onClickAway={() => this.closeModal()}
          onSubmit={onCreateNote}
          state={this.state}
          props={this.props}
        />
        </div>

        </div>
      </div>
    );
  }
}

export default RefillsView;
