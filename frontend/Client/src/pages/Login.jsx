import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { FiUser, FiLock } from 'react-icons/fi';
import './Login.css';

export default function Login() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate  = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password);
      navigate('/employees');
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign in</h2>

        <label>
          <FiUser /> Username
          <input {...register('username', { required: true })} />
        </label>

        <label>
          <FiLock /> Password
          <input type="password" {...register('password', { required: true })} />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Login'}
        </button>

        <p className="signup-link">
          Don&apos;t have an account?{' '}
          <span onClick={() => navigate('/signup')}>Sign Up</span>
        </p>
      </form>
    </div>
  );
}
