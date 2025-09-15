import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import CompaniesPage from './pages/CompaniesPage'
import CompanyRegistrationPage from './pages/company-registration/CompanyRegistration'
import EmailVerificationPage from './pages/EmailVerificationPage/EmailVerificationPage '
import RegistrationForm from './pages/registration-form/RegistrationForm'
import LoginPage from './pages/login-page/CompanyCodeScreen'
import CompanyCodeScreen from './pages/login-page/CompanyCodeScreen'
import LoginScreen from './pages/login-page/LoginScreen'

export default function App() {
  return (
    <div>
      {/* <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
        <div className="container">
          <a className="navbar-brand fw-semibold" href="#">TaskMgmt</a>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink to="/companies" className="nav-link">
                  Companies
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav> */}

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/companies" replace />} />
          <Route path="/companies" element={<CompaniesPage />} />
           <Route path="/register-company" element={<CompanyRegistrationPage/>}/>
          <Route path='/emailVerification' element={<EmailVerificationPage/>}/>
          <Route path='/registrationForm' element={<RegistrationForm/>}/>
          <Route path='/companyCodeScreen' element={<CompanyCodeScreen/>}/>
          <Route path='/loginScreen' element={<LoginScreen/>}/>
        </Routes>
      </main>
    </div>
  )
}
