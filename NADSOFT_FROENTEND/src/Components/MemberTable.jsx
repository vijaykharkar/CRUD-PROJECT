// MemberTable.js
import React from "react";

const MemberTable = ({ members, onEdit, onDelete }) => {
  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Member Name</th>
          <th>Member Email</th>
          <th>Age</th>
          <th>Subject</th>
          <th>Score</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td>{member.id}</td>
            <td>{member.name}</td>
            <td>{member.email}</td>
            <td>{member.age}</td>
            <td>{member.subject}</td>
            <td>{member.score}</td>
            <td>
              <span className="edit-icon" onClick={() => onEdit(member)}>
                <i className="fas fa-edit" />
              </span>
              <span className="delete-icon" onClick={() => onDelete(member.id)}>
                <i className="fas fa-trash-alt" />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MemberTable;
