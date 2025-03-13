import { useRef, ReactNode, useState, useEffect } from 'react'
import { init_drawer, I_drawer_opts, I_drawer } from '.'

export
interface I_drawer_props {
  open: boolean
  /** opts is not reactive */
  opts: I_drawer_opts
  children: ReactNode
}

export
function Drawer(props: I_drawer_props) {
  const container = useRef<HTMLDivElement>(null)

  const [drawer, set_drawer] = useState<I_drawer | null>(null)
  useEffect(() => {
    set_drawer(init_drawer(container.current!, props.opts))
  }, [])

  useEffect(() => {
    if (drawer === null) return

    if (props.open)
      drawer.open()
    else
      drawer.close()
  }, [drawer, props.open])

  return <div ref={container}>
    {props.children}
  </div>
}
