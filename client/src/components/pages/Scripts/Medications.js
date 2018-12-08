import React from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios'

import { Table } from '../../common'


class Example extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      value: '',
      suggestions: []
    };

  }


  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/products/search', { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);
        this.setState({
          languages: resp.data.response
        })

      }).catch((error) => {
        console.error(error);
      })
  }
  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.state.languages.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.

  
  // getSuggestionValue = suggestion => suggestion.name;
  getSuggestionValue = suggestion => suggestion.name;

  // Use your imagination to render suggestions.
  renderSuggestion = suggestion => (
    <Table>
      <thead>
        <th>NAME</th>
        <th>NDC</th>
        <th>PACKAGE SIZE</th>
        <th>QUANTITY</th>
        <th>COST</th>
      </thead>
      <tbody>
        <tr><td>{suggestion.name}</td>
          <td>{suggestion.NDC}</td>
          <td>{suggestion.packageSize}
          </td>
          <td>{suggestion.quantity}</td>
          <td>{suggestion.cost}</td></tr></tbody>
    </Table>
  );

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    }, () => console.log(this.state.value));

  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search for a medication',
      value,
      onChange: this.onChange,
      
    };



    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default Example;
