import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Nome obrigatório'
    if (!form.email.includes('@')) e.email = 'Email inválido'
    if (form.password.length < 8) e.password = 'Senha deve ter no mínimo 8 caracteres'
    if (form.password !== form.confirm) e.confirm = 'As senhas não coincidem'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await register(form.name.trim(), form.email, form.password)
      navigate('/login')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setErrors({ email: message })
    } finally {
      setLoading(false)
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  return (
    <Page>
      <Card>
        <Logo>Dev<Accent>Hub</Accent></Logo>
        <Title>Criar sua conta</Title>
        <Sub>Já tem conta? <Link to="/login">Fazer login</Link></Sub>

        <Field>
          <label htmlFor="name">Nome completo</label>
          <input id="name" placeholder="João Silva" value={form.name} onChange={set('name')} />
          {errors.name && <Err>{errors.name}</Err>}
        </Field>

        <Field>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="joao@example.com" value={form.email} onChange={set('email')} />
          {errors.email && <Err>{errors.email}</Err>}
        </Field>

        <Field>
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={set('password')} />
          {errors.password && <Err>{errors.password}</Err>}
        </Field>

        <Field>
          <label htmlFor="confirm">Confirmar senha</label>
          <input id="confirm" type="password" placeholder="Repita a senha" value={form.confirm} onChange={set('confirm')} />
          {errors.confirm && <Err>{errors.confirm}</Err>}
        </Field>

        <BtnPrimary onClick={handleSubmit} disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar conta'}
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
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Logo = styled.div`
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 4px;
`

const Accent = styled.span`color: var(--accent);`

const Title = styled.h1`font-size: 20px; font-weight: 700;`

const Sub = styled.p`
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 8px;
  a { color: var(--accent2); }
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label { font-size: 13px; font-weight: 500; color: var(--muted); }
`

const Err = styled.span`font-size: 12px; color: var(--danger);`

const BtnPrimary = styled.button`
  margin-top: 8px;
  padding: 12px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.2s;
  &:hover:not(:disabled) { opacity: 0.85; }
  &:disabled { opacity: 0.5; }
`