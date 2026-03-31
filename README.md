# ShelfShare

**Launch announcement**

ShelfShare is live at: https://shelfshare-one.vercel.app/


ShelfShare is a peer-to-peer book exchange platform where students can list, request, and lend books within their campus community.

## Why ShelfShare is different

- Community-Driven: Every book is listed by a student for students.
- Digital Handshake Approval: Owners review and approve requests before lending to establish trust and accountability.
- Peer-to-peer control: Owners set availability, borrow duration, and borrower details.
- Bennett University–focused: Azure MSAL authentication restricted to @bennett.edu.in.

## Key features

- Bennett University Azure authentication (MSAL) with student-only access.
- Integrated dasboard with borrow and request 
- Multi-request support per book; owner selects borrower.
- Negotiated borrowing duration (days) with due date auto-calculated.
- Return workflow to mark books available.
- Optional email draft workflow for quick communication.
- Mobile responsive UI with glassmorphism styling.

## Tech stack

- Backend: Spring Boot, Java, Spring Data MongoDB
- Frontend: React + Vite
- Database: MongoDB Atlas or local MongoDB
- Auth: Microsoft Azure AD (MSAL)

## Project structure

- `backend/`: Spring Boot API (`/api/books`)
- `shelfshare-frontend/`: React client

## Backend API

Base URL: `http://localhost:8080/api/books`

- `GET /api/books` - List all books.
- `POST /api/books` - Add a book (new status = AVAILABLE).
- `PUT /api/books/{id}/request?requesterId={id}&requesterName={name}` - Request a book.
- `PUT /api/books/{id}/approve?requesterId={id}&requesterName={name}&days={n}` - Approve and lend book.
- `PUT /api/books/{id}/return` - Return book to available.
- `DELETE /api/books/{id}` - Delete a book.

## Data model

### Book

- `id`, `title`, `author`
- `ownerId`, `ownerName`
- `borrowerId`, `borrowerName`, `status`, `dueDate`
- `requests`: array of `Requester` objects

### Requester

- `requesterId`, `requesterName`

## Local setup

### Prerequisites

- Java 17+
- Maven
- Node.js 18+ / npm
- MongoDB Atlas or local MongoDB

### Configure MongoDB

Set environment variables:

- `MONGO_USER`
- `MONGO_PASS`

`backend/src/main/resources/application.properties`:

```properties
spring.mongodb.uri=mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.jfckkmc.mongodb.net/?appName=Cluster0
spring.mongodb.database=shelfshare
```

### Run backend

```bash
cd backend
./mvnw spring-boot:run
```

### Run frontend

```bash
cd shelfshare-frontend
npm install
npm run dev
```

Access app: http://localhost:5173

## Testing

- Backend: `cd backend && ./mvnw test`
- Frontend: `cd shelfshare-frontend && npm test` (if tests configured)


## Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- MongoDB hosted on MongoDB Atlas

## Give feedback

- Open issues at this repo
- Email/DM me

