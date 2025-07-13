import React from "react";
import Contact from "./Contact";

const ContactList = ({
  data,
  currentPage,
  getAllContacts,
  onDeleteContact,
}) => {
  return (
    <main className="main">
      {data?.content?.length === 0 && <div>No Contacts !! Add new Contact</div>}

      <ul className="contact__list">
        {data?.content?.length > 0 &&
          data.content.map((contact) => (
            <Contact
              key={contact.id}
              contact={contact}
              onDelete={onDeleteContact}
            ></Contact>
          ))}
      </ul>

      {data?.content?.length > 0 && (
        <div className="pagination">
          <a
            onClick={() => getAllContacts(currentPage - 1)}
            className={currentPage === 0 ? "disabled" : ""}
          >
            &laquo;
          </a>

          {data &&
            [...Array(data.totalPages).keys()].map((page, index) => (
              <a
                key={page}
                onClick={() => getAllContacts(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page + 1}
              </a>
            ))}

          <a
            onClick={() => getAllContacts(currentPage + 1)}
            className={currentPage === data.totalPages - 1 ? "disabled" : ""}
          >
            &raquo;
          </a>
        </div>
      )}
    </main>
  );
};

export default ContactList;
