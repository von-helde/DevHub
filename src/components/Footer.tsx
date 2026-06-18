import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default function Footer() {
  return (
    <Foot>
      <Inner>
        <Logo>Dev<Accent>Hub</Accent></Logo>
        <Links>
          <Link to="/">Home</Link>
          <Link to="/discover">Descobrir</Link>
          <Link to="/register">Criar conta</Link>
        </Links>
        <Copy>© {new Date().getFullYear()} DevHub. Todos os direitos reservados.</Copy>
      </Inner>
    </Foot>
  )
}

const Foot = styled.footer`
  border-top: 1px solid var(--border);
  margin-top: auto;
  padding: 32px 24px;
`

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`

const Logo = styled.span`
  font-size: 17px;
  font-weight: 800;
`

const Accent = styled.span`color: var(--accent);`

const Links = styled.nav`
  display: flex;
  gap: 20px;
  a { font-size: 13px; color: var(--muted); transition: color 0.2s; }
  a:hover { color: var(--text); }
`

const Copy = styled.span`
  font-size: 12px;
  color: var(--muted);
  margin-left: auto;

  @media (max-width: 600px) { margin-left: 0; }
`