import { Routes, Route, Navigate } from 'react-router-dom'
import CompaniesPage from '../pages/CompaniesPage';
import CompanyRegistrationPage from '../pages/company-registration/CompanyRegistration';
import EmailVerificationPage from '../pages/EmailVerificationPage/EmailVerificationPage ';
import RegistrationForm from '../pages/registration-form/RegistrationForm';
import LoginPage from '../pages/login-page/LoginPage';
import InviteUser from '../pages/invite-user/InviteUser';

const AppRoutes = () => {
    return (
         <Routes>
          <Route path="/" element={<Navigate to="/companies" replace />} />
          <Route path="/companies" element={<CompaniesPage/>} />
          <Route path="/register-company" element={<CompanyRegistrationPage/>}/>
          <Route path='/emailVerification' element={<EmailVerificationPage/>}/>
          <Route path='/registrationForm' element={<RegistrationForm/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/invite-user' element={<InviteUser/>}/>
          
        </Routes>
    )
}
export default AppRoutes;