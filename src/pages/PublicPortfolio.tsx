import { useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useProjects } from '../contexts/ProjectContext'
import { useAuth } from '../contexts/AuthContext'
import ProjectCard from '../components/ProjectCard'
import Toast from '../components/Toast'

interface User {
  id: number
  name: string
  photo?: string
  title?: string
  bio?: string
  github?: string
  linkedin?: string
}

interface Comment {
  id: string
  projectId: string
  author: string
  text: string
  createdAt: string
}

export default function PublicPortfolio() {
  const { userId } = useParams<{ userId: string }>()
  const { getProjectsByUser } = useProjects()
  const { user: loggedUser } = useAuth()
  const [toast, setToast] = useState('')
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>(() =>
    JSON.parse(localStorage.getItem('comments') || '[]')
  )

  const allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]')
  const portfolioUser = allUsers.find(u => u.id === Number(userId))

  if (!portfolioUser) {
    return (
      <Page>
        <NotFound>
          <h2>Portfólio não encontrado</h2>
          <p>O desenvolvedor com esse ID não existe.</p>
        </NotFound>
      </Page>
    )
  }

  const projects = getProjectsByUser(portfolioUser.id)
    .filter(p => p.status !== 'Planejado')

  const projectComments = comments.filter(c => c.projectId === `portfolio-${userId}`)

  const sendComment = () => {
    if (!comment.trim()) return
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      projectId: `portfolio-${userId}`,
      author: loggedUser?.name || 'Anônimo',
      text: comment.trim(),
      createdAt: new Date().toISOString(),
    }
    const updated = [newComment, ...comments]
    setComments(updated)
    localStorage.setItem('comments', JSON.stringify(updated))
    setComment('')
    setToast('Comentário enviado!')
  }

  const deleteComment = (id: string) => {
    const updated = comments.filter(c => c.id !== id)
    setComments(updated)
    localStorage.setItem('comments', JSON.stringify(updated))
  }

  return (
    <Page>
      <Hero>
        <Avatar
          src={portfolioUser.photo || 'https://placehold.co/100x100/161a23/6c63ff?text=' + portfolioUser.name[0]}
          alt={portfolioUser.name}
          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/161a23/6c63ff?text=' + portfolioUser.name[0] }}
        />
        <HeroInfo>
          <Name>{portfolioUser.name}</Name>
          {portfolioUser.title && <TitleLabel>{portfolioUser.title}</TitleLabel>}
          {portfolioUser.bio && <Bio>{portfolioUser.bio}</Bio>}
          <Socials>
            {portfolioUser.github && (
              <SocialBtn href={portfolioUser.github} target="_blank" rel="noopener noreferrer">
                🐙 GitHub
              </SocialBtn>
            )}
            {portfolioUser.linkedin && (
              <SocialBtn href={portfolioUser.linkedin} target="_blank" rel="noopener noreferrer">
                💼 LinkedIn
              </SocialBtn>
            )}
          </Socials>
        </HeroInfo>
      </Hero>

      <Section>
        <SectionTitle>Projetos ({projects.length})</SectionTitle>
        {projects.length === 0 ? (
          <Empty>Nenhum projeto publicado ainda.</Empty>
        ) : (
          <Grid>
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </Grid>
        )}
      </Section>

      <Section>
        <SectionTitle>Comentários e feedback</SectionTitle>
        <CommentForm>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={loggedUser ? 'Deixe um comentário...' : 'Faça login para comentar.'}
            disabled={!loggedUser}
            maxLength={300}
            rows={3}
          />
          <CommentRow>
            <Counter>{comment.length}/300</Counter>
            <SendBtn onClick={sendComment} disabled={!loggedUser || !comment.trim()}>
              Enviar comentário
            </SendBtn>
          </CommentRow>
        </CommentForm>

        {projectComments.length === 0 ? (
          <Empty>Sem comentários ainda. Seja o primeiro!</Empty>
        ) : (
          <CommentList>
            {projectComments.map(c => (
              <CommentItem key={c.id}>
                <CommentHeader>
                  <Author>{c.author}</Author>
                  <DateStr>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</DateStr>
                  {loggedUser?.name === c.author && (
                    <DelComment onClick={() => deleteComment(c.id)}>Deletar</DelComment>
                  )}
                </CommentHeader>
                <CommentText>{c.text}</CommentText>
              </CommentItem>
            ))}
          </CommentList>
        )}
      </Section>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </Page>
  )
}

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px;
`

const NotFound = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: var(--muted);
  h2 { color: var(--text); margin-bottom: 8px; }
`

const Hero = styled.div`
  display: flex;
  gap: 32px;
  align-items: flex-start;
  margin-bottom: 56px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--border);

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`

const Avatar = styled.img`
  width: 100px; height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent);
  flex-shrink: 0;
`

const HeroInfo = styled.div`display: flex; flex-direction: column; gap: 8px;`

const Name = styled.h1`font-size: 28px; font-weight: 800;`

const TitleLabel = styled.p`
  font-size: 15px; color: var(--accent2); font-weight: 500;
`

const Bio = styled.p`font-size: 14px; color: var(--muted); max-width: 560px; line-height: 1.7;`

const Socials = styled.div`display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px;`

const SocialBtn = styled.a`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  transition: border-color 0.2s, background 0.2s;
  &:hover { border-color: var(--accent); background: var(--surface2); }
`

const Section = styled.section`margin-bottom: 56px;`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

const Empty = styled.p`color: var(--muted); font-size: 14px; padding: 24px 0;`

const CommentForm = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const CommentRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
`

const Counter = styled.span`font-size: 12px; color: var(--muted);`

const SendBtn = styled.button`
  padding: 9px 20px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 7px;
  font-size: 13px; font-weight: 600;
  transition: opacity 0.2s;
  &:hover:not(:disabled) { opacity: 0.85; }
  &:disabled { opacity: 0.4; }
`

const CommentList = styled.div`display: flex; flex-direction: column; gap: 16px;`

const CommentItem = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 20px;
`

const CommentHeader = styled.div`
  display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
`

const Author = styled.span`font-size: 13px; font-weight: 600;`
const DateStr = styled.span`font-size: 12px; color: var(--muted);`

const DelComment = styled.button`
  margin-left: auto;
  background: none; border: none;
  color: var(--danger); font-size: 12px;
  &:hover { text-decoration: underline; }
`

const CommentText = styled.p`font-size: 14px; color: var(--muted); line-height: 1.6;`