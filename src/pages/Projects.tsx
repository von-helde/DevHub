import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { useProjects } from '../contexts/ProjectContext'
import type { Project } from '../types/project'
import Toast from '../components/Toast'

const TECH_OPTIONS = ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Vue', 'CSS', 'SQL', 'MongoDB', 'Docker', 'AWS', 'GraphQL']

const EMPTY_FORM = {
  title: '',
  description: '',
  technologies: [] as string[],
  githubUrl: '',
  liveUrl: '',
  imageUrl: '',
  completedDate: '',
  status: 'Em Progresso' as Project['status'],
}

export default function Projects() {
  const { user } = useAuth()
  const { addProject, updateProject, projects } = useProjects()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const existing = id ? projects.find(p => p.id === id) : null
  const isEdit = !!existing

  const [form, setForm] = useState(existing ? {
    title: existing.title,
    description: existing.description,
    technologies: existing.technologies,
    githubUrl: existing.githubUrl || '',
    liveUrl: existing.liveUrl || '',
    imageUrl: existing.imageUrl,
    completedDate: existing.completedDate || '',
    status: existing.status,
  } : EMPTY_FORM)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState('')
  const [techInput, setTechInput] = useState('')

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const toggleTech = (t: string) => {
    setForm(f => ({
      ...f,
      technologies: f.technologies.includes(t)
        ? f.technologies.filter(x => x !== t)
        : [...f.technologies, t]
    }))
  }

  const addCustomTech = () => {
    const t = techInput.trim()
    if (t && !form.technologies.includes(t)) {
      setForm(f => ({ ...f, technologies: [...f.technologies, t] }))
      setTechInput('')
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Título obrigatório'
    if (form.title.length > 100) e.title = 'Máximo 100 caracteres'
    if (!form.description.trim()) e.description = 'Descrição obrigatória'
    if (!form.imageUrl) e.imageUrl = 'Imagem obrigatória'
    if (form.imageUrl && !form.imageUrl.startsWith('http')) e.imageUrl = 'URL inválida'
    if (form.githubUrl && !form.githubUrl.startsWith('http')) e.githubUrl = 'URL inválida'
    if (form.liveUrl && !form.liveUrl.startsWith('http')) e.liveUrl = 'URL inválida'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    if (isEdit && existing) {
      updateProject(existing.id, form)
      setToast('Projeto atualizado com sucesso!')
    } else {
      const newProject: Project = {
        id: `proj-${user!.id}-${Date.now()}`,
        userId: user!.id,
        ...form,
        createdAt: new Date().toISOString(),
      }
      addProject(newProject)
      setToast('Projeto adicionado!')
    }
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  const handleTechButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const tech = e.currentTarget.dataset.tech
    if (tech) toggleTech(tech)
  }

  const handleRemoveTechClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const tech = e.currentTarget.dataset.tech
    if (tech) {
      setForm(f => ({ ...f, technologies: f.technologies.filter(x => x !== tech) }))
    }
  }

  const handleTechInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTechInput(e.target.value)
  }

  const handleTechInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCustomTech()
    }
  }

  const renderTechOptions = () => TECH_OPTIONS.map(t => (
    <TechBtn
      key={t}
      data-tech={t}
      $selected={form.technologies.includes(t)}
      onClick={handleTechButtonClick}
      type="button"
    >
      {t}
    </TechBtn>
  ))

  const renderCustomTechTags = () => form.technologies
    .filter(t => !TECH_OPTIONS.includes(t))
    .map(t => (
      <CustomTag key={t}>
        {t}
        <Remove type="button" data-tech={t} onClick={handleRemoveTechClick}>✕</Remove>
      </CustomTag>
    ))

  return (
    <Page>
      <Card>
        <CardTitle>{isEdit ? 'Editar projeto' : 'Novo projeto'}</CardTitle>

        <Field>
          <label htmlFor="title">Título *</label>
          <input id="title" value={form.title} onChange={set('title')} placeholder="Task Manager App" maxLength={100} />
          <Hint>{form.title.length}/100</Hint>
          {errors.title && <Err>{errors.title}</Err>}
        </Field>

        <Field>
          <label htmlFor="description">Descrição * <Counter>{form.description.length}/500</Counter></label>
          <textarea id="description" value={form.description} onChange={set('description')} placeholder="Descreva seu projeto..." maxLength={500} rows={4} />
          {errors.description && <Err>{errors.description}</Err>}
        </Field>

        <Field>
          <label htmlFor="customTech">Tecnologias</label>
          <TechGrid>
            {renderTechOptions()}
          </TechGrid>
          <CustomTech>
            <input
              id="customTech"
              value={techInput}
              onChange={handleTechInputChange}
              placeholder="Outra tecnologia..."
              onKeyDown={handleTechInputKeyDown}
            />
            <AddBtn type="button" onClick={addCustomTech}>+ Adicionar</AddBtn>
          </CustomTech>
          {renderCustomTechTags()}
        </Field>

        <Row2>
          <Field>
            <label htmlFor="githubUrl">URL do GitHub</label>
            <input id="githubUrl" value={form.githubUrl} onChange={set('githubUrl')} placeholder="https://github.com/..." />
            {errors.githubUrl && <Err>{errors.githubUrl}</Err>}
          </Field>
          <Field>
            <label htmlFor="liveUrl">URL do Demo</label>
            <input id="liveUrl" value={form.liveUrl} onChange={set('liveUrl')} placeholder="https://meu-projeto.vercel.app" />
            {errors.liveUrl && <Err>{errors.liveUrl}</Err>}
          </Field>
        </Row2>

        <Field>
          <label htmlFor="imageUrl">URL da imagem / print *</label>
          <input id="imageUrl" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://imgur.com/img.png" />
          {errors.imageUrl && <Err>{errors.imageUrl}</Err>}
          {form.imageUrl && (
            <Preview src={form.imageUrl} alt="Preview" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
          )}
        </Field>

        <Row2>
          <Field>
            <label htmlFor="completedDate">Data de conclusão</label>
            <input id="completedDate" type="date" value={form.completedDate} onChange={set('completedDate')} />
          </Field>
          <Field>
            <label htmlFor="status">Status</label>
            <select id="status" value={form.status} onChange={set('status')}>
              <option>Em Progresso</option>
              <option>Concluído</option>
              <option>Planejado</option>
            </select>
          </Field>
        </Row2>

        <Actions>
          <BtnOutline onClick={() => navigate('/dashboard')}>Cancelar</BtnOutline>
          <BtnPrimary onClick={handleSave}>{isEdit ? 'Salvar alterações' : 'Adicionar projeto'}</BtnPrimary>
        </Actions>
      </Card>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </Page>
  )
}

