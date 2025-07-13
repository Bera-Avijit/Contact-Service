import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getContact } from "../API/ContactService";
import { toastError, toastSuccess } from "../API/ToastService";

const ContactDetail = ({ onUpdateContact, updateImage }) => {
  const fileInputRef = useRef(); // Reference to hidden image file input
  const [contact, setContact] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
    photoUrl: "",
  });

  const { id } = useParams();
  console.log("ContactDetail id:", id);

  const getContactDetail = async () => {
    try {
      const response = await getContact(id);
      setContact(response.data);
      console.log("Contact details fetched:", response.data);
    } catch (error) {
      console.error("Error fetching contact details:", error);
      toastError(error.message);
    }
  };

  const handleSelectPhotoOnClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input click
  };

  const handleUpdatePhoto = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", id); // Append the contact ID to the form data

      await updateImage(formData);

      setContact((prevContact) => ({
        ...prevContact,
        photoUrl: `${prevContact.photoUrl}?updated_at=${Date.now()}`, // Trick browser to reload image (cache-busting)
      }));
      toastSuccess("Photo updated successfully!");
    } catch (error) {
      console.error("Error updating photo:", error);
      toastError(error.message);
    }
  };

  const onChange = (event) => {
    setContact({ ...contact, [event.target.name]: event.target.value });
  };

  const handleUpdateContact = async (event) => {
    event.preventDefault();

    // Clone the contact object
    const contactToUpdate = { ...contact };

    // Remove ?updated_at from photoUrl before sending to backend
    if (contactToUpdate.photoUrl.includes("?updated_at")) {
      contactToUpdate.photoUrl =
        contactToUpdate.photoUrl.split("?updated_at")[0];
    }

    await onUpdateContact(contactToUpdate);
    getContactDetail();
    toastSuccess("Contact updated successfully!");
  };

  useEffect(() => {
    getContactDetail();
  }, []);

  return (
    <>
      <Link to={"/contacts"} className="link">
        {" "}
        <i className="bi bi-arrow-left"></i> Back to list
      </Link>

      <div className="profile">
        <div className="profile__details">
          {contact.photoUrl ? (
            <img
              src={contact.photoUrl}
              alt={`Profile photo of ${contact.name}`}
            />
          ) : (
            <div className="placeholder-image">No image</div>
          )}
          <div className="profile__metadata">
            <p className="profile__name">{contact.name}</p>
            <p className="profile__muted">JPG, GIF, or PNG. Max size of 10MG</p>
            <button onClick={handleSelectPhotoOnClick} className="btn">
              <i className="bi bi-cloud-upload"></i> Change Photo
            </button>
          </div>
        </div>

        <div className="profile__settings">
          <form onSubmit={handleUpdateContact} className="form">
            <div className="user-details">
              {/* update the existing contact by id instead of creating new one */}
              <input
                type="hidden"
                defaultValue={contact.id}
                name="id"
                required
              />
              <div className="input-box">
                <span className="details">Name</span>
                <input
                  type="text"
                  value={contact.name}
                  onChange={onChange}
                  name="name"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="text"
                  value={contact.email}
                  onChange={onChange}
                  name="email"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Phone</span>
                <input
                  type="text"
                  value={contact.phone}
                  onChange={onChange}
                  name="phone"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input
                  type="text"
                  value={contact.address}
                  onChange={onChange}
                  name="address"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input
                  type="text"
                  value={contact.title}
                  onChange={onChange}
                  name="title"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Status</span>
                <input
                  type="text"
                  value={contact.status}
                  onChange={onChange}
                  name="status"
                  required
                />
              </div>
            </div>
            <div className="form_footer">
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Hidden file input (triggered by button) */}
      <form style={{ display: "none" }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpdatePhoto}
          name="file"
          accept="image/*"
        />
      </form>
    </>
  );
};

export default ContactDetail;
