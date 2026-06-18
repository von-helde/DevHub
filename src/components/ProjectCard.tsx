import { useState } from 'react'
import styled from 'styled-components'
import type { Project } from '../types/project'
import { useProjects } from '../contexts/ProjectContext'
import Modal from './Modal'
import Toast from './Toast'

const TAG_COLORS: Record<string, string> = {
  React: '#61DAFB22',
  TypeScript: '#3178C622',
  'Node.js': '#33993322',
  Python: '#3776AB22',
  Vue: '#4FC08D22',
  CSS: '#1572B622',
  SQL: '#33679122',
}

const TAG_TEXT: Record<string, string> = {
  React: '#61DAFB',
  TypeScript: '#88aaff',
  'Node.js': '#55cc55',
  Python: '#7ab4e8',
  Vue: '#4FC08D',
  CSS: '#5599cc',
  SQL: '#5599bb',
}

const STATUS_COLORS: Record<string, string> = {
  'Concluído': '#34d399',
  'Em Progresso': '#fbbf24',
  'Planejado': '#8892a4',
}

interface Props {
  readonly project: Project
  readonly editable?: boolean
  readonly onEdit?: () => void
}

export default function ProjectCard({ project, editable, onEdit }: Props) {
  const { deleteProject } = useProjects()
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')

  const handleDelete = () => {
    deleteProject(project.id)
    setShowModal(false)
    setToast('Projeto deletado!')
  }

  return (
    <>
      <Card>
        <Thumb src={project.imageUrl} alt={project.title} onError={e => {
          ;(e.target as HTMLImageElement).src = 'https://placehold.co/400x200/161a23/6c63ff?text=Projeto'
        }} />
        <Body>
          <TopRow>
            <Status $color={STATUS_COLORS[project.status] || '#8892a4'}>
              {project.status}
            </Status>
            {project.completedDate && (
              <DateLabel>{project.completedDate}</DateLabel>
            )}
          </TopRow>
          <Title>{project.title}</Title>
          <Desc>
            {project.description.length > 150
              ? project.description.slice(0, 150) + '...'
              : project.description}
          </Desc>
          <Tags>
            {project.technologies.map(t => (
              <Tag key={t} $bg={TAG_COLORS[t] || '#6c63ff22'} $color={TAG_TEXT[t] || '#a78bfa'}>
                {t}
              </Tag>
            ))}
          </Tags>
          <Actions>
            {project.githubUrl && (
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</Link>
            )}
            {project.liveUrl && (
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">Demo</Link>
            )}
            {editable && (
              <>
                <EditBtn onClick={onEdit}>Editar</EditBtn>
                <DelBtn onClick={() => setShowModal(true)}>Deletar</DelBtn>
              </>
            )}
          </Actions>
        </Body>
      </Card>

      {showModal && (
        <Modal
          title="Deletar projeto"
          message={`Tem certeza que deseja deletar "${project.title}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Deletar permanentemente"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </>
  )
}

const Card = styled.article`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px #0005;
  }
`

const Thumb = styled.img`
  width: 100%; height: 180px; object-fit: cover;
`

const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`

const TopRow = styled.div`
  display: flex; align-items: center; gap: 8px;
`

const Status = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  color: ${p => p.$color};
  background: ${p => p.$color}22;
  border: 1px solid ${p => p.$color}44;
`

const DateLabel = styled.span`
  font-size: 11px;
  color: var(--muted);
  margin-left: auto;
`

const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
`

const Desc = styled.p`
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
  flex: 1;
`

const Tags = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px;
`

const Tag = styled.span<{ $bg: string; $color: string }>`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  font-weight: 500;
`

const Actions = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px;
`

const Link = styled.a`
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 6px;
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  transition: background 0.2s;
  &:hover { background: var(--border); }
`

const EditBtn = styled.button`
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 6px;
  background: var(--accent)22;
  border: 1px solid var(--accent)55;
  color: var(--accent2);
  font-weight: 500;
  transition: background 0.2s;
  &:hover { background: var(--accent)44; }
`

const DelBtn = styled.button`
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 6px;
  background: var(--danger)22;
  border: 1px solid var(--danger)44;
  color: var(--danger);
  font-weight: 500;
  transition: background 0.2s;
  &:hover { background: var(--danger)44; }
`