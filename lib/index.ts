export
type I_mode = 'x' | 'y' | 'both'

export
type I_status = 'open' | 'close'

export
interface I_drawer_opts {
  container: HTMLElement
  mode?: I_mode
  close_on_init?: boolean

  duration?: number
  easing?: string
}

class Placeholder {
  constructor(private dom: HTMLElement) {
    dom.style.boxSizing = 'border-box'
  }
  hold() {
    const { width, height } = this.dom.getBoundingClientRect()
    this.dom.style.width = width + 'px'
    this.dom.style.height = height + 'px'
  }
  release() {
    this.dom.style.width = ''
    this.dom.style.height = ''
  }
}

class Helper {
  container: HTMLElement
  mode: I_mode
  duration: number
  easing: string
  placeholder: Placeholder | null
  status: I_status = 'open'
  time_id: number | null = null

  constructor(opts: I_drawer_opts) {
    /* 1. init properties */
    this.container = opts.container
    this.mode = opts.mode ?? 'y'
    this.duration = opts.duration ?? 300
    this.easing = opts.easing ?? 'ease'

    /* 2. init component */
    // init container
    this.container.style.overflow = 'clip'
    // init placeholder
    const placeholder_dom = this.container.querySelector('.ppz-drawer-placeholder') as HTMLElement | null
    this.placeholder = placeholder_dom && new Placeholder(placeholder_dom) // null || Placeholder
    // init status
    if (opts.close_on_init) {
      this.status = 'close'
      this.close()
    }
  }

  set_container_size(size: { width: number, height: number }) {
    if (this.has_x())
      this.container.style.width = size.width + 'px'
    if (this.has_y())
      this.container.style.height = size.height + 'px'
  }
  has_x() {
    return this.mode === 'x' || this.mode === 'both'
  }
  has_y() {
    return this.mode === 'y' || this.mode === 'both'
  }
  set_transition () {
    this.container.style.transition = `all ${this.duration}ms ${this.easing}`
  }
  cancel_transition() {
    this.container.style.transition = ''
  }
  get_rect() {
    const { width, height } = this.container.getBoundingClientRect()
    return { width, height }
  }
  release() { // release is not the same as open
    if (this.has_x())
      this.container.style.width = ''
    if (this.has_y())
      this.container.style.height = ''
  }
  close() {
    if (this.has_x())
      this.container.style.width = '0px'
    if (this.has_y())
      this.container.style.height = '0px'
  }
}

async function flip(h: Helper, target: I_status) {
  if (h.status === target)
    return
  h.status = target

  /* 0. clear timeout for clearing transition, placeholder */
  if (h.time_id)
    clearTimeout(h.time_id)
  h.time_id = setTimeout(() => {
    if (target === 'open') { // release size limit
      h.release()
      h.placeholder?.release()
    }
    h.cancel_transition()
    h.time_id = null
  }, h.duration)

  /* 1. FLIP: First */
  const first = h.get_rect()
  /* 2. stop animation */
  h.cancel_transition()
  await next_frame()
  /* 3. Hold Place */
  if (h.placeholder) {
    h.release()
    h.placeholder.release()
    h.placeholder.hold()
  }
  /* 4. FLIP: Last */
  if (target === 'close')
    h.close()
  else
    h.release()
  const last = h.get_rect()
  // FLIP: Invert
  h.set_container_size(first)
  if (target === 'close')
    await next_frame() // I don't know why, but it's necessary
  h.set_transition()
  // FLIP: Play
  await next_frame()
  h.set_container_size(last)
}

export
function init_drawer(opts: I_drawer_opts) {
  const h = new Helper(opts)
  return {
    open: () => flip(h, 'open'),
    close: () => flip(h, 'close'),
    toggle: () => flip(h, h.status === 'open' ? 'close' : 'open'),
    /** @returns [status, is_animating] */
    get_status: (): [I_status, boolean] =>
      [h.status, h.time_id === null]
    ,
  }
}

function next_frame() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}
