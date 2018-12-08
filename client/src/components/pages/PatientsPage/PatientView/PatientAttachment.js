
import React from 'react';
import BookWindow from '../../Scripts/ScriptView/Tabs/AttachmentsTab/AttachmentWindow';
import axios from 'axios';


class Book extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        file: "",
        attachment: ''
    }
    componentDidMount() {
        const loginToken = window.localStorage.getItem("token");
        if (this.props.match.params.attachmentId) {
            axios.get('/api/patientAttachments/search?attachmentId=' + this.props.match.params.attachmentId, { headers: { "Authorization": "Bearer " + loginToken } })
                .then((resp) => {
                    console.log(resp);
                    this.setState({
                        file: resp.data.response[0].link,
                        attachment: resp.data.response[0]
                    }, () => console.log(this.state));


                }).catch((err) => {
                    console.error(err)
                })
        }

    }



    render() {
        return (
            this.state.file ?
                <BookWindow
                    file={this.state.file}
                /> :
                <div>File not found</div>

        );
    }
}

export default Book;