import styled from 'styled-components'

interface ModalProps {
  readonly title: string
  readonly message: string
  readonly confirmLabel?: string
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

export default function Modal({ title, message, confirmLabel = 'Confirmar', onConfirm, onCancel }: ModalProps) {
  return (
    <Overlay onClick={onCancel}>
      <Box onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <Actions>
          <BtnCancel onClick={onCancel}>Cancelar</BtnCancel>
          <BtnDanger onClick={onConfirm}>{confirmLabel}</BtnDanger>
        </Actions>
      </Box>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: #000a;
  display: flex; align-items: center; justify-content: center;
  z-index: 9000;
  padding: 24px;
`

const Box = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  max-width: 420px;
  width: 100%;

  h3 { font-size: 17px; margin-bottom: 10px; }
  p  { color: var(--muted); font-size: 14px; margin-bottom: 24px; }
`

const Actions = styled.div`
  display: flex; gap: 10px; justify-content: flex-end;
`

const Btn = styled.button`
  padding: 9px 20px; border-radius: 7px;
  font-size: 13px; font-weight: 600; border: none;
`

const BtnCancel = styled(Btn)`
  background: var(--surface2); color: var(--text);
`

const BtnDanger = styled(Btn)`
  background: var(--danger); color: #fff;
`