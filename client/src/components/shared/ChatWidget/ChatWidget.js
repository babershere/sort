import React, { Component } from "react";
import io from "socket.io-client";
import { Panel, Row, Col } from 'react-bootstrap';
import jwt_decode from 'jwt-decode'

const titleStyle = {
    textAlign: "center"
}

const makeSticky = {
    position: 'fixed',
    bottom: 0,
    right: 5
}

class ChatWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            message: '',
            messages: [],
            open: false
        };

        const loginToken = window.localStorage.getItem("token");
        var decoded = jwt_decode(loginToken);
        

        // this.socket = io('https://sortpak-dev.herokuapp.com/');
        this.socket = io('http://localhost:3001/');

        this.socket.on('RECEIVE_AUTHOR', function (data) {
            console.log(data)
        
            addAuthor(data);
        });
        this.socket.on('RECEIVE_MESSAGE', function (data) {
            console.log(data)
        
            addMessage(data);
        });

        const addAuthor = data => {
            console.log(data)
            this.setState({author: data})
        }
        const addMessage = data => {
            this.setState({ messages: [...this.state.messages, this.state.author, data] });
            // this.setState({message: data})
        };

        this.sendMessage = ev => {
            ev.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                author: decoded.username,
                message: this.state.message
            })
            this.setState({ message: '' });

        }
    }

    componentDidMount() {
        const loginToken = window.localStorage.getItem("token");
        var decoded = jwt_decode(loginToken);
    
     this.setState({
      author: decoded.username
     })
    }

    render() {
    
        return (

            <Panel id="collapsible-panel-example-3" style={makeSticky}>

                <Panel.Collapse>
                    <Panel.Body>

                        <div className="messages">
                            {this.state.messages === null ? <div></div> :
                                this.state.messages.map((message, i) => {
                                    console.log(message)
                                    return (
                                        <div key={i}>{this.state.author}:   {message}</div>
                                    )
                                })}
                        </div>

                        <hr />
                        <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} className="form-control" />
                        <textarea type='text' placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                        <button onClick={this.sendMessage} className="btn btn-default form-control">Send</button>



                    </Panel.Body>
                </Panel.Collapse>
                <Panel.Heading>
                    <Panel.Title>
                        <Row>
                            <Col md={2}><Panel.Toggle componentClass="a"><span className="glyphicon glyphicon-chevron-up"></span></Panel.Toggle></Col>
                            <Col md={10}><h4 className='weather__value' style={titleStyle}>Chat</h4></Col>
                        </Row>


                    </Panel.Title>

                </Panel.Heading>
            </Panel>
        );
    }
}

export default ChatWidget;






// import React, { Component } from 'react';
// import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';

// // import 'react-chat-widget/lib/styles.css';
// import './ChatWidget.css'
// import logo from './sortpak-logo-lg.png';

// class ChatWidget extends Component {
//   componentDidMount() {
//     addResponseMessage("Welcome to this SortPak chat!");
//   }

//   handleNewUserMessage = (newMessage) => {
//     console.log(`New message incoming! ${newMessage}`);
//     // Now send the message throught the backend API
//   }

//   render() {
//     return (
//       <div className="App">
//         <Widget
//           handleNewUserMessage={this.handleNewUserMessage}
//           profileAvatar={logo}
//           title="SortPak"
//           subtitle="User"
//         />
//       </div>
//     );
//   } 
// }

// export default ChatWidget;