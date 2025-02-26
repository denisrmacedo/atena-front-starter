// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
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

export default horizontalMenuData
