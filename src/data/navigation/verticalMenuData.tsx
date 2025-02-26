// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Início',
    href: '/home',
    icon: 'ri-home-smile-line'
  },
  {
    label: 'Sobre',
    href: '/about',
    icon: 'ri-information-line'
  }
]

export default verticalMenuData
