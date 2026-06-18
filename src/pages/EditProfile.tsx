import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import Toast from '../components/Toast'

export default function EditProfile() {
  const { user, updateProfile } = useAuth()
  type User = {
    name?: string
    title?: string
    bio?: string
    photo?: string
    github?: string
    linkedin?: string
    email?: string
  }
  const navigate = useNavigate()
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({
    name: (user as User | undefined)?.name || '',
    title: (user as User | undefined)?.title || '',
    bio: (user as User | undefined)?.bio || '',
    photo: (user as User | undefined)?.photo || '',
    github: (user as User | undefined)?.github || '',
    linkedin: (user as User | undefined)?.linkedin || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Nome obrigatório'
    if (form.photo && !form.photo.startsWith('http')) e.photo = 'URL deve começar com http'
    if (form.github && !form.github.startsWith('https://')) e.github = 'URL deve começar com https://'
    if (form.linkedin && !form.linkedin.startsWith('https://')) e.linkedin = 'URL deve começar com https://'
    return e
  }

  const handleSave = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    await updateProfile(form)
    setToast('Perfil atualizado com sucesso!')
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  return (
    <Page>
      <Card>
        <CardTitle>Editar perfil</CardTitle>

        {form.photo && (
          <PhotoPreview>
            <img
              src={form.photo}
              alt="Preview"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </PhotoPreview>
        )}

        <Field>
          <label htmlFor="name">Nome completo *</label>
          <input id="name" value={form.name} onChange={set('name')} placeholder="João Silva" />
          {errors.name && <Err>{errors.name}</Err>}
        </Field>

        <Field>
          <label htmlFor="title">Título profissional</label>
          <input id="title" value={form.title} onChange={set('title')} placeholder="Full Stack Developer" />
        </Field>

        <Field>
          <label htmlFor="bio">Bio / Descrição <Counter>{form.bio.length}/500</Counter></label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={set('bio')}
            placeholder="Conte um pouco sobre você..."
            maxLength={500}
            rows={4}
          />
        </Field>

        <Field>
          <label htmlFor="email">Email (somente leitura)</label>
          <input id="email" value={user?.email || ''} disabled />
        </Field>

        <Field>
          <label htmlFor="photo">URL da foto de perfil</label>
          <input id="photo" value={form.photo} onChange={set('photo')} placeholder="https://example.com/photo.jpg" />
          {errors.photo && <Err>{errors.photo}</Err>}
        </Field>

        <Field>
          <label htmlFor="github">GitHub</label>
          <input id="github" value={form.github} onChange={set('github')} placeholder="https://github.com/username" />
          {errors.github && <Err>{errors.github}</Err>}
        </Field>

        <Field>
          <label htmlFor="linkedin">LinkedIn</label>
          <input id="linkedin" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/username" />
          {errors.linkedin && <Err>{errors.linkedin}</Err>}
        </Field>

        <Row>
          <BtnOutline onClick={() => navigate('/dashboard')}>Cancelar</BtnOutline>
          <BtnPrimary onClick={handleSave}>Salvar alterações</BtnPrimary>
        </Row>
      </Card>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </Page>
  )
}

const Page = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px;
`

const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const CardTitle = styled.h1`font-size: 20px; font-weight: 800;`

const PhotoPreview = styled.div`
  img {
    width: 80px; height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--accent);
  }
`

const Field = styled.div`
  display: flex; flex-direction: column; gap: 6px;
  label {
    font-size: 13px; font-weight: 500; color: var(--muted);
    display: flex; align-items: center; gap: 6px;
  }
  textarea { resize: vertical; }
  input:disabled { opacity: 0.5; cursor: not-allowed; }
`

const Counter = styled.span`
  font-size: 11px; color: var(--muted); margin-left: auto;
`

const Err = styled.span`font-size: 12px; color: var(--danger);`

const Row = styled.div`display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px;`

const Btn = styled.button`
  padding: 10px 22px; border-radius: 8px;
  font-size: 13px; font-weight: 600; border: none;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`

const BtnOutline = styled(Btn)`background: var(--surface2); color: var(--text);`
const BtnPrimary = styled(Btn)`background: var(--accent); color: #fff;`