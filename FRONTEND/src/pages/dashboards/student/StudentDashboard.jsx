import DashboardLayout from "../../../layouts/DashboardLayout";
import IssueCard from "../../../components/IssueCard";
import IssueForm from "../../../components/IssueForm";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchIssues();
    fetchNotifications();
  }, []);

  const fetchIssues = async () => {
    const response = await fetch("/api/issues?student=true");
    const data = await response.json();
    setIssues(data);
  };

  const fetchNotifications = async () => {
    const response = await fetch("/api/notifications?student=true");
    const data = await response.json();
    setNotifications(data);
  };

  return (
    <DashboardLayout role="student">
      <div className="dashboard-container">
        {/* Header Section */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <p className="dashboard-subtitle">Submit and track academic issues</p>
        </header>

        {/* Main Content Grid */}
        <div className="dashboard-content">
          {/* Left Column - Issue Form */}
          <section className="dashboard-section">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Submit New Issue</h2>
              </div>
              <div className="card-body">
                <IssueForm />
              </div>
            </div>
          </section>

          {/* Right Column - Issues and Notifications */}
          <div className="dashboard-right-column">
            {/* Ongoing Issues */}
            <section className="dashboard-section">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Ongoing Issues</h2>
                  <span className="badge">{issues.length} active</span>
                </div>
                <div className="card-body">
                  {issues.length > 0 ? (
                    <div className="issues-list">
                      {issues.map((issue) => (
                        <IssueCard
                          key={issue.id}
                          title={issue.title}
                          status={issue.status}
                          date={issue.createdAt}
                          priority={issue.priority}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No ongoing issues at the moment</p>
                      <button className="btn btn-link">Create your first issue</button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="dashboard-section">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Recent Notifications</h2>
                  {notifications.length > 0 && (
                    <Link to="/notifications" className="view-all">View All</Link>
                  )}
                </div>
                <div className="card-body">
                  {notifications.length > 0 ? (
                    <ul className="notifications-list">
                      {notifications.slice(0, 3).map((notification) => (
                        <li key={notification.id} className="notification-item">
                          <div className="notification-content">
                            <p>{notification.message}</p>
                            <span className="notification-time">{notification.time}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-state">
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;