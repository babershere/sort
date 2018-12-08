import React from 'react';
import SignIn from './SignIn'
import LoggedIn from './LoggedIn'
import Searchbar from './Searchbar'

console.log(SignIn, LoggedIn);

class Navbar extends React.Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <div>
                                <a className="navbar-brand" href="/">SortPak</a>
                                <img alt="SortPak" id="logo" src="http://www.sortpak.com/site-uploadz/2018/05/sortpak-logo-lg.png" />
                            </div>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            {(window.localStorage.getItem("token") !== null)? <Searchbar /> : "" }
                            <ul className="nav navbar-nav navbar-right">
                                { (window.localStorage.getItem("token") !== null) ? <LoggedIn /> : <SignIn />}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;