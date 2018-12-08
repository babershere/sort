import React from 'react'

class Searchbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: ""
        }
    }
    handleInput = (e) => {
        this.setState({searchTerm: e.target.value})
    }
    handleSubmit = (e) => {
        e.preventDefault();
        window.location.href = "/search?title=" + this.state.searchTerm;
    }
    render() {
        return (
            <form className="navbar-form navbar-left" role="search">
                <div className="form-group">
                    <input onChange={this.handleInput}name="searchTerm" value={this.state.searchTerm} type="text" className="form-control" placeholder="Search" />
                </div>
                <button onClick={this.handleSubmit} type="submit" className="btn btn-default">Submit</button>
            </form>
        );
    }
}

export default Searchbar;