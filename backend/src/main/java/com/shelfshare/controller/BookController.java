package com.shelfshare.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shelfshare.model.Book;
import com.shelfshare.repository.BookRepository;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = { "http://localhost:5173", "https://shelfshareweb.vercel.app" }, methods = { RequestMethod.GET,
        RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS }, allowedHeaders = "*") // Allow
                                                                                                                    // your
                                                                                                                    // React
                                                                                                                    // app
                                                                                                                    // to
                                                                                                                    // talk
                                                                                                                    // to
                                                                                                                    // this
public class BookController {

    @Autowired // automatic dependency injection
    private BookRepository repo;

    // GET all books: http://localhost:8080/api/books
    @GetMapping

    public List<Book> getAll() {

        return repo.findAll();

    }

    // POST (Add) a book: http://localhost:8080/api/books

    @PostMapping

    public Book add(@RequestBody Book book) {

        book.setStatus("AVAILABLE"); // newly added books always available

        return repo.save(book);

    }

    @PutMapping("/{id}/request")
    public Book requestBook(@PathVariable String id, @RequestParam String requesterId, @RequestParam String requesterName) {
        Book book = repo.findById(id).orElseThrow();
        if (book.getRequests() == null) {
            book.setRequests(new java.util.ArrayList<>());
        }
        boolean exists = book.getRequests().stream().anyMatch(r -> r.getRequesterId().equals(requesterId));
        if (!exists) {
            book.getRequests().add(new com.shelfshare.model.Requester(requesterId, requesterName));
        }
        return repo.save(book);
    }

    @PutMapping("/{id}/approve")
    public Book approveBook(@PathVariable String id, @RequestParam String requesterId, @RequestParam String requesterName, @RequestParam int days) {
        Book book = repo.findById(id).orElseThrow();
        book.setStatus("ON_LOAN");
        book.setBorrowerId(requesterId);
        book.setBorrowerName(requesterName);
        book.setRequests(new java.util.ArrayList<>()); // clear other requests
        book.setDueDate(java.time.LocalDate.now().plusDays(days).toString());
        return repo.save(book);
    }

    @PutMapping("/{id}/return") // updates the status
    public Book returnBook(@PathVariable String id) {
        Book book = repo.findById(id).orElseThrow();
        book.setStatus("AVAILABLE");
        book.setBorrowerId(null);
        book.setBorrowerName(null);
        book.setDueDate(null);
        return repo.save(book);
    }

    @DeleteMapping("/{id}")

    public void deleteBook(@PathVariable String id) {

        repo.deleteById(id);

    }

}