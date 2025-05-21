import DashboardLayout from "../../../layouts/DashboardLayout";
import IssueForm from "../../../components/IssueForm";
import "../../../css/dashboardcss/student/StudentDashboard.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const StudentDashboard = () => {
  

  return (
    <DashboardLayout role="student">
      <div className="student-dashboard-container">
        {/* Header Section */}
        <header className="student-dashboard-header">
          <h1 className="student-dashboard-title">Student Dashboard</h1>
          <p className="student-dashboard-subtitle">Submit and track academic issues</p>
        </header>

        {/* Main Content Grid */}
        <div className="student-dashboard-content">
          {/* Left Column - Issue Form */}
          <section className="student-dashboard-section">
            <div className="card">
             
              <div className="card-body">
                <IssueForm />
              </div>
            </div>
          </section>
          <ToastContainer />

         
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;