const Page = styled.div`
  max-width: 720px;
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
  gap: 20px;
`

const CardTitle = styled.h1`font-size: 20px; font-weight: 800;`

const Field = styled.div`
  display: flex; flex-direction: column; gap: 6px;
  label { font-size: 13px; font-weight: 500; color: var(--muted); display: flex; align-items: center; gap: 6px; }
  textarea { resize: vertical; }
`

const Hint = styled.span`font-size: 11px; color: var(--muted); text-align: right;`
const Counter = styled.span`font-size: 11px; color: var(--muted); margin-left: auto;`
const Err = styled.span`font-size: 12px; color: var(--danger);`

const TechGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px;
`

const TechBtn = styled.button<{ $selected: boolean }>`
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${p => p.$selected ? 'var(--accent)' : 'var(--border)'};
  background: ${p => p.$selected ? 'var(--accent)33' : 'var(--surface2)'};
  color: ${p => p.$selected ? 'var(--accent2)' : 'var(--muted)'};
  transition: all 0.15s;
`

const CustomTech = styled.div`
  display: flex; gap: 8px; margin-top: 4px;
`

const AddBtn = styled.button`
  padding: 8px 14px;
  border-radius: 7px;
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 13px;
  white-space: nowrap;
`

const CustomTag = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 12px;
  margin: 4px 4px 0 0;
`

const Remove = styled.button`
  background: none; border: none; color: var(--danger);
  font-size: 10px; padding: 0; line-height: 1;
`

const Preview = styled.img`
  width: 100%; max-height: 180px; object-fit: cover;
  border-radius: 7px; margin-top: 6px;
  border: 1px solid var(--border);
`

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

const Actions = styled.div`
  display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px;
`

const Btn = styled.button`
  padding: 10px 22px; border-radius: 8px;
  font-size: 13px; font-weight: 600; border: none;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`

const BtnOutline = styled(Btn)`background: var(--surface2); color: var(--text);`
const BtnPrimary = styled(Btn)`background: var(--accent); color: #fff;`