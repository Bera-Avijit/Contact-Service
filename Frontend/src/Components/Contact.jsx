import React from "react";
import { Link } from "react-router-dom";

const Contact = ({ contact, onDelete }) => {
  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent <Link> navigation
    if (!window.confirm(`Are you sure you want to delete ${contact.name}?`))
      return;
    onDelete(contact.id); // Delegate to App
  };
  return (
    <Link
      to={`/contacts/${contact.id}`}
      className="contact__item position-relative"
    >
      <div className="contact__header">
        <div className="contact__image">
          <img src={contact.photoUrl} alt={contact.name.substring(0, 15)} />
        </div>
        <div className="contact__details">
          <p className="contact_name">{contact.name.substring(0, 15)}</p>
          <p className="contact_title">{contact.title}</p>
        </div>
        <button
          className="btn btn-sm btn-outline-danger contact__delete-btn"
          onClick={handleDelete}
          title="Delete Contact"
        >
          x
        </button>
      </div>
      <div className="contact__body">
        <p>
          <i className="bi bi-envelope"></i>
          {contact.email.substring(0, 20)}
        </p>
        <p>
          <i className="bi bi-geo"></i>
          {contact.address}
        </p>
        <p>
          <i className="bi bi-telephone"></i>
          {contact.phone}
        </p>
        <p>
          {contact.status === "Active" ? (
            <i className="bi bi-check-circle"></i>
          ) : (
            <i className="bi bi-x-circle"></i>
          )}
          {contact.status}
        </p>
      </div>
    </Link>
  );
};

export default Contact;
