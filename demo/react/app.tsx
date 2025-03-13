import React from 'react'
import { Drawer } from '../../lib/react'

export
function App() {
  const [open, set_open] = React.useState(false)
  return <div>
    <Drawer
      open={open}
      opts={{
        mode: 'both',
        duration: 3000,
        easing: 'linear',
      }}
    >
      <ul
        className='ppz-drawer-placeholder'
        style={{
          background: 'red',
        }}
      >
        <li>this is a drawer</li>
        <li>this is a react drawer</li>
      </ul>
    </Drawer>
    <button onClick={() => set_open(true)}>open</button>
    <button onClick={() => set_open(false)}>close</button>
    <button onClick={() => set_open(!open)}>toggle</button>
  </div>
}
 