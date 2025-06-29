import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const BudgetPage = () => {
  const { theme } = useTheme();

  return (
    <div className="budget-page fade-in">
      <div className="page-header">
        <h1>Budget Management</h1>
        <p>Plan and track your monthly budget</p>
      </div>
      
      <div className="budget-content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Monthly Budget Overview</h3>
          </div>
          <div>
            <p>Budget management features will be implemented here.</p>
            <p>Current theme: <strong>{theme}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;