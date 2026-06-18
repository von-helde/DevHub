import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { useProjects } from '../contexts/ProjectContext'
import ProjectCard from '../components/ProjectCard'

export default function Dashboard() {
  const { user } = useAuth()
  const { getProjectsByUser } = useProjects()
  const navigate = useNavigate()
  const projects = user ? getProjectsByUser(user.id) : []

  return (
    <Page>
      <Top>
        <div>
          <Welcome>Olá, {user?.name.split(' ')[0]} 👋</Welcome>
          <Sub>Gerencie seus projetos e personalize seu portfólio.</Sub>
        </div>
        <Actions>
          <BtnOutline as={Link} to="/profile/edit">Editar perfil</BtnOutline>
          <BtnOutline as={`a`} href={`/portfolio/${user?.id}`} target="_blank">
            Ver portfólio público
          </BtnOutline>
          <BtnPrimary as={Link} to="/projects">+ Novo projeto</BtnPrimary>
        </Actions>
      </Top>

      <Stats>
        <Stat>
          <StatNum>{projects.length}</StatNum>
          <StatLabel>Projetos</StatLabel>
        </Stat>
        <Stat>
          <StatNum>{projects.filter(p => p.status === 'Concluído').length}</StatNum>
          <StatLabel>Concluídos</StatLabel>
        </Stat>
        <Stat>
          <StatNum>{projects.filter(p => p.status === 'Em Progresso').length}</StatNum>
          <StatLabel>Em progresso</StatLabel>
        </Stat>
      </Stats>

      <SectionTitle>Meus projetos</SectionTitle>

      {projects.length === 0 ? (
        <Empty>
          <EmptyIcon>📁</EmptyIcon>
          <p>Você não tem projetos ainda.</p>
          <BtnPrimary as={Link} to="/projects">Criar primeiro projeto</BtnPrimary>
        </Empty>
      ) : (
        <Grid>
          {projects.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              editable
              onEdit={() => navigate(`/projects/${p.id}/edit`)}
            />
          ))}
        </Grid>
      )}
    </Page>
  )
}

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
`

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 32px;
`

const Welcome = styled.h1`font-size: 24px; font-weight: 800; margin-bottom: 4px;`
const Sub = styled.p`font-size: 14px; color: var(--muted);`

const Actions = styled.div`
  display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
`

const BtnBase = styled.a`
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  transition: opacity 0.2s;
  display: inline-flex; align-items: center;
  &:hover { opacity: 0.8; }
`

const BtnOutline = styled(BtnBase)`
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
`

const BtnPrimary = styled(BtnBase)`
  background: var(--accent);
  color: #fff;
`

const Stats = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`

const Stat = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 28px;
  min-width: 120px;
`

const StatNum = styled.div`font-size: 28px; font-weight: 800; color: var(--accent2);`
const StatLabel = styled.div`font-size: 12px; color: var(--muted); margin-top: 4px;`

const SectionTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 20px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

const Empty = styled.div`
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--muted);
  font-size: 14px;
`

const EmptyIcon = styled.div`font-size: 40px;`