import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <Nav>
      <Inner>
        <Logo to="/">Dev<Accent>Hub</Accent></Logo>

        <Hamburger onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </Hamburger>

        <Links $open={menuOpen}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/discover" onClick={() => setMenuOpen(false)}>Descobrir</NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          )}
        </Links>

        <AuthArea $open={menuOpen}>
          {isAuthenticated ? (
            <>
              <UserName to="/profile/edit" onClick={() => setMenuOpen(false)}>
                👤 {user?.name.split(' ')[0]}
              </UserName>
              <BtnOutline onClick={handleLogout}>Sair</BtnOutline>
            </>
          ) : (
            <>
              <BtnOutline as={Link} to="/login" onClick={() => setMenuOpen(false)}>Entrar</BtnOutline>
              <BtnPrimary as={Link} to="/register" onClick={() => setMenuOpen(false)}>Criar conta</BtnPrimary>
            </>
          )}
        </AuthArea>
      </Inner>
    </Nav>
  )
}

const Nav = styled.header`
  background: #0d0f14cc;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
`

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 24px;
    gap: 12px;
  }
`

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  flex-shrink: 0;
`

const Accent = styled.span`
  color: var(--accent);
`

const Links = styled.nav<{ $open: boolean }>`
  display: flex;
  gap: 4px;
  flex: 1;

  @media (max-width: 768px) {
    display: ${p => p.$open ? 'flex' : 'none'};
    flex-direction: column;
    width: 100%;
    order: 3;
  }
`

const AuthArea = styled.div<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;

  @media (max-width: 768px) {
    display: ${p => p.$open ? 'flex' : 'none'};
    width: 100%;
    order: 4;
  }
`

const NavLink = styled(Link)`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: var(--muted);
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: var(--text);
    background: var(--surface2);
  }
`

const UserName = styled(Link)`
  font-size: 14px;
  color: var(--accent2);
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background 0.2s;
  &:hover { background: var(--surface2); }
`

const BtnBase = styled.button`
  padding: 7px 16px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  transition: opacity 0.2s, background 0.2s;
  display: inline-flex;
  align-items: center;
  &:hover { opacity: 0.85; }
`

const BtnOutline = styled(BtnBase)`
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
`

const BtnPrimary = styled(BtnBase)`
  background: var(--accent);
  color: #fff;
`

const Hamburger = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 4px;
  margin-left: auto;

  span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--text);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`