package com.shelfshare.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shelfshare.model.Book;
import com.shelfshare.repository.BookRepository;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173") // Allow your React app to talk to this
public class BookController {

    @Autowired
    private BookRepository repo;

    // GET all books: http://localhost:8080/api/books
    @GetMapping
    public List<Book> getAll() {
        return repo.findAll();
    }

    // POST (Add) a book: http://localhost:8080/api/books
    @PostMapping
    public Book add(@RequestBody Book book) {
        book.setStatus("AVAILABLE"); // New books are always available
        return repo.save(book);

    }

    @PutMapping("/{id}/borrow")
    public Book borrowBook(@PathVariable String id, @RequestParam String borrowerId) {
        Book book = repo.findById(id).orElseThrow();

        // Logic: Change status and save who is borrowing it
        book.setStatus("ON_LOAN");
        book.setBorrowerId(borrowerId);

        return repo.save(book);
    }
}