import { Routes, Route, Navigate } from "react-router-dom";
import CompaniesPage from "../pages/CompaniesPage";
import CompanyRegistrationPage from "../pages/company-registration/CompanyRegistration";
import EmailVerificationPage from "../pages/EmailVerificationPage/EmailVerificationPage ";
import RegistrationForm from "../pages/registration-form/RegistrationForm";
// import LoginPage from '../pages/login-page/LoginPage';
import InviteUser from "../pages/invite-user/InviteUser";
import CompanyCodeScreen from "../pages/login-page/CompanyCodeScreen";
import LoginScreen from "../pages/login-page/LoginScreen";
import ProjectList from "../pages/Project/ProjectList";
import RegistrationFlow from "../pages/invite-user/RegistrationFlow";
import ValidateUser from "../pages/invite-user/ValidateUser";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/companycodescreen" replace />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/register-company" element={<CompanyRegistrationPage />} />
      <Route path="/companies/auth/verify-email" element={<EmailVerificationPage />} />
      <Route path="/registrationForm" element={<RegistrationForm />} />
      {/* <Route path='/login' element={<LoginPage/>}/> */}
      <Route path="/invite-user" element={<InviteUser />} />
      <Route path="/companycodescreen" element={<CompanyCodeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/project" element={<ProjectList />} />
      <Route path="invited-user-registration-flow" element={<RegistrationFlow/>}/>
      <Route path="/register" element={<ValidateUser/>}/>
    </Routes>
  );
};
export default AppRoutes;
