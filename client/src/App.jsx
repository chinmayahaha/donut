import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import SignupForm from './components/SignupForm'
import ProjectsPage from './components/ProjectsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsPage />} />
<Route path="/signup" element={<SignupForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App