//  This class is a static component that will allow interaction in a button-like interface, however, will not be a standard button
import React, { Component } from 'react';
import cn from 'classnames';
import onStyles from './ToggleSwitchButtonON.css'
import offStyles from './ToggleSwitchButtonOFF.css'

export class ToggleSwitchButton extends Component {

  state = {
    isToggleOn: false,
  }

  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }



    handleClick(option) {
      if (!(this.props.enabled || true)) { return }

      this.setState(prevState => ({
        isToggleOn: !prevState.isToggleOn,
      }));
      this.props.onSelect(this.state)
    }

  render() {
    //  First, determine if the current button should be selected

    return (
      <button
        onClick={this.handleClick.bind(this)}
        className={this.state.isToggleOn ? cn('button', onStyles.button) : cn('button', offStyles.button)}
      >
        {this.props.optionTitle}
      </button>
    )
  }

}
