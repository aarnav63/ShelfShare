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
public class BookController {

    @Autowired
    private BookRepository repo;

    private String getUserIdFromJwt(org.springframework.security.oauth2.jwt.Jwt jwt) {
        String oid = jwt.getClaimAsString("oid");
        if (oid != null && !oid.isBlank()) {
            return oid;
        }
        return jwt.getSubject();
    }

    @GetMapping
    public List<Book> getAll(@org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        String userId = getUserIdFromJwt(jwt);
        return repo.findByOwnerId(userId);
    }

    @PostMapping
    public Book add(@RequestBody Book book, @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        String userId = getUserIdFromJwt(jwt);
        book.setOwnerId(userId);
        book.setStatus("AVAILABLE");
        if (book.getRequests() == null) {
            book.setRequests(new java.util.ArrayList<>());
        }
        return repo.save(book);
    }

    @PutMapping("/{id}/request")
    public Book requestBook(@PathVariable String id, @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        String requesterId = getUserIdFromJwt(jwt);
        String requesterName = jwt.getClaimAsString("name") != null ? jwt.getClaimAsString("name") : jwt.getClaimAsString("preferred_username");

        Book book = repo.findById(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Book not found"));
        if (book.getRequests() == null) {
            book.setRequests(new java.util.ArrayList<>());
        }
        boolean exists = book.getRequests().stream().anyMatch(r -> r.getRequesterId().equals(requesterId));
        if (!exists) {
            book.getRequests().add(new com.shelfshare.model.Requester(requesterId, requesterName));
            return repo.save(book);
        }
        return book;
    }

    @PutMapping("/{id}/approve")
    public Book approveBook(@PathVariable String id, @RequestParam int days, @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        String userId = getUserIdFromJwt(jwt);

        Book book = repo.findById(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Book not found"));
        if (!userId.equals(book.getOwnerId())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Only owner can approve loan");
        }

        if (book.getRequests() == null || book.getRequests().isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "No pending request to approve");
        }

        com.shelfshare.model.Requester firstRequester = book.getRequests().get(0);
        book.setStatus("ON_LOAN");
        book.setBorrowerId(firstRequester.getRequesterId());
        book.setBorrowerName(firstRequester.getRequesterName());
        book.setRequests(new java.util.ArrayList<>());
        book.setDueDate(java.time.LocalDate.now().plusDays(days).toString());
        return repo.save(book);
    }

    @PutMapping("/{id}/return")
    public Book returnBook(@PathVariable String id, @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        String userId = getUserIdFromJwt(jwt);

        Book book = repo.findById(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Book not found"));
        if (!userId.equals(book.getOwnerId())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Only owner can return book");
        }

        book.setStatus("AVAILABLE");
        book.setBorrowerId(null);
        book.setBorrowerName(null);
        book.setDueDate(null);
        return repo.save(book);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable String id, @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        String userId = getUserIdFromJwt(jwt);

        Book book = repo.findById(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Book not found"));
        if (!userId.equals(book.getOwnerId())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Only owner can delete book");
        }
        repo.deleteById(id);
    }
}
