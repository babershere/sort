import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import checkCredentials from '../lib/checkCredentials';
/**
 * Higher-order component (HOC) to wrap restricted pages
 */
export default (BaseComponent, tokenType = 'auth', role = '') => {
  class Restricted extends Component {
    componentDidMount() {
      this.checkAuthentication(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.location !== this.props.location) {
        this.checkAuthentication(nextProps);
      }
    }

    checkAuthentication(params) {
      const { history } = params;
      checkCredentials()
        .then(payload => {
          // check to see if the token is of the same type
          if (payload.type === tokenType ) {
            // if a role type is given, check against user
            if (role && payload.user.role !== role) {
              return history.replace({ pathname: '/' })
            }

            return true
          }
          let pathname
          switch (payload.type) {
            case 'auth':
              pathname = '/'
              break
            case 'email':
              pathname = '/login/create-password'
              break
            case 'createPassword':
              pathname = '/login/claim-account'
              break
            default:
              pathname = '/login'
          }
          return history.replace({ pathname })
        })
        .catch(err => {
          // console.log('check credentials err', err);
          // console.log('redirecting to login page');
          return history.replace({ pathname: '/login' })
        })
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }
  return withRouter(Restricted);
}
