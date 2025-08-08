// src/pages/AddEmployee.jsx - IMPROVED ERROR HANDLING
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useHttp } from '../api/http';
import '../App.css';

export default function AddEmployee() {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();
  const http = useHttp();
  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      const employeeData = {
        firstname: data.firstname?.trim(),
        lastname: data.lastname?.trim(),
        email: data.email?.trim(),
        employeeCode: data.employeeCode?.trim() || null,
        department: data.department?.trim() || null,
        position: data.position?.trim() || null,
        hireDate: data.hireDate || null
      };

      console.log('Sending employee data:', employeeData);

      const response = await http('http://localhost:8080/api/employee', {
        method: 'POST',
        body: JSON.stringify(employeeData)
      });
      
      console.log('Employee created response:', response);
      alert('✅ Employee added successfully!');
      navigate('/employees');
      
    } catch (error) {
      console.error('Add employee error:', error);
      
      // ✅ Better error handling
      if (error.message.includes('JSON')) {
        alert('❌ Server response error. Employee may have been created. Please check the employee list.');
        navigate('/employees'); // Go back to see if it was actually created
      } else {
        alert('❌ Failed to add employee: ' + error.message);
      }
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>➕ Add New Employee</h1>
        <button className="logout-btn" onClick={() => navigate('/employees')}>
          ← Back to List
        </button>
      </div>

      <div className="form-container">
        <h2 className="form-title">Employee Information</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              className="form-input"
              placeholder="Enter first name"
              {...register('firstname', { required: 'First name is required' })}
            />
            {errors.firstname && <div className="error">{errors.firstname.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              className="form-input"
              placeholder="Enter last name"
              {...register('lastname', { required: 'Last name is required' })}
            />
            {errors.lastname && <div className="error">{errors.lastname.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter email address"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && <div className="error">{errors.email.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Employee Code</label>
            <input
              className="form-input"
              placeholder="Enter employee code (e.g., EMP001)"
              {...register('employeeCode')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              className="form-input"
              placeholder="Enter department (e.g., Engineering, HR, Sales)"
              {...register('department')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Position</label>
            <input
              className="form-input"
              placeholder="Enter position (e.g., Software Developer, Manager)"
              {...register('position')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hire Date</label>
            <input
              type="date"
              className="form-input"
              {...register('hireDate')}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? '💾 Saving...' : '✅ Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
}
