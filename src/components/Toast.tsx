import { useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'

interface ToastProps {
  readonly message: string
  readonly type?: 'success' | 'error'
  readonly onClose: () => void
}

export default function Toast({ message, type = 'success', onClose }: Readonly<ToastProps>) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <Wrap $type={type}>
      <Icon>{type === 'success' ? '✓' : '✕'}</Icon>
      {message}
    </Wrap>
  )
}

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`

const Wrap = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  animation: ${slideIn} 0.3s ease;
  box-shadow: 0 8px 32px #0008;

  ${p => p.$type === 'success'
    ? css`background: #1a2e22; border: 1px solid var(--success); color: var(--success);`
    : css`background: #2e1a1a; border: 1px solid var(--danger); color: var(--danger);`
  }
`

const Icon = styled.span`
  font-weight: 700;
  font-size: 16px;
`