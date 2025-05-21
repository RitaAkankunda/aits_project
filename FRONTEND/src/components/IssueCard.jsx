import { useState } from 'react';

const IssueCard = ({ id, title, description, status, comments = [], onUpdateStatus, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  // Handle adding a new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(id, newComment);  // Notify parent component about the new comment
      setNewComment('');  // Clear the comment input field after submission
    }
  };

  // Handle status change (Resolved, In Progress, Pending)
  const handleStatusChange = (newStatus) => {
    onUpdateStatus(id, newStatus);  // Notify parent component to update the status
  };

  return (
    <div className="issue-card">
      <h3>{title}</h3>
      <p><strong>Description:</strong> {description}</p>
      <p><strong>Status:</strong> {status}</p> 

      {/* Buttons to change issue status */}
      <div className="status-buttons">
        <button onClick={() => handleStatusChange('Resolved')}>Mark as Resolved</button>
        <button onClick={() => handleStatusChange('In Progress')}>Mark as In Progress</button>
        <button onClick={() => handleStatusChange('Pending')}>Mark as Pending</button>
      </div>

      {/* Comment section */}
      <div className="comment-section">
        <h4>Comments</h4>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        )}

        {/* Form to add a new comment */}
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}  // Update new comment state
            placeholder="Add a comment"
            rows="3"
          ></textarea>
          <button type="submit">Add Comment</button>
        </form>
      </div>
    </div>
  );
};

export default IssueCard;
