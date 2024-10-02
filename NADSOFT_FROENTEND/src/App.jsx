// App.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Swal from "sweetalert2";
import MemberTable from "./Components/MemberTable";
import MemberForm from "./Components/MemberForm";
import Pagination from "./Components/Pagination";
import { apiGet, apiPost, apiPut, apiDelete } from "./api";

const App = () => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersData = await apiGet("/");
        setMembers(membersData);
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    };

    fetchMembers();
  }, []);

  const handleSubmit = async (formData) => {
    const uniqueId = Math.floor(10000 + Math.random() * 90000);
    const newMember = {
      id: uniqueId,
      ...formData,
    };

    try {
      const createdMember = await apiPost("/create", newMember);
      setMembers([...members, createdMember]);
      setShowForm(false);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleUpdate = async (formData) => {
    const updatedMember = {
      ...editMember,
      ...formData,
    };

    try {
      await apiPut("/update-student", updatedMember);
      setMembers(
        members.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        )
      );
      setEditMember(null);
      setShowForm(false);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDelete = (memberId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this member?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiDelete(`/students/${memberId}`);
          setMembers(members.filter((member) => member.id !== memberId));
          Swal.fire("Deleted!", "Member has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  const openFormForAdd = () => {
    setEditMember(null); // Reset the edit member
    setShowForm(true); // Open the form
  };

  const openFormForEdit = (member) => {
    setEditMember(member); // Set the member to edit
    setShowForm(true); // Open the form
  };

  const paginate = (members) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return members.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(members.length / itemsPerPage);

  return (
    <div className="card-container">
      <h2>All Members</h2>
      <div className="container">
        <button
          className="btn btn-primary"
          style={{ margin: "15px" }}
          onClick={openFormForAdd} // Open form for adding a new member
        >
          Add New Member
        </button>
        <div className="table-responsive">
          <MemberTable
            members={paginate(members)}
            onEdit={openFormForEdit}
            onDelete={handleDelete}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <MemberForm
          show={showForm}
          onClose={() => setShowForm(false)} // Close the form
          onSubmit={editMember ? handleUpdate : handleSubmit} // Determine if we're updating or adding
          editMember={editMember} // Pass the current member being edited
        />
      </div>
    </div>
  );
};

export default App;
