import React from 'react'

class LoggedIn extends React.Component {

    logOut = () => {
        window.localStorage.removeItem("token");
        window.location = "/";
    }
    render() {
        return (
            <div style={{ "paddingTop": "7.5px" }}>
                <div className="btn-group" role="group" aria-label="...">
                    <div className="btn-group" role="group">
                        <a href="/search" /*onClick={this.search}*/ type="button" className="btn btn-default"><span className="glyphicon glyphicon-search"></span></a>
                    </div>
                    <div className="btn-group" role="group">
                        <a href="/upload" /*onClick={this.upload}*/ type="button" className="btn btn-default"><span className="glyphicon glyphicon-upload"></span></a>
                    </div>
                    <div className="btn-group" role="group">
                        <a href="/profile" /*onClick={this.profile}*/ type="button" className="btn btn-default"><span className="glyphicon glyphicon-user"></span></a>
                    </div>
                    <div className="btn-group" role="group">
                    <a href="" onClick={this.logOut} type="button" className="btn btn-default"><span className="glyphicon glyphicon-log-out"></span></a>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoggedIn;