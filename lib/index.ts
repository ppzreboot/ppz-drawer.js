interface I_init_drawer_opts {
  container: HTMLElement
  mode?: 'x' | 'y' | 'both'
  close_on_init?: boolean

  duration?: number
  easing?: string
}

export
function init_drawer(opts: I_init_drawer_opts) {
  const container = opts.container
  const mode = opts.mode ?? 'y'
  const duration = opts.duration ?? 300
  const easing = opts.easing ?? 'ease'

  const has_x = () => mode === 'x' || mode === 'both'
  const has_y = () => mode === 'y' || mode === 'both'
  const set_transition = () => container.style.transition = `all ${duration}ms ${easing}`
  const cancel_transition = () => container.style.transition = ''
  const get_rect = () => {
    const rect = container.getBoundingClientRect()
    return {
      width: rect.width + 'px',
      height: rect.height + 'px',
    }
  }
  const _release = () => { // release is not the same as open
    if (has_x())
      container.style.width = ''
    if (has_y())
      container.style.height = ''
  }
  const _close = () => {
    if (has_x())
      container.style.width = '0px'
    if (has_y())
      container.style.height = '0px'
  }
  const flip = async (go_last: () => void) => {
    // FLIP: First
    const first = get_rect()
    // FLIP: Last
    cancel_transition()
    await next_frame()
    go_last()
    const last = get_rect()
    // FLIP: Invert
    container.style.width = first.width
    container.style.height = first.height
    await next_frame()
    set_transition()
    await next_frame()
    // FLIP: Play
    container.style.width = last.width
    container.style.height = last.height
  }

  container.style.overflow = 'clip'
  if (opts.close_on_init)
    _close()

  return {
    open: () => flip(_release),
    close: () => flip(_close),
  }
}

function next_frame() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}
