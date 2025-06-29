import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

const DashboardPage = () => {
  const { theme, sidebarCollapsed } = useTheme();

  useEffect(() => {
    console.log("Dashboard loaded");
    console.log("Current theme:", theme);
    console.log("Sidebar collapsed:", sidebarCollapsed);
  }, [theme, sidebarCollapsed]);

  return (
    <div className="dashboard-page fade-in">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome to your budget management dashboard</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Balance</h3>
          </div>
          <div className="card-content">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-600)' }}>
              $5,240.50
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              +12.5% from last month
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Monthly Budget</h3>
          </div>
          <div className="card-content">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-600)' }}>
              $3,000.00
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              $1,240.50 remaining
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Expenses This Month</h3>
          </div>
          <div className="card-content">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-600)' }}>
              $1,759.50
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              58.7% of budget used
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Savings Goal</h3>
          </div>
          <div className="card-content">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-600)' }}>
              $850.00
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              85% of $1,000 goal
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">Recent Transactions</h3>
          </div>
          <div className="card-content">
            <div className="transaction-list">
              <div className="transaction-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-primary)' }}>
                <div>
                  <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Grocery Store</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Today, 2:30 PM</div>
                </div>
                <div style={{ fontWeight: '600', color: 'var(--error-600)' }}>-$85.40</div>
              </div>
              
              <div className="transaction-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-primary)' }}>
                <div>
                  <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Salary Deposit</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Yesterday, 9:00 AM</div>
                </div>
                <div style={{ fontWeight: '600', color: 'var(--success-600)' }}>+$3,200.00</div>
              </div>
              
              <div className="transaction-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                <div>
                  <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Electric Bill</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>2 days ago, 11:15 AM</div>
                </div>
                <div style={{ fontWeight: '600', color: 'var(--error-600)' }}>-$120.50</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;