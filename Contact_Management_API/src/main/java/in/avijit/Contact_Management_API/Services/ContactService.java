package in.avijit.Contact_Management_API.Services;

import in.avijit.Contact_Management_API.Entities.Contact;
import in.avijit.Contact_Management_API.Repository.ContactRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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


@Service
// @Slf4j // optional
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
//        if(contact.getId() == null || contact.getId().isEmpty()){
//            contact.setId(UUID.randomUUID().toString());
//        }
        return contactRepo.save(contact);
    }

    public void deleteContact(String id) {
        Contact contact = getContactById(id); // Get the contact with photoUrl

        // Delete the image if it exists
        if (contact.getPhotoUrl() != null && !contact.getPhotoUrl().isEmpty()) {
            try {
                // Extract filename from URL
                String[] parts = contact.getPhotoUrl().split("/images/");
                if (parts.length == 2) {
                    String filename = parts[1];
                    Path filePath = Paths.get(System.getProperty("user.dir"), "static", "images", filename);
                    Files.deleteIfExists(filePath); // Delete image file
                }
            } catch (Exception e) {
                System.err.println("Failed to delete image file: " + e.getMessage());
            }
        }

        // Delete the contact from DB
        contactRepo.deleteById(id);
    }


    public String uploadPhoto(String id, MultipartFile file) {
        return contactRepo.findById(id).map(contact -> {
            try {
                String originalFilename = file.getOriginalFilename();
                String fileExtension = originalFilename != null && originalFilename.contains(".")
                        ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                        : ".png";

                String newFilename = id + fileExtension;

                Path staticDir = Paths.get(System.getProperty("user.dir"), "static", "images");
                if (!Files.exists(staticDir)) {
                    Files.createDirectories(staticDir);
                }

                Path filePath = staticDir.resolve(newFilename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                String photoUrl = ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/images/")
                        .path(newFilename)
                        .toUriString();

                contact.setPhotoUrl(photoUrl);

                return contactRepo.saveAndFlush(contact).getPhotoUrl();  // Return the saved value from managed entity

            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image: " + e.getMessage());
            }
        }).orElseThrow(() -> new RuntimeException("Contact not found with ID: " + id));
    }


}
