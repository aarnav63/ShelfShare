import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [myId, setMyId] = useState(''); // Your Bennett ID
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  const API_BASE = "http://localhost:8080/api/books";

  const fetchBooks = async () => {
    const res = await axios.get(API_BASE);
    setBooks(res.data);
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!myId) return alert("Enter your Enrollment ID first!");
    await axios.post(API_BASE, { ...newBook, ownerId: myId });
    setNewBook({ title: '', author: '' });
    fetchBooks();
  };

  const handleBorrow = async (bookId) => {
    if (!myId) return alert("Enter your Enrollment ID first!");
    await axios.put(`${API_BASE}/${bookId}/borrow?borrowerId=${myId}`);
    fetchBooks();
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>🎓 Bennett ShelfShare</h1>
      
      {/* 1. Identity Section */}
      <div style={{ background: '#eee', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <label>Your Enrollment ID: </label>
        <input 
          placeholder="e.g. 23BTCS001" 
          value={myId} 
          onChange={(e) => setMyId(e.target.value.toUpperCase())} 
        />
      </div>

      {/* 2. Add Book Form */}
      <form onSubmit={handleAddBook} style={{ marginBottom: '40px', display: 'flex', gap: '10px' }}>
        <input placeholder="Book Title" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} required />
        <input placeholder="Author" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} required />
        <button type="submit" style={{ cursor: 'pointer' }}>List Book</button>
      </form>

      {/* 3. Marketplace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {books.map(book => (
          <div key={book.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px', opacity: book.status === 'ON_LOAN' ? 0.6 : 1 }}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Owner: <strong>{book.ownerId}</strong></p>
            <p>Status: <b style={{ color: book.status === 'AVAILABLE' ? 'green' : 'red' }}>{book.status}</b></p>
            
            {book.status === 'AVAILABLE' && (
              <button 
                onClick={() => handleBorrow(book.id)}
                disabled={book.ownerId === myId}
                style={{ width: '100%', cursor: 'pointer' }}
              >
                {book.ownerId === myId ? "Your Listing" : "Borrow This"}
              </button>
            )}
            {book.borrowerId && <small>Current Borrower: {book.borrowerId}</small>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;