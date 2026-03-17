package com.shelfshare.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.shelfshare.model.Book;

public interface BookRepository extends MongoRepository<Book, String> {
    // Spring Boot is smart enough to write the query for you based on the method name!
    List<Book> findByOwnerId(String ownerId);
}