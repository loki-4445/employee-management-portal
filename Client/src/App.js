
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import PrivateRoute from './auth/PrivateRoute';
import Login from './pages/Login';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import UpdateEmployee from './pages/UpdateEmployee';
import SignUp from './pages/SignUp';

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >     
      <AuthProvider> 
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/employees" element={
            <PrivateRoute><EmployeeList /></PrivateRoute>
          }/>
          <Route path="/add" element={
            <PrivateRoute><AddEmployee /></PrivateRoute>
          }/>
          <Route path="/edit/:id" element={
            <PrivateRoute><UpdateEmployee /></PrivateRoute>
          }/>

          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
