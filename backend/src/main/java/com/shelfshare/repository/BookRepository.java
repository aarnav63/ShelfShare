package com.shelfshare.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.shelfshare.model.Book;

public interface BookRepository extends MongoRepository<Book, String> {
    
    List<Book> findByOwnerId(String ownerId);
}