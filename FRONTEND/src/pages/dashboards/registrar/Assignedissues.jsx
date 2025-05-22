import React, { useEffect, useState } from 'react';


// Modal component for viewing attachments
const AttachmentModal = ({ isOpen, onClose, attachmentUrl }) => {
  if (!isOpen) return null;
  
  // Determine file type to handle display appropriately
  const isImage = /\.(jpeg|jpg|gif|png|svg)$/i.test(attachmentUrl);
  const isPdf = /\.pdf$/i.test(attachmentUrl);
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Attachment Viewer</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {isImage ? (
            <img src={attachmentUrl} alt="Attachment" className="attachment-preview" />
          ) : isPdf ? (
            <iframe 
              src={attachmentUrl} 
              title="PDF Viewer" 
              className="pdf-preview"
              width="100%" 
              height="500px" 
            />
          ) : (
            <div className="fallback-viewer">
              <p>This file type may not be viewable in the browser.</p>
              <a 
                href={attachmentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="download-link"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssignedIssues = ({ userToken }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState(null);

  useEffect(() => {
    const fetchAssignedIssues = async () => {
      if (!userToken) {
        setError('Authentication token not available');
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch('https://backendaits.onrender.com/api/issues/?status=assigned', {
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Assigned Issues API response:", data);
        setIssues(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching assigned issues:', error);
        setError('Failed to load assigned issues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssignedIssues();
  }, [userToken]);

  const openAttachmentModal = (url) => {
    setCurrentAttachment(url);
    setModalOpen(true);
  };

  const closeAttachmentModal = () => {
    setModalOpen(false);
    setCurrentAttachment(null);
  };
  
  return (
    <div className="assigned-issues-section">
      <h2 className="section-title">Assigned Issues</h2>
      
      {loading ? (
        <div className="loading-container">
          <p>Loading assigned issues...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="no-data-container">
          <p>No assigned issues found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="issues-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Student Number</th>
                <th>Title</th>
                <th>Attachment</th>
                <th>Status</th>
                <th>Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.id}</td>
                  <td>
                    {issue.user?.first_name} {issue.user?.last_name}
                  </td>
                  <td>{issue.user?.student_number}</td>
                  <td>{issue.title}</td>
                  <td>
                    {issue.attachment ? (
                      <button
                        onClick={() => openAttachmentModal(issue.attachment)}
                        className="attachment-button"
                      >
                        View Attachment
                      </button>
                    ) : (
                      <span className="no-attachment">No Attachment</span>
                    )}
                  </td>
                  <td>
                    <span className="status-badge status-assigned">
                      {issue.status}
                    </span>
                  </td>
                  <td>
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for attachment viewing */}
      <AttachmentModal 
        isOpen={modalOpen} 
        onClose={closeAttachmentModal} 
        attachmentUrl={currentAttachment} 
      />

      {/* CSS for the modal */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: white;
          border-radius: 5px;
          width: 80%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          border-bottom: 1px solid #eee;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #555;
        }
        
        .modal-body {
          padding: 20px;
          overflow: auto;
          max-height: calc(90vh - 60px);
        }
        
        .attachment-preview {
          max-width: 100%;
          max-height: 70vh;
          display: block;
          margin: 0 auto;
        }
        
        .pdf-preview {
          border: none;
        }
        
        .fallback-viewer {
          text-align: center;
          padding: 20px;
        }
        
        .download-link {
          display: inline-block;
          margin-top: 15px;
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border-radius: 4px;
          text-decoration: none;
        }
        
        .attachment-button {
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .attachment-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default AssignedIssues;
