import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0f14;
    --surface: #161a23;
    --surface2: #1e2330;
    --border: #2a3044;
    --accent: #6c63ff;
    --accent2: #a78bfa;
    --text: #e8eaf0;
    --muted: #8892a4;
    --success: #34d399;
    --danger: #f87171;
    --warning: #fbbf24;
    --radius: 10px;
    --font: 'Inter', system-ui, sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    font-size: 15px;
    line-height: 1.6;
    min-height: 100vh;
  }

  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; font-family: inherit; }
  img { max-width: 100%; display: block; }

  input, textarea, select {
    font-family: inherit;
    font-size: 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: var(--radius);
    padding: 10px 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
  }

  input:focus, textarea:focus, select:focus {
    border-color: var(--accent);
  }

  input::placeholder, textarea::placeholder {
    color: var(--muted);
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }
`