import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import TopNav from './components/TopNav/TopNav'
import PrivateRoute from './components/ProtectedRoute';
// import Main from './components/pages/Main'
import Signup from './components/Signup'
import Login from './components/pages/LoginMain/LoginMain';
import ScriptsPage from './components/pages/Scripts/ScriptsPage';
import ScriptView from './components/pages/Scripts/ScriptView/ScriptView'
import ScriptViewPhysician from './components/pages/Scripts/ScriptView_Physician/ScriptViewPhysician'

import AddScript from './components/pages/Scripts/AddScript/AddScript'
import EditScript from './components/pages/Scripts/AddScript/EditScript'
import Attachment from './components/pages/Scripts/ScriptView/Attachment'
import PatientAttachment from './components/pages/PatientsPage/PatientView/PatientAttachment'

import PatientsPage from './components/pages/PatientsPage/PatientsPage'
import AddPatient from './components/pages/PatientsPage/AddPatient/AddPatient'
import EditPatient from './components/pages/PatientsPage/AddPatient/EditPatient'
import PatientView from './components/pages/PatientsPage/PatientView/PatientView'
import PatientViewPhysician from './components/pages/PatientsPage/PatientView_Physician/PatientViewPhysician'
// import PatientFile from './components/pages/PatientsPage/PatientView/Tabs/PatientFile'
import DashboardPage from './components/pages/DashboardPage/DashboardPage'
import AgendaPage from './components/pages/AgendaPage/AgendaPage'
import PhysiciansPage from './components/pages/PhysiciansPage/PhysiciansPage'
import AddPhysician from './components/pages/PhysiciansPage/AddPhysician/AddPhysician'
import EditPhysician from './components/pages/PhysiciansPage/AddPhysician/EditPhysician'
import PhysicianAccess from './components/pages/PhysiciansPage/PhysicianAccess/PhysicianAccess'
import PhysicianView from './components/pages/PhysiciansPage/PhysicianView/PhysicianView'
import RefillsPage from './components/pages/RefillsPage/RefillsPage'
import ProductsPage from './components/pages/ProductsPage/ProductsPage'
import AddProduct from './components/pages/ProductsPage/AddProduct/AddProduct'
import EditProduct from './components/pages/ProductsPage/AddProduct/EditProduct'
import TeamPage from './components/pages/TeamPage/TeamPage'
import AddMember from './components/pages/TeamPage/AddMember/AddMember'
import EditMember from './components/pages/TeamPage/AddMember/EditMember'
import Profile from './components/pages/TeamPage/Profile/Profile'

// import MemberView from './components/pages/TeamPage/MemberView/MemberView'


import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import { routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware } from 'redux'
// History
import createHistory from 'history/createBrowserHistory'
// import restricted from './components/restricted'


import './App.css';

//----Rey---//
//Chat
// import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';

// import 'react-chat-widget/lib/styles.css';

import  ChatWidget from './components/shared/ChatWidget/ChatWidget';
//------//


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userRole: ''
    }
  }



  componentWillMount() {

    const loginToken = window.localStorage.getItem("token");
    if (loginToken) {
      var decoded = jwt_decode(loginToken);
      axios.get('../api/user/search?userId=' + decoded.id, { headers: { "Authorization": "Bearer " + loginToken } })
        .then((resp) => {
          this.setState({
            userRole: resp.data.response[0].role,
          });
        }).catch((error) => {
          console.error(error);
        })
    } else {
      return;
    }
  }

  render() {

    const history = createHistory()
    const historyMiddleware = routerMiddleware(history)

    const store = createStore(
      reducers,
      {},
      applyMiddleware(historyMiddleware, ReduxThunk),
    )

    const ThePatientsPage = (props) => {
      return (
        <PatientsPage
          state={this.state}
          {...props}
        />
      );
    }

    const ThePhysiciansPage = (props) => {
      return (
        <PhysiciansPage
          state={this.state}
          {...props}
        />
      );
    }

    const TheTeamPage = (props) => {
      return (
        <TeamPage
          state={this.state}
          {...props}
        />
      );
    }
    return (
      <Provider store={store}>
        <Router>
          <div>
            <TopNav />
            {this.state.userRole === "" ? <div></div> :  <ChatWidget/>}
            <div className="container">
              <Switch>
                <Route
                  path="/login"
                  component={Login}
                />
              
                <Route
                  path="/signup"
                  component={Signup}
                />
                {/* <Route
              path="/"
              render={restricted(Main, 'auth')}
            /> */}


                <Route exact path="/" component={Login} />
                <Route exact path="/scripts" component={ScriptsPage} />
                <Route exact path="/scripts/add" component={AddScript} />
                {this.state.userRole === "Admin" ?
                  <Route exact path="/scripts/:scriptId" component={ScriptView} />
                  : <Route exact path="/scripts/:scriptId" component={ScriptViewPhysician} />}
                <Route exact path="/scripts/:scriptId/edit" component={EditScript} />

                <Route exact path="/patients" render={ThePatientsPage} />

                <Route exact path="/patients/add" component={AddPatient} />
                <Route exact path="/patients/:patientId/edit" component={EditPatient} />
                {this.state.userRole === "Admin" || this.state.userRole === "Rep" ?
                  <Route exact path="/patients/:patientId" component={PatientView} />
                  : <Route exact path="/patients/:patientId" component={PatientViewPhysician} />}
                <Route exact path="/dashboard" component={DashboardPage} />
                <Route exact path="/physicians" component={ThePhysiciansPage} />
                <Route exact path="/physicians/add" component={AddPhysician} />
                <Route exact path="/physicians/:physicianId/edit" component={EditPhysician} />
                <Route exact path="/physicians/:physicianId" component={PhysicianView} />
                <Route exact path="/physicians/:physicianId/access" component={PhysicianAccess} />
                <Route exact path="/agenda" component={AgendaPage} />
                <Route exact path="/refills" component={RefillsPage} />
                <Route exact path="/products" component={ProductsPage} />
                <Route exact path="/products/add" component={AddProduct} />
                <Route exact path="/products/:productId/edit" component={EditProduct} />
                <PrivateRoute exact path="/team" component={TheTeamPage} />
                <PrivateRoute exact path="/team/add" component={AddMember} />
                <PrivateRoute exact path="/team/:userId/edit" component={EditMember} />
                <PrivateRoute exact path="/team/:userId/profile" component={Profile} />

                <Route exact path="/attachment/:attachmentId" component={Attachment} />
                <Route exact path="/patientAttachment/:attachmentId" component={PatientAttachment} />

                <Route exact path="/book/:bookId" component={Attachment} />



              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App;
