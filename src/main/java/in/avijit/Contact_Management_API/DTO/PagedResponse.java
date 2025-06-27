package in.avijit.Contact_Management_API.DTO;

import in.avijit.Contact_Management_API.Entities.Contact;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PagedResponse {
    private List<Contact> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean lastPage;
}
