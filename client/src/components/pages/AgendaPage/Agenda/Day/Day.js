import React from 'react';
import cn from 'classnames'
import Moment from 'react-moment'

// Components
import {
  Icon,
} from '../../../../common'

import styles from './Day.css'


const Day = ({day, reps, onClick, today}) => {
  const className = cn(styles.day, { outside: !day, today })
  if (!day) {
    return (
      <div className={className}/>
    )
  } else {

    return (
      <div className={className}>
        <Icon>
          {day}
        </Icon>
        {reps.map(rep => (
          <span
            key={rep.id}
            className="rep-name"
            onClick={() => onClick(rep)}
          >
          {rep.Rep} - <Moment format="HH:mm">{rep.dateTime}</Moment>
          </span>
        ))}
      </div>
    )
  }
}

export default Day;
