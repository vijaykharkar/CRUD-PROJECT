// MemberForm.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

const MemberForm = ({ show, onClose, onSubmit, editMember }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      age: e.target.age.value,
      subject: e.target.subject.value,
      score: e.target.score.value,
    };
    onSubmit(formData); // Pass the form data to the onSubmit handler
  };

  return (
    <Modal centered show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editMember ? "Edit Member" : "Add New Member"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Member Name:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              defaultValue={editMember ? editMember.name : ""}
              required
            />
          </div>
          <div className="form-group">
            <label>Member Email:</label>
            <input
              type="email"
              name="email"
              className="form-control"
              defaultValue={editMember ? editMember.email : ""}
              required
              readOnly={!!editMember} // Make read-only if editing
            />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              className="form-control"
              defaultValue={editMember ? editMember.age : ""}
              required
            />
          </div>
          <div className="form-group">
            <label>Subject:</label>
            <input
              type="text"
              name="subject"
              className="form-control"
              defaultValue={editMember ? editMember.subject : ""}
              required
            />
          </div>
          <div className="form-group">
            <label>Score:</label>
            <input
              type="number"
              name="score"
              className="form-control"
              defaultValue={editMember ? editMember.score : ""}
              required
            />
          </div>
          <Button type="submit" className="btn btn-primary mt-3">
            {editMember ? "Update" : "Submit"}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default MemberForm;
