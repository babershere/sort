import React from 'react';
import cn from 'classnames'

import styles from './TabsSelector.css'

const Tab = ({ active, onClick, display}) => {
  const classNames = cn('tab', { active })
  return (
    <div
      className={classNames}
      onClick={onClick}
    >
      {display}
    </div>
  )
}

const TabsSelector = ({tabs, selected, onClick}) => {
  return (
    <div className={cn('tabs', styles.tabs)}>
      {tabs.map(tab => (
        <Tab
          key={tab.value}
          display={tab.display}
          active={selected === tab.value}
          onClick={() => onClick(tab)}
        />
      ))}
    </div>
  );
}

export default TabsSelector
