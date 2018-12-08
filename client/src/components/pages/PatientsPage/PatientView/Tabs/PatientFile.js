// import React from 'react';
// import FileWindow from './FileWindow';
// import axios from 'axios';


// class PatientFile extends React.Component {

//     state = {
//         file: ""
//     }
//     componentDidMount() {
//         if(this.props.match.params.id){
//             axios({
//                 method: "GET",
//                 headers: {
//                     "Authorization": "Bearer " + window.localStorage.getItem("token")
//                 },
//                 // url: "http://localhost:3000/api/patients/attachments/search?id=1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqYW1lc0BuYWtlZGRldi5jb20iLCJ1c2VybmFtZSI6IkFkbWluIiwiZXhwIjoxNTM5OTA2MzQ5LjA5NywiaWF0IjoxNTM5MzAxNTQ5fQ.2ekfhRPOHm941tBAmbU9snNJNkWgnPIgOj8dCS6To2U"
//             }).then((resp) => {
//                 this.setState({
//                     file: resp.data.response[0].link
//                 })
//                 console.log(this.state.file);
                
//             }).catch((err) => {
//                 console.error(err)
//             })
//         }
        
//     }
    
    
    
//     render() {
//         return(
//             this.state.file ? 
//             <FileWindow 
//             file={this.state.file} 
//             /> : 
//             <div>Can't Find PDF</div>

//         );
//     }
// }

// export default PatientFile;