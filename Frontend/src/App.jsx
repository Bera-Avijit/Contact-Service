import { useEffect, useRef, useState } from "react";
import {
  deleteContact,
  getContacts,
  saveContact,
  updateContact,
  updatePhoto,
} from "./API/ContactService";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import { Routes, Route, Navigate } from "react-router-dom";
import NewContact from "./Components/NewContact";
import ContactDetail from "./Components/ContactDetail";
import { toastError, toastSuccess } from "./API/ToastService";
import { ToastContainer } from "react-toastify";

function App() {
  const modalRef = useRef();
  const photoFileRef = useRef();

  // useEffect(() => {
  //   if (modalRef.current) {
  //     modalRef.current.showModal(); // open by default for testing
  //   }
  // }, []);

  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const [photoFile, setPhotoFile] = useState(undefined);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
  });

  const getAllContacts = async (page = 0, size = 6) => {
    try {
      const response = await getContacts(page, size);
      setData(response.data);
      setCurrentPage(page);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const handleNewContact = async (event) => {
    event.preventDefault();
    try {
      const { data } = await saveContact(values);
      console.log("Contact created successfully:", data);
      const formData = new FormData();
      formData.append("file", photoFile);
      formData.append("id", data.id);
      const { data: photoUrl } = await updatePhoto(formData);
      console.log("Photo updated successfully:", photoUrl);
      setPhotoFile(undefined);
      photoFileRef.current.value = null; // Clear the file input
      setValues({
        name: "",
        email: "",
        phone: "",
        address: "",
        title: "",
        status: "",
      });
      getAllContacts();
      toggleModal(false);
    } catch (error) {
      console.error("Error saving contact:", error);
      toastError(error.message);
    }
  };

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    console.log(values);
  };

  const onUpdateContact = async (contact) => {
    try {
      const response = await updateContact(contact);
      console.log("Contact updated successfully:", response.data);
      getAllContacts(currentPage);
    } catch (error) {
      console.error("Error updating contact:", error);
      toastError(error.message);
    }
  };

  const updateImage = async (formData) => {
    try {
      const { data: photoUrl } = await updatePhoto(formData);
    } catch (error) {
      console.error("Error updating image:", error);
      toastError(error.message);
    }
  };

  const onDeleteContact = async (id) => {
    try {
      await deleteContact(id);
      toastSuccess("Contact deleted successfully!");
      getAllContacts(currentPage); // Refresh list
    } catch (error) {
      console.error("Error deleting contact:", error);
      toastError("Failed to delete contact.");
    }
  };

  const toggleModal = (show) => {
    console.log("toggleModal called with:", show);
    // console.log("modalRef.current is:", modalRef.current);
    show ? modalRef.current.showModal() : modalRef.current.close();
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <>
      <Header
        toggleModal={toggleModal}
        nbOfContacts={data.totalElements}
      ></Header>

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={"/contacts"} />} />
            <Route
              path="/contacts"
              element={
                <ContactList
                  data={data}
                  currentPage={currentPage}
                  getAllContacts={getAllContacts}
                  onDeleteContact={onDeleteContact}
                />
              }
            />
            <Route
              path="/contacts/:id"
              element={
                <ContactDetail
                  onUpdateContact={onUpdateContact}
                  updateImage={updateImage}
                />
              }
            />
          </Routes>
        </div>
      </main>

      <NewContact
        modalRef={modalRef}
        photoFileRef={photoFileRef}
        handleNewContact={handleNewContact}
        values={values}
        setValues={setValues}
        photoFile={photoFile}
        setPhotoFile={setPhotoFile}
        onChange={onChange}
        toggleModal={toggleModal}
      ></NewContact>

      <ToastContainer></ToastContainer>
    </>
  );
}

export default App;
