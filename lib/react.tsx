import { useRef, ReactNode, useState, useEffect, CSSProperties } from 'react'
import { init_drawer, I_drawer_opts, I_drawer } from '.'

export
interface I_drawer_props {
  open: boolean
  className?: string
  style?: CSSProperties
  /** opts is not reactive */
  opts: Omit<I_drawer_opts, 'close_on_init' | 'container'>
  children: ReactNode
}

export
function Drawer(props: I_drawer_props) {
  const container = useRef<HTMLDivElement>(null)

  const [drawer, set_drawer] = useState<I_drawer | null>(null)
  useEffect(() => {
    set_drawer(init_drawer({
      container: container.current!,
      close_on_init: !props.open,
      ...props.opts,
    }))
  }, [])

  useEffect(() => {
    if (drawer === null) return

    if (props.open)
      drawer.open()
    else
      drawer.close()
  }, [drawer, props.open])

  return <div ref={container} className={props.className} style={props.style}>
    {props.children}
  </div>
}
