import React from 'react'
import moment from 'moment'
import cn from 'classnames'

import FontAwesome from 'react-fontawesome'

import {
  Button,
} from '../../common'

import styles from './DateBox.css'


const DateTimeDisplay = ({ date, time }) => (
  <span className="dateTime">
    <FontAwesome name="calendar-check-o" />
    {date} 
    &nbsp;&nbsp;&nbsp;&nbsp;
    <FontAwesome name="clock-o" />
    {time} 
    
  </span>
)

const NameDisplay = ({ name }) => (
  <span className="name">
    <FontAwesome name="user-circle" />
    {name}
  </span>
)


export const DateBox = props => {
  const {
    visit,
    note,
    buttonTitle,
    onClick,
    buttonIcon,
  } = props

  let dateTime
  let author
  if (note) {
    dateTime = moment(note.created_at)
    author = visit.Rep
  } else {
    dateTime = moment(visit.dateTime)
    author = visit.Rep
  }
  const name = author || 'Unknown'
  const day = dateTime.format('D')
  const date = dateTime.format('MM/DD/YYYY')
  const month = dateTime.format('MMM')
  const time = dateTime.format('h:mm A')


  return (
    <div className={cn(styles.note, { visit, note })}>
      <div className="date-container">
        <div className="date">
          <span className="month">
            {month}
          </span>

          <span className="day">
            {day}
          </span>
        </div>
      </div>

      <div className="dot" />

      <div className="content">
        {note ? (
          <div className="title">
            <NameDisplay name={name} />
            <DateTimeDisplay time={time} date={date} />
          </div>
        ) : (
          <div className="title">
            Upcoming Visit
          </div>
        )}

        {note ? (
          <div className="body">
            {note.text}
          </div>
        ) : (
          <div className="body">
            <DateTimeDisplay time={time} date={date} />
            <NameDisplay name={name} />
          </div>
        )}
      </div>

      {(visit && onClick) ? (
        <Button
          large
          icon={buttonIcon}
          title={buttonTitle || 'Click Me!'}
          onClick={onClick}
        />
      ) : (
        null
      )}
    </div>
  )
}
