import React from 'react';
import cn from 'classnames'

import {
  SummaryItem,
} from '../../common'

import styles from './SummaryRow.css'

const SummaryRow = ({ className, user }) => {
  const {
    lastLogin,
    weeklyHours,
    ytdBonus,
    totalBonus,
    monthlyRevenue,
  } = user || {}

  const items = [
    {
      title: 'Bonus',
      content: totalBonus || '...',
    },
    {
      title: 'Avg Monthly',
      content: monthlyRevenue || '...',
    },
    {
      title: 'Bonus Year-to-Date',
      content: ytdBonus || '...',
    },
    {
      title: 'Hours Online Weekly',
      content: weeklyHours || '...',
    },
    {
      title: 'Last Logged In',
      content: lastLogin || '...',
    },
  ]
  const classNames = cn('summary-row', styles.summary, className)

  return (
    <div className={classNames}>
      {items.map(({ title, content }) => (
        <SummaryItem
          key={title}
          title={title}
          content={content}
        />
      ))}
    </div>
  )
}

export default SummaryRow
