import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import "./Signup.css"

export default function Signup() {
  const { register: reg, handleSubmit, formState: { isSubmitting, errors } } = useForm();
  const { register } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      await register({ ...data, organizationId: null });
      alert('Registered! You can log in now.');
      navigate('/login');
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="signup-wrapper">
      <form className="signup-card" onSubmit={handleSubmit(onSubmit)}>
        <button 
          type="button" 
          className="back-btn"
          onClick={() => navigate('/login')}
          aria-label="Go back to login"
        >
          ← Back
        </button>

        <h2>Create account</h2>
        
        {/* ✅ Properly structured form fields */}
        <div className="form-field">
          <input 
            placeholder="Username" 
            {...reg('username', { required: 'Username is required' })} 
            aria-label="Username"
            className={errors.username ? 'error-input' : ''}
          />
          {errors.username && <span className="error-text">{errors.username.message}</span>}
        </div>
        
        <div className="form-field">
          <input 
            placeholder="Email" 
            type="email"
            {...reg('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })} 
            aria-label="Email"
            className={errors.email ? 'error-input' : ''}
          />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </div>
        
        <div className="form-field">
          <input 
            placeholder="Password" 
            type="password"
            {...reg('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })} 
            aria-label="Password"
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && <span className="error-text">{errors.password.message}</span>}
        </div>
        
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Creating…' : 'Sign up'}
        </button>

        <p className="signup-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} role="button" tabIndex={0}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
