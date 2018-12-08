import React from 'react'

import { ActionBox, Button as Search, Input, SearchBar, Selector } from '../../../../common'
import { Button, ButtonGroup, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import axios from 'axios'

class ScriptSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      RX: false,
      HC: false,
      special: false,
      SP: false,
      thirdParty: false,
      textSearch: '',
      statusReceived: '',
      statusReview: '',
      statusPriorAuth: '',
      statusProcess: '',
      statusCopayAssistance: '',
      statusSchedule: '',
      statusQA: '',
      statusFill: '',
      statusShipped: '',
      statusDone: '',
      statusCancelled: '',
      statusRefill: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.statusQuery = this.statusQuery.bind(this);
  }

  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/user/search?role=Rep', { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);
        this.setState({
          reps: resp.data.response
        })
      }).catch((err) => {
        console.error(err)
      })
  }


  handleClick(e) {
    this.setState({ special: e.includes(1) }, this.submitSearch)
  }

  statusQuery(e) {
    this.setState({ statusReceived: e.includes(1) }, this.submitSearch)
    this.setState({ statusReview: e.includes(2) }, this.submitSearch)
    this.setState({ statusPriorAuth: e.includes(3) }, this.submitSearch)
    this.setState({ statusProcess: e.includes(4) }, this.submitSearch)
    this.setState({ statusCopayAssistance: e.includes(5) }, this.submitSearch)
    this.setState({ statusSchedule: e.includes(6) }, this.submitSearch)
    this.setState({ statusQA: e.includes(7) }, this.submitSearch)
    this.setState({ statusFill: e.includes(8) }, this.submitSearch)
    this.setState({ statusShipped: e.includes(9) }, this.submitSearch)
    this.setState({ statusDone: e.includes(10) }, this.submitSearch)
    this.setState({ statusCancelled: e.includes(11) }, this.submitSearch)
    this.setState({ statusRefill: e.includes(12) }, this.submitSearch)
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }


  enterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) { //13 is the enter keycode
      this.submitSearch();
    }
  }

  handleChange(e) {
    const key = e.target.value; // e.g. 'A'
    if (key === 'RX') { this.setState({ RX: true, HC: false }, this.submitSearch) }
    else if (key === 'HC') { this.setState({ RX: false, HC: true }, this.submitSearch) }
    else if (key === 'SP') { this.setState({ SP: true, thirdParty: false }, this.submitSearch) }
    else if (key === 'Third Party') { this.setState({ SP: false, thirdParty: true }, this.submitSearch) }
  }


  submitSearch = (event) => {
    console.log(this.state.textSearch);
    let searchParams = "?patient=null";
    let status = "";
    if (this.state.RX) searchParams += '&homeCare=0'
    if (this.state.HC) searchParams += '&homeCare=1'
    if (this.state.special) searchParams += '&salesCode=M'
    if (this.state.SP) searchParams += '&location=' + ""
    if (this.state.thirdParty) searchParams += '&location!=' + ""
    if (this.state.textSearch) searchParams += '&textSearch=' + this.state.textSearch
    if (this.state.rep) searchParams += '&rep=' + this.state.rep
    if (this.state.specialization) searchParams += '&specialization=' + this.state.specialization
    if (this.state.statusReceived) status += ',Received'
    if (this.state.statusReview) status += ',Review'
    if (this.state.statusPriorAuth) status += ',Prior Auth'
    if (this.state.statusProcess) status += ',Process'
    if (this.state.statusCopayAssistance) status += ',Copay Assistance'
    if (this.state.statusSchedule) status += ',Schedule'
    if (this.state.statusQA) status += ',QA'
    if (this.state.statusFill) status += ',Fill'
    if (this.state.statusShipped) status += ',Shipped'
    if (this.state.statusDone) status += ',Done'
    if (this.state.statusCancelled) status += ',Cancelled'
    if (this.state.statusRefill) status += ',Refill'
    var statusFilter = status.substring(1);
    if (status) searchParams += '&status=' + statusFilter
    this.props.searchFunc(searchParams);
  }


  render() {

    const SpecializationOptions = [
      '',
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

    if (this.state.reps) {
      const repOptions = [
        {
          key: '',
          value: '',
          display: '--',
        },
        ...this.state.reps.map(rep => ({
          key: rep.id,
          value: rep.name,
          display: rep.name,
        })),
      ]


      return (
        <div className="scriptSearch">

          <ActionBox>
            <div className='main'>

              <ButtonGroup
                className="scriptSearch"
                value={this.state.value}
                onClick={this.handleChange}
              >
                <label>Type</label>
                <Button className="first" value='RX'>RX</Button>
                <Button className="last" value='HC'>HC</Button>
              </ButtonGroup>

              <ToggleButtonGroup className="scriptSearch" type="checkbox" onChange={this.handleClick}>
                <label>Special</label>
                <ToggleButton className='single' value={1}>Medicare</ToggleButton>
              </ToggleButtonGroup>

              <ButtonGroup
                className="scriptSearch"
                value={this.state.value}
                onClick={this.handleChange}
              >
                <label>Type</label>
                <Button className="first" value='SP'>SP</Button>
                <Button className="last" value='Third Party'>Third Party</Button>
              </ButtonGroup>

              <Input
                className="searchBar"
                style={{ 'width': '325px', 'flex': 'initial' }}
                value={this.state.textSearch}
                onChange={textSearch => this.setState({ textSearch })}
                label="Search"
                placeholder="Enter medication name or NDC"
                onKeyPress={this.enterPressed.bind(this)}
              />
              
              <Search
                className='search'
                search
                icon="search"
                onClick={this.submitSearch}
              />

            </div>
          </ActionBox>
          <ActionBox>
            <div className="main">
              <Selector
                label="Rep"
                options={repOptions}
                value={this.state.rep}
                onSelect={rep => this.setState({ rep }, this.submitSearch)}
              />
              <Selector
                label="Specialization"
                options={SpecializationOptions}
                selected={this.state.specialization}
                onSelect={specialization => this.setState({ specialization }, this.submitSearch)}
              />
            </div>
          </ActionBox>
          <ActionBox>
            <div className="main" style={{ paddingTop: 0 }}>
              <ToggleButtonGroup className="scriptSearch" type="checkbox" onChange={this.statusQuery}>
                <label>Type</label>
                <ToggleButton className='first' value={1}>Received</ToggleButton>
                <ToggleButton value={2}>Review</ToggleButton>
                <ToggleButton value={3}>Prior Auth</ToggleButton>
                <ToggleButton value={4}>Process</ToggleButton>
                <ToggleButton value={5}>Copay Assistance</ToggleButton>
                <ToggleButton value={6}>Schedule</ToggleButton>
                <ToggleButton value={7}>QA</ToggleButton>
                <ToggleButton value={8}>Fill</ToggleButton>
                <ToggleButton value={9}>Shipped</ToggleButton>
                <ToggleButton value={10}>Done</ToggleButton>
                <ToggleButton value={11}>Cancelled</ToggleButton>
                <ToggleButton className='last' value={12}>Refill</ToggleButton>

              </ToggleButtonGroup>

            </div>
          </ActionBox>
        </div>
      )
    } else { return (<div></div>) }
  }
}


export default ScriptSearch;