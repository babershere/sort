import React, { Component } from 'react'
import Geocode from 'react-geocode'

import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
// import { isNullOrUndefined } from 'util';

export class MapContainer extends Component {

  componentDidMount() {
    console.log(this.props);

    Geocode.setApiKey("AIzaSyBkzOou4Bmtu9y90Hu3uvZbRFmEXCaiz8c");
    // Enable or disable logs. Its optional.
    Geocode.enableDebug();

    console.log(this.props.address);

    // Get latidude & longitude from address.
    Geocode.fromAddress(this.props.address).then(
      response => {
          console.log(response);
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
        this.setState(
          {
            lat: response.results[0].geometry.location.lat,
            lng: response.results[0].geometry.location.lng
          },
          () => console.log(this.state)
        );
        


      },
      error => {
        console.error(error);
      }
    );
  }

  render() {

    const style = {
      width: '200px',
      height: '200px',
      display: 'inline'
    }

    if(this.state) {
    return (
      <Map google={this.props.google} style={style} zoom={14} initialCenter={{
        lat: `${this.state.lat}`,
        lng: `${this.state.lng}`
      }}>

        <Marker onClick={this.onMarkerClick}
          name={'Current location'}
          position={{ lat: `${this.state.lat}`, lng: `${this.state.lng}` }} 
        />

        <InfoWindow onClose={this.onInfoWindowClose}>
          <div>
            {/* <h1>{this.state.selectedPlace.name}</h1> */}
          </div>
        </InfoWindow>
      </Map>
    );
  } else {
    return(
      <div></div>
    )
  }
}
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDskqLU-PY4Z4_DUnhsQWaLHE8rJHsjVIc'
})(MapContainer)