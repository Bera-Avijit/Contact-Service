package in.avijit.Contact_Management_API.Controller;

import in.avijit.Contact_Management_API.DTO.PagedResponse;
import in.avijit.Contact_Management_API.Entities.Contact;
import in.avijit.Contact_Management_API.Services.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController
{
    private final ContactService contactService;

    // Get all contacts with Pagination
    @GetMapping
    public ResponseEntity<PagedResponse> getAllContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Contact> contactPage = contactService.getAllContacts(page, size);

        PagedResponse response = new PagedResponse(
                contactPage.getContent(),
                contactPage.getNumber(),
                contactPage.getSize(),
                contactPage.getTotalElements(),
                contactPage.getTotalPages(),
                contactPage.isLast()
        );
        return ResponseEntity.ok(response);
    }

    // Get a specific contact by ID
    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable String id) {
        return ResponseEntity.ok(contactService.getContactById(id));
    }

    // Create a new contact
    @PostMapping
    public ResponseEntity<Contact> createContact(@Valid @RequestBody Contact contact) {
        return ResponseEntity.ok(contactService.createContact(contact));
    }

    // Delete a contact by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable String id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }

    // Upload photo
    @PostMapping("/photo")
    public ResponseEntity<String> uploadPhoto(
            @RequestParam("id") String id,
            @RequestParam("file") MultipartFile file) {
        String url = contactService.uploadPhoto(id, file);
        return ResponseEntity.ok(url);
    }
}
