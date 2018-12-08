import React, { Component } from 'react';

// Components
import {
  Table
} from '../../../../common'


class FaxesTab extends Component {


  render() {
    return (
      <div>
        
        <Table>
            <thead>
                <tr>
                    <th>FAX</th>
                    <th>DATE SENT</th>
                    <th>SENT BY</th>
                </tr>
            </thead>
            <tbody>
                
            </tbody>
        </Table>
      </div>
    )
  }
}

export default FaxesTab;
