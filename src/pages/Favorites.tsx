import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useProjects } from '../contexts/ProjectContext'

interface User {
  id: number
  name: string
  photo?: string
  title?: string
  bio?: string
}

const TECH_FILTERS = ['React', 'TypeScript', 'Node.js', 'Python', 'Vue', 'CSS', 'SQL']
const PAGE_SIZE = 12

export default function Discover() {
  const { projects } = useProjects()
  const [search, setSearch] = useState('')
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [page, setPage] = useState(1)

  const allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]')

  const toggleTech = (t: string) => {
    setSelectedTechs(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
    setPage(1)
  }

  const results = useMemo(() => {
    const q = search.toLowerCase()
    return allUsers.filter(u => {
      const matchSearch = !q ||
        u.name.toLowerCase().includes(q) ||
        (u.title || '').toLowerCase().includes(q) ||
        (u.bio || '').toLowerCase().includes(q)

      const userTechs = new Set(projects
        .filter(p => p.userId === u.id)
        .flatMap(p => p.technologies))

      const matchTech = selectedTechs.every(t => userTechs.has(t))

      return matchSearch && matchTech
    })
  }, [search, selectedTechs, allUsers, projects])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const paginated = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const getUserTechs = (userId: number) => {
    const techs = projects
      .filter(p => p.userId === userId)
      .flatMap(p => p.technologies)
    return [...new Set(techs)].slice(0, 5)
  }

  return (
    <Page>
      <PageHeader>
        <h1>Descobrir desenvolvedores</h1>
        <Sub>Encontre talentos pelo nome, tecnologia ou título profissional.</Sub>
      </PageHeader>

      <SearchBar>
        <SearchIcon>🔍</SearchIcon>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar por nome, título ou tecnologia..."
        />
      </SearchBar>

      <Filters>
        <FiltersLabel>Filtrar por tecnologia:</FiltersLabel>
        <FilterBtns>
          {TECH_FILTERS.map(t => (
            <FilterBtn
              key={t}
              $active={selectedTechs.includes(t)}
              onClick={() => toggleTech(t)}
            >
              {t}
            </FilterBtn>
          ))}
          {selectedTechs.length > 0 && (
            <ClearBtn onClick={() => { setSelectedTechs([]); setPage(1) }}>
              ✕ Limpar filtros
            </ClearBtn>
          )}
        </FilterBtns>
      </Filters>

      <ResultCount>
        {results.length} {results.length === 1 ? 'desenvolvedor encontrado' : 'desenvolvedores encontrados'}
      </ResultCount>

      {paginated.length === 0 ? (
        <Empty>
          <EmptyIcon>🔍</EmptyIcon>
          <p>Nenhum portfólio encontrado.</p>
          <p>Tente outros termos ou remova os filtros.</p>
        </Empty>
      ) : (
        <Grid>
          {paginated.map(u => {
            const techs = getUserTechs(u.id)
            const projCount = projects.filter(p => p.userId === u.id).length
            return (
              <DevCard key={u.id}>
                <Avatar
                  src={u.photo || `https://placehold.co/80x80/161a23/6c63ff?text=${u.name[0]}`}
                  alt={u.name}
                  onError={e => {
                    ;(e.target as HTMLImageElement).src =
                      `https://placehold.co/80x80/161a23/6c63ff?text=${u.name[0]}`
                  }}
                />
                <DevName>{u.name}</DevName>
                {u.title && <DevTitle>{u.title}</DevTitle>}
                {u.bio && <DevBio>{u.bio.slice(0, 90)}{u.bio.length > 90 ? '...' : ''}</DevBio>}
                {techs.length > 0 && (
                  <Tags>
                    {techs.map(t => <Tag key={t}>{t}</Tag>)}
                  </Tags>
                )}
                <DevFooter>
                  <ProjCount>{projCount} projeto{projCount === 1 ? '' : 's'}</ProjCount>
                  <ViewBtn as={Link} to={`/portfolio/${u.id}`}>Ver portfólio →</ViewBtn>
                </DevFooter>
              </DevCard>
            )
          })}
        </Grid>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            ← Anterior
          </PageBtn>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <PageNum key={n} $active={n === page} onClick={() => setPage(n)}>
              {n}
            </PageNum>
          ))}
          <PageBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Próximo →
          </PageBtn>
        </Pagination>
      )}
    </Page>
  )
}

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
`

const PageHeader = styled.div`
  margin-bottom: 32px;
  h1 { font-size: 26px; font-weight: 800; margin-bottom: 6px; }
`

const Sub = styled.p`font-size: 14px; color: var(--muted);`

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 20px;

  input {
    padding-left: 40px;
    font-size: 15px;
    height: 48px;
  }
`

const SearchIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
`

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`

const FiltersLabel = styled.span`font-size: 13px; color: var(--muted); white-space: nowrap;`

const FilterBtns = styled.div`display: flex; gap: 8px; flex-wrap: wrap;`

const FilterBtn = styled.button<{ $active: boolean }>`
  padding: 5px 13px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${p => p.$active ? 'var(--accent)' : 'var(--border)'};
  background: ${p => p.$active ? 'var(--accent)33' : 'var(--surface)'};
  color: ${p => p.$active ? 'var(--accent2)' : 'var(--muted)'};
  transition: all 0.15s;
`

const ClearBtn = styled.button`
  padding: 5px 13px;
  border-radius: 20px;
  font-size: 12px;
  background: var(--danger)22;
  border: 1px solid var(--danger)44;
  color: var(--danger);
`

const ResultCount = styled.p`
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 20px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

const DevCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }
`

const Avatar = styled.img`
  width: 64px; height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent);
  margin-bottom: 4px;
`

const DevName = styled.h3`font-size: 15px; font-weight: 700;`
const DevTitle = styled.p`font-size: 12px; color: var(--accent2); font-weight: 500;`
const DevBio = styled.p`font-size: 12px; color: var(--muted); line-height: 1.5; flex: 1;`

const Tags = styled.div`display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px;`

const Tag = styled.span`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--accent)22;
  color: var(--accent2);
  font-weight: 500;
`

const DevFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`

const ProjCount = styled.span`font-size: 12px; color: var(--muted);`

const ViewBtn = styled.a`
  font-size: 12px;
  font-weight: 600;
  color: var(--accent2);
  padding: 5px 10px;
  border-radius: 6px;
  background: var(--accent)11;
  border: 1px solid var(--accent)33;
  transition: background 0.2s;
  &:hover { background: var(--accent)22; }
`

const Empty = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--muted);
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

const EmptyIcon = styled.div`font-size: 36px;`

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
  flex-wrap: wrap;
`

const PageBtn = styled.button`
  padding: 8px 16px;
  border-radius: 7px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 13px;
  font-weight: 500;
  transition: background 0.2s;
  &:hover:not(:disabled) { background: var(--surface2); }
  &:disabled { opacity: 0.4; }
`

const PageNum = styled.button<{ $active: boolean }>`
  width: 36px; height: 36px;
  border-radius: 7px;
  border: 1px solid ${p => p.$active ? 'var(--accent)' : 'var(--border)'};
  background: ${p => p.$active ? 'var(--accent)' : 'var(--surface)'};
  color: ${p => p.$active ? '#fff' : 'var(--text)'};
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
`