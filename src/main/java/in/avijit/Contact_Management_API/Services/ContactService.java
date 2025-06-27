package in.avijit.Contact_Management_API.Services;

import in.avijit.Contact_Management_API.Entities.Contact;
import in.avijit.Contact_Management_API.Repository.ContactRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;


@Service
@Slf4j // optional
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepo contactRepo;

    public Page<Contact> getAllContacts(int page, int size) {
        return contactRepo.findAll(PageRequest.of(page, size, Sort.by("name").ascending()));
    }

    public Contact getContactById(String id) {
        return contactRepo.findById(id).orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
    }

    public Contact createContact(Contact contact) {
        // If no ID is set, generate one using UUID
        if(contact.getId() == null || contact.getId().isEmpty()){
            contact.setId(UUID.randomUUID().toString());
        }
        return contactRepo.save(contact);
    }

    public void deleteContact(String id) {
        contactRepo.deleteById(id);
    }

    public String uploadPhoto(String id, MultipartFile file) {
        try {
            // 1. Get the contact
            Contact contact = getContactById(id);

            // 2. Extract file extension
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                    : ".png";
            String newFilename = id + fileExtension;

            // 3. Build dynamic path under /static/images
            Path staticDir = Paths.get(System.getProperty("user.dir"), "static", "images");
            if (!Files.exists(staticDir)) {
                Files.createDirectories(staticDir); // Create /static/images if not exists
            }

            // 4. Save file to /static/images
            Path filePath = staticDir.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 5. Generate URL like: http://localhost:8080/images/abc123.png
            String photoUrl = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/images/")
                    .path(newFilename)
                    .toUriString();

            // 6. Save photo URL in DB
            contact.setPhotoUrl(photoUrl);
            contactRepo.save(contact);

            return photoUrl;

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

}
