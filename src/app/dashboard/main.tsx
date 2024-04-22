import './style.css'

import { createRoot } from 'react-dom/client'
import { App } from './app'

const container = document.querySelector('#root')

if (!container) throw new Error('NOT_FOUND_CONTAINER_ELEMENT')

createRoot(container).render(<App />)
