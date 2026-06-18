import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <Page>
      <Hero>
        <Eyebrow>Plataforma de portfólios para devs</Eyebrow>
        <Headline>Mostre seu trabalho.<br /><Grad>Seja encontrado.</Grad></Headline>
        <Sub>
          Crie seu portfólio profissional, adicione projetos reais e conecte-se
          com outros desenvolvedores em um só lugar.
        </Sub>
        <CallToAction>
          {isAuthenticated ? (
            <BtnPrimary as={Link} to="/dashboard">Ir para o Dashboard →</BtnPrimary>
          ) : (
            <>
              <BtnPrimary as={Link} to="/register">Criar portfólio grátis</BtnPrimary>
              <BtnOutline as={Link} to="/discover">Ver portfólios</BtnOutline>
            </>
          )}
        </CallToAction>
      </Hero>

      <Features>
        {FEATURES.map(f => (
          <Feature key={f.title}>
            <FIcon>{f.icon}</FIcon>
            <FTitle>{f.title}</FTitle>
            <FDesc>{f.desc}</FDesc>
          </Feature>
        ))}
      </Features>
    </Page>
  )
}

const FEATURES = [
  { icon: '🚀', title: 'Portfólio público', desc: 'Uma URL única e compartilhável com seus projetos e informações de contato.' },
  { icon: '🛠️', title: 'Gerencie projetos', desc: 'Adicione, edite e organize seus projetos com tecnologias, links e imagens.' },
  { icon: '🔍', title: 'Descubra talentos', desc: 'Busque portfólios por nome, tecnologia ou título profissional.' },
  { icon: '💬', title: 'Receba feedback', desc: 'Visitantes podem deixar comentários nos seus projetos.' },
]

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px;
`

const Hero = styled.section`
  text-align: center;
  padding: 60px 0 80px;
  animation: ${fadeUp} 0.5s ease;
`

const Eyebrow = styled.p`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--accent2);
  margin-bottom: 20px;
`

const Headline = styled.h1`
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1px;
  margin-bottom: 20px;
`

const Grad = styled.span`
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Sub = styled.p`
  font-size: 17px;
  color: var(--muted);
  max-width: 520px;
  margin: 0 auto 36px;
  line-height: 1.7;
`

const CallToAction = styled.div`
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
`

const BtnBase = styled.a`
  padding: 13px 28px;
  border-radius: 9px;
  font-size: 15px;
  font-weight: 600;
  transition: opacity 0.2s, transform 0.2s;
  display: inline-flex; align-items: center;
  &:hover { opacity: 0.88; transform: translateY(-1px); }
`

const BtnPrimary = styled(BtnBase)`
  background: var(--accent);
  color: #fff;
`

const BtnOutline = styled(BtnBase)`
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
`

const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`

const Feature = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 24px;
  transition: border-color 0.2s;
  &:hover { border-color: var(--accent); }
`

const FIcon = styled.div`font-size: 28px; margin-bottom: 14px;`

const FTitle = styled.h3`font-size: 15px; font-weight: 700; margin-bottom: 8px;`

const FDesc = styled.p`font-size: 13px; color: var(--muted); line-height: 1.6;`