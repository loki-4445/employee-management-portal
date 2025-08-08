import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import "./Signup.css"
export default function Signup() {
  const { register: reg, handleSubmit, formState:{isSubmitting} } = useForm();
  const { register } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      await register({ ...data, organizationId: null });
      alert('Registered!  You can log in now.');
      navigate('/login');
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
      <h2>Create account</h2>
      <input placeholder="Username"  {...reg('username', { required:true })} />
      <input placeholder="Email"     {...reg('email',    { required:true })} />
      <input placeholder="Password"  type="password"
             {...reg('password', { required:true })} />
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Sign up'}
      </button>
    </form>
  );
}
