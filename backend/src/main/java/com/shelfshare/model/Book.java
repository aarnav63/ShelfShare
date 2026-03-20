package com.shelfshare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data; // for getters and setters

@Data 
@Document(collection = "books") 
public class Book {
    @Id
    private String id;          
    private String title;
    private String author;
    private String ownerId;     
    private String borrowerId;  
    private String status;    
    private String ownerName;  
    private String borrowerName;
}