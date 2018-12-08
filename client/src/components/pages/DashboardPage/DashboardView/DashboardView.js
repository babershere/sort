import React, { Component } from 'react';
import { connect } from 'react-redux'
import qs from 'query-string'

// Components
import {
  Header,
  ButtonGroup,
} from '../../../common'

// import RepDashboard from '../RepDashboard/RepDashboard'
import AdminDashboard from '../AdminDashboard/AdminDashboard'

class DashboardView extends Component {
  componentDidMount() {
    if (!this.params.view) {
      this.graphView = 'day'
    }
  }

  get params() {
    const params = qs.parse(this.props.location.search)
    return params
  }

  set graphView(view) {
    const newParams = qs.stringify({...this.params, view})
    this.props.history.push({
      search: newParams,
    })
  }

  render() {
    const buttonOptions = [
      { option: 'Day',   value: 'day'   },
      { option: 'Week',  value: 'week'  },
      { option: 'Month', value: 'month' },
      { option: 'Year',  value: 'year'  },
    ]

    // const { me, isAdmin } = this.props

    return (
      <div>
        <Header>
          {/* {isAdmin ? (
            <h2>
              Revenue / Profit
            </h2>
          ) : ( */}
            <h2>
              Dashboard
            </h2>
          {/* )} */}

          <ButtonGroup
            options={buttonOptions}
            onPress={view => this.graphView = view}
            selected={this.params.view}
          />
        </Header>

        {/* {!me ? (
          null
        ) : isAdmin ? ( */}
          <AdminDashboard />
        {/* ) : ( */}
          {/* <RepDashboard /> */}
        {/* )} */}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const {
    isAdmin,
    me,
  } = auth

  return {
    isAdmin,
    me,
  }
}

export default connect(mapStateToProps, null)(DashboardView);
