import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { PitchDeck } from './pages/PitchDeck'

const isDeck = /^\/pitch-deck-me\/?$/.test(window.location.pathname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDeck ? <PitchDeck /> : <App />}
  </StrictMode>,
)
