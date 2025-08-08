// src/pages/UpdateEmployee.jsx - COMPLETE WITH ALL FIELDS
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useHttp } from '../api/http';
import '../App.css';

export default function UpdateEmployee() {
  const { id } = useParams();
  const http = useHttp();
  const navigate = useNavigate();
  const { register, reset, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  useEffect(() => {
    async function loadEmployee() {
      try {
        const employee = await http(`http://localhost:8080/api/employee/${id}`);
        console.log('Loaded employee:', employee);
        
        const formattedEmployee = {
          ...employee,
          hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : ''
        };
        
        reset(formattedEmployee);
      } catch (error) {
        alert('Failed to load employee: ' + error.message);
      }
    }

    if (id) loadEmployee();
  }, [id, http, reset]);

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

      await http(`http://localhost:8080/api/employee/${id}`, {
        method: 'PUT',
        body: JSON.stringify(employeeData)
      });
      
      alert('✅ Employee updated successfully!');
      navigate('/employees');
    } catch (error) {
      alert('❌ Failed to update employee: ' + error.message);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>✏️ Edit Employee</h1>
        <button className="logout-btn" onClick={() => navigate('/employees')}>
          ← Back to List
        </button>
      </div>

      <div className="form-container">
        <h2 className="form-title">Update Employee Information</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              className="form-input"
              {...register('firstname', { required: 'First name is required' })}
            />
            {errors.firstname && <div className="error">{errors.firstname.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              className="form-input"
              {...register('lastname', { required: 'Last name is required' })}
            />
            {errors.lastname && <div className="error">{errors.lastname.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <div className="error">{errors.email.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Employee Code</label>
            <input className="form-input" {...register('employeeCode')} />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input className="form-input" {...register('department')} />
          </div>

          <div className="form-group">
            <label className="form-label">Position</label>
            <input className="form-input" {...register('position')} />
          </div>

          <div className="form-group">
            <label className="form-label">Hire Date</label>
            <input type="date" className="form-input" {...register('hireDate')} />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? '💾 Updating...' : '✅ Update Employee'}
          </button>
        </form>
      </div>
    </div>
  );
}
