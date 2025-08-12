import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useHttp } from '../api/http';

export default function EmployeeForm() {
  const { register, handleSubmit, formState:{isSubmitting} } = useForm();
  const navigate = useNavigate();
  const http = useHttp();

  async function onSubmit(data) {
    await http('https://employee-management-api-nql8.onrender.com/api/employee', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(data)
    });
    navigate('/employees');
  }

  return (
    <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
      <h2>New Employee</h2>
      <input placeholder="First name" {...register('firstname',{required:true})}/>
      <input placeholder="Last  name" {...register('lastname', {required:true})}/>
      <input placeholder="Email"      {...register('email',     {required:true})}/>
      <button disabled={isSubmitting}>
        {isSubmitting? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}
