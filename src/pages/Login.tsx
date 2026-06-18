import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Preencha todos os campos'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setError('')
  }

  return (
    <Page>
      <Card>
        <Logo>Dev<Accent>Hub</Accent></Logo>
        <Title>Entrar na sua conta</Title>
        <Sub>Não tem conta? <Link to="/register">Criar agora</Link></Sub>

        <Field>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="joao@example.com"
            value={form.email}
            onChange={set('email')}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </Field>

        <Field>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Sua senha"
            value={form.password}
            onChange={set('password')}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </Field>

        {error && <ErrBox>{error}</ErrBox>}

        <BtnPrimary onClick={handleSubmit} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </BtnPrimary>
      </Card>
    </Page>
  )
}

const Page = styled.div`
  min-height: calc(100vh - 120px);
  display: flex; align-items: center; justify-content: center;
  padding: 40px 24px;
`

const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Logo = styled.div`font-size: 22px; font-weight: 800;`
const Accent = styled.span`color: var(--accent);`
const Title = styled.h1`font-size: 20px; font-weight: 700;`
const Sub = styled.p`
  font-size: 13px; color: var(--muted); margin-bottom: 8px;
  a { color: var(--accent2); }
`

const Field = styled.div`
  display: flex; flex-direction: column; gap: 6px;
  label { font-size: 13px; font-weight: 500; color: var(--muted); }
`

const ErrBox = styled.div`
  font-size: 13px; color: var(--danger);
  background: #2e1a1a; border: 1px solid var(--danger)44;
  padding: 10px 14px; border-radius: 7px;
`

const BtnPrimary = styled.button`
  margin-top: 8px; padding: 12px;
  background: var(--accent); color: #fff;
  border: none; border-radius: var(--radius);
  font-size: 14px; font-weight: 600;
  transition: opacity 0.2s;
  &:hover:not(:disabled) { opacity: 0.85; }
  &:disabled { opacity: 0.5; }
`