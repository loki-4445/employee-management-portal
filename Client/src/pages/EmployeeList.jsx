// src/pages/EmployeeList.jsx - WITH SEARCH & FILTER (CORRECTED)
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHttp } from '../api/http';
import { useAuth } from '../auth/AuthProvider';
import '../App.css';

export default function EmployeeList() {
  const { logout } = useAuth();
  const [allEmployees, setAllEmployees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [sortBy, setSortBy] = useState('firstname');
  const [sortOrder, setSortOrder] = useState('asc');

  const http = useHttp();

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await http('https://employee-management-api-nql8.onrender.com/api/employee');
      console.log('Fetched employees:', data);
      setAllEmployees(data);
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      
      if (err.message.includes('Unauthorized') || err.message.includes('401')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [http, logout]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Get unique departments and positions for filter dropdowns
  const { departments, positions } = useMemo(() => {
    if (!allEmployees) return { departments: [], positions: [] };
    
    const deps = [...new Set(allEmployees.map(emp => emp.department).filter(Boolean))];
    const pos = [...new Set(allEmployees.map(emp => emp.position).filter(Boolean))];
    
    return {
      departments: deps.sort(),
      positions: pos.sort()
    };
  }, [allEmployees]);

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    if (!allEmployees) return [];

    let filtered = allEmployees.filter(employee => {
      const matchesSearch = searchTerm === '' || 
        `${employee.firstname} ${employee.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = departmentFilter === '' || employee.department === departmentFilter;
      const matchesPosition = positionFilter === '' || employee.position === positionFilter;

      return matchesSearch && matchesDepartment && matchesPosition;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (sortBy === 'firstname' || sortBy === 'lastname') {
        aValue = `${a.firstname} ${a.lastname}`;
        bValue = `${b.firstname} ${b.lastname}`;
      }

      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [allEmployees, searchTerm, departmentFilter, positionFilter, sortBy, sortOrder]);

  const deleteEmployee = useCallback(async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    
    try {
      await http(`https://employee-management-api-nql8.onrender.com/api/employee/${id}`, { method: 'DELETE' });
      setAllEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      alert('Failed to delete employee: ' + err.message);
    }
  }, [http]);

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setPositionFilter('');
    setSortBy('firstname');
    setSortOrder('asc');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⏳</div>
          Loading employees...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>👥 Employee Management</h1>
        <div className="header-info">
          {allEmployees && allEmployees.length > 0 && (
            <span className="org-info">
              Organization: {allEmployees[0]?.organization?.name || 'N/A'}
            </span>
          )}
          <button className="logout-btn" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Employee Section */}
      <div className="employee-section">
        <div className="section-header">
          <h2 className="section-title">
            Employees ({filteredEmployees.length}{allEmployees && allEmployees.length !== filteredEmployees.length ? ` of ${allEmployees.length}` : ''})
          </h2>
          <Link to="/add" className="add-btn">
            ➕ Add New Employee
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="filter-section">
          <div className="search-box">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, email, or employee code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">Department:</label>
              <select 
                value={departmentFilter} 
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Position:</label>
              <select 
                value={positionFilter} 
                onChange={(e) => setPositionFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Positions</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="firstname">Name</option>
                <option value="email">Email</option>
                <option value="department">Department</option>
                <option value="position">Position</option>
                <option value="hireDate">Hire Date</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Order:</label>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="filter-select"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {(searchTerm || departmentFilter || positionFilter || sortBy !== 'firstname' || sortOrder !== 'asc') && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {!allEmployees || allEmployees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3 className="empty-title">No Employees Found</h3>
            <p className="empty-message">
              You haven't added any employees yet. Get started by clicking the "Add New Employee" button above.
            </p>
            <Link to="/add" className="add-btn" style={{display: 'inline-flex'}}>
              ➕ Add Your First Employee
            </Link>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">No Matching Employees</h3>
            <p className="empty-message">
              No employees match your current search and filter criteria. Try adjusting your filters or search terms.
            </p>
            <button className="clear-filters-btn" onClick={clearFilters}>
              🗑️ Clear All Filters
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th className="mobile-hide">Employee Code</th>
                  <th>Name</th>
                  <th className="tablet-hide">Email</th>
                  <th className="mobile-hide">Department</th>
                  <th className="tablet-hide">Position</th>
                  <th className="desktop-only">Hire Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td className="mobile-hide">
                      <span className={!employee.employeeCode ? 'text-muted' : ''}>
                        {employee.employeeCode || 'N/A'}
                      </span>
                    </td>
                    <td data-label="Name">
                      <div className="employee-name">
                        <strong>
                          {employee.firstname} {employee.lastname}
                        </strong>
                        <div className="mobile-details">
                          {employee.department && (
                            <small className="mobile-dept">{employee.department}</small>
                          )}
                          {employee.position && (
                            <small className="mobile-pos">{employee.position}</small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="tablet-hide">
                      <span className={!employee.email ? 'text-muted' : ''}>
                        {employee.email || 'No email'}
                      </span>
                    </td>
                    <td className="mobile-hide">
                      <span className={!employee.department ? 'text-muted' : ''}>
                        {employee.department || 'N/A'}
                      </span>
                    </td>
                    <td className="tablet-hide">
                      <span className={!employee.position ? 'text-muted' : ''}>
                        {employee.position || 'N/A'}
                      </span>
                    </td>
                    <td className="desktop-only">
                      <span className={!employee.hireDate ? 'text-muted' : ''}>
                        {employee.hireDate 
                          ? new Date(employee.hireDate).toLocaleDateString() 
                          : 'Not set'}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="action-buttons">
                        <Link to={`/edit/${employee.id}`} className="action-btn" title="Edit">
                          ✏️
                        </Link>
                        <button 
                          onClick={() => deleteEmployee(employee.id)} 
                          className="action-btn delete-btn"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
