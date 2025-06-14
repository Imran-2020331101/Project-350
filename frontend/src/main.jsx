import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router} from 'react-router-dom'
import {Provider} from 'react-redux'
import store,{persistor} from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react';
import ScrollToTop from './components/Shared/ScrollToTop.jsx';
import Loader from './components/Shared/Loader.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <Router>
          <ScrollToTop />
          <App/>
        </Router>
        
      </PersistGate>
    </Provider>
  </StrictMode>,
)
