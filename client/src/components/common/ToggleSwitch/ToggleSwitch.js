import React, { Component } from 'react'
import { ToggleSwitchButton } from './ToggleSwitchButton/ToggleSwitchButton'
import cn from 'classnames'
import styles from './ToggleSwitch.css'

export class ToggleSwitch extends Component {


  state = {
    options: [],
    allowsMultipleSelection: false,
    selectedOptions: [],
  }

  handleClick(btn) {
    console.log("Printing state: ", this.state)
  }


  renderOptions() {
    return this.props.options.map(optionTitle =>
      <ToggleSwitchButton
        optionTitle={optionTitle}
        isSelected={true}
        onSelect={this.handleClick.bind(this)}
      />
    )
  }

  render() {


        const {
          label,
          className,
          wide,
          options,
          ...otherProps,
        } = this.props

        if (label) {
          const classNames = cn('select', className, styles.container, { wide })
          return (
            <div
              className={classNames}
              {...otherProps}
            >
              <label>{label}</label>
              {this.renderOptions()}
            </div>
          )
        } else {
          return this.renderOptions()
        }
  }


}
