import { init_drawer } from 'ppz-drawer'

const el = (selector: string) => document.querySelector(selector) as HTMLElement

const y = el('#y')
const drawer = init_drawer({ container: y })
el('.y-open').addEventListener('click', () => drawer.open())
el('.y-close').addEventListener('click', () => drawer.close())

const x = el('#x')
const drawer_x = init_drawer({
  container: x,
  mode: 'x',
  duration: 5000,
})
el('.x-open').addEventListener('click', () => drawer_x.open())
el('.x-close').addEventListener('click', () => drawer_x.close())

const both = el('#both')
const drawer_both = init_drawer({
  container: both,
  mode: 'both',
  duration: 3000,
  easing: 'linear',
})
el('.both-open').addEventListener('click', () => drawer_both.open())
el('.both-close').addEventListener('click', () => drawer_both.close())
