import React from 'react';
import cn from 'classnames'

import TabsSelector from './TabsSelector/TabsSelector'

import styles from './SwitchTable.css'

const SwitchTable = ({ tabs, selected, onClick }) => {
  return (
    <div className={cn('switch-table', styles.switchContainer)}>
      {/* floats above the main */}
      <TabsSelector
        tabs={tabs}
        selected={selected.value}
        onClick={onClick}
      />
      <div className="main">
        {selected.renderComponent()}
      </div>
    </div>
  )
}

export default SwitchTable;
