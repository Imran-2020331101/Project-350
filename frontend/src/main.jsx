import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './redux/store.js'
import ScrollToTop from './components/Shared/ScrollToTop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <App/>
      </Router>
    </Provider>
  </StrictMode>,
)
