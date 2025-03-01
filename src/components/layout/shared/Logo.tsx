'use client'

// React Imports
import { useRef } from 'react'
import type { CSSProperties } from 'react'

// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { VerticalNavContextProps } from '@menu/contexts/verticalNavContext'

// Component Imports
import MaterializeLogo from '@core/svg/Logo'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

type LogoTextProps = {
  isHovered?: VerticalNavContextProps['isHovered']
  isCollapsed?: VerticalNavContextProps['isCollapsed']
  transitionDuration?: VerticalNavContextProps['transitionDuration']
  isBreakpointReached?: VerticalNavContextProps['isBreakpointReached']
  color?: CSSProperties['color']
}

const LogoText = styled.span<LogoTextProps>`
  /* font-size: 1.2rem; */
  line-height: 1.0;
  font-weight: 500;
  letter-spacing: 0.15px;
  text-transform: capitalize;
  color: var(--mui-palette-text-primary);
  color: ${({ color }) => color ?? 'var(--mui-palette-text-primary)'};
  transition: ${({ transitionDuration }) =>
    `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

  ${({ isHovered, isCollapsed, isBreakpointReached }) =>
    !isBreakpointReached && isCollapsed && !isHovered
      ? 'margin-inline-start: 0; font-size: 0.8rem;'
      : 'margin-inline-start: 8px; font-size: 1.4rem;'}
`

const Logo = ({ maximized, color }: { maximized?: boolean, color?: CSSProperties['color'] }) => {
  // Refs
  const logoTextRef = useRef<HTMLSpanElement>(null)

  // Hooks
  const { isHovered, transitionDuration, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()

  // Vars
  const { layout } = settings

  return (
    <div className={'flex flex-col items-center min-bs-[24px]'}>
      <MaterializeLogo isCollapsed={!maximized && !isHovered && (layout === 'collapsed')} />
      <LogoText
        color={color}
        ref={logoTextRef}
        isHovered={isHovered}
        isCollapsed={!maximized && (layout === 'collapsed')}
        transitionDuration={transitionDuration}
        isBreakpointReached={isBreakpointReached}
      >
        Aurora
      </LogoText>
    </div>
  )
}

export default Logo
