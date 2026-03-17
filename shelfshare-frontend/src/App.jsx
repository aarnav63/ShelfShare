import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = "http://localhost:8080/api/books";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brand: #1a1a2e;
    --accent: #e63946;
    --surface: #ffffff;
    --surface2: #f8f8fc;
    --surface3: #f0f0f7;
    --text1: #1a1a2e;
    --text2: #555577;
    --text3: #9999bb;
    --border: #e4e4f0;
    --green: #059669;
    --green-bg: #ecfdf5;
    --r: 12px;
    --rSm: 8px;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface2);
    color: var(--text1);
    min-height: 100vh;
  }

  .ss-app { max-width: 860px; margin: 0 auto; padding: 24px 20px 48px; }

  .ss-topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border);
  }
  .ss-logo { display: flex; align-items: center; gap: 10px; }
  .ss-logo-icon {
    width: 36px; height: 36px; background: var(--brand); border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .ss-logo-text {
    font-family: 'Playfair Display', serif; font-size: 20px;
    font-weight: 500; color: var(--brand); letter-spacing: -0.3px;
  }
  .ss-logo-sub {
    font-size: 11px; color: var(--text3); margin-top: 1px;
    letter-spacing: 0.5px; text-transform: uppercase;
  }
  .ss-id-pill {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 40px; padding: 6px 10px 6px 14px;
  }
  .ss-id-pill label { font-size: 12px; color: var(--text3); white-space: nowrap; font-weight: 500; }
  .ss-id-pill input {
    border: none; outline: none; font-family: inherit; font-size: 13px;
    font-weight: 600; color: var(--brand); background: transparent;
    width: 110px; letter-spacing: 0.5px;
  }
  .ss-id-pill input::placeholder { color: var(--text3); font-weight: 400; letter-spacing: 0; }
  .ss-id-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: background 0.3s; flex-shrink: 0; }
  .ss-id-dot.active { background: var(--green); }

  .ss-stats-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-bottom: 28px; }
  .ss-stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r); padding: 16px 18px;
  }
  .ss-stat-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.7px; font-weight: 500; margin-bottom: 6px; }
  .ss-stat-num { font-size: 26px; font-weight: 600; letter-spacing: -0.5px; }
  .ss-stat-sub { font-size: 12px; color: var(--text2); margin-top: 2px; }

  .ss-add-section {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r); padding: 20px 22px; margin-bottom: 28px;
  }
  .ss-section-title { font-size: 13px; font-weight: 600; color: var(--text2); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 14px; }
  .ss-form-row { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
  .ss-field { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 140px; }
  .ss-field label { font-size: 12px; color: var(--text3); font-weight: 500; }
  .ss-field input {
    border: 1px solid var(--border); border-radius: var(--rSm);
    padding: 9px 12px; font-family: inherit; font-size: 13px;
    color: var(--text1); background: var(--surface2); outline: none; transition: border-color 0.2s;
  }
  .ss-field input:focus { border-color: var(--brand); background: var(--surface); }
  .ss-btn-primary {
    background: var(--brand); color: #fff; border: none;
    border-radius: var(--rSm); padding: 10px 20px; font-family: inherit;
    font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap;
    transition: opacity 0.15s, transform 0.1s; letter-spacing: 0.2px;
  }
  .ss-btn-primary:hover { opacity: 0.88; }
  .ss-btn-primary:active { transform: scale(0.98); }

  .ss-books-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .ss-books-title { font-size: 15px; font-weight: 600; color: var(--text1); }
  .ss-filter-tabs { display: flex; gap: 4px; background: var(--surface3); padding: 3px; border-radius: 8px; }
  .ss-tab {
    padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;
    cursor: pointer; color: var(--text2); border: none; background: none;
    font-family: inherit; transition: all 0.15s;
  }
  .ss-tab.active { background: var(--surface); color: var(--text1); box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

  .ss-books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }

  .ss-book-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r); padding: 18px; transition: border-color 0.2s, transform 0.15s;
    position: relative; overflow: hidden;
  }
  .ss-book-card:hover { border-color: #c8c8e0; transform: translateY(-1px); }
  .ss-book-card.loaned { opacity: 0.65; }
  .ss-book-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--border); }
  .ss-book-card.available::before { background: linear-gradient(90deg, var(--green), #34d399); }
  .ss-book-card.loaned::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

  .ss-book-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
  .ss-book-icon {
    width: 38px; height: 38px; background: var(--surface2); border-radius: var(--rSm);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
    flex-shrink: 0; border: 1px solid var(--border);
  }
  .ss-status-badge {
    font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 20px;
    letter-spacing: 0.4px; text-transform: uppercase; flex-shrink: 0;
  }
  .ss-status-badge.available { background: var(--green-bg); color: var(--green); }
  .ss-status-badge.loaned { background: #fffbeb; color: #92400e; }

  .ss-book-title { font-size: 15px; font-weight: 600; color: var(--text1); margin-bottom: 3px; line-height: 1.3; }
  .ss-book-author { font-size: 12px; color: var(--text2); }

  .ss-book-meta {
    border-top: 1px solid var(--border); margin-top: 12px; padding-top: 10px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ss-owner-chip { display: flex; align-items: center; gap: 6px; }
  .ss-avatar {
    width: 22px; height: 22px; border-radius: 50%; background: var(--brand); color: #fff;
    font-size: 9px; font-weight: 700; display: flex; align-items: center;
    justify-content: center; letter-spacing: 0.3px;
  }
  .ss-owner-name { font-size: 11px; color: var(--text2); font-weight: 500; }

  .ss-btn-borrow {
    border: 1.5px solid var(--accent); background: transparent; color: var(--accent);
    border-radius: var(--rSm); padding: 5px 12px; font-family: inherit;
    font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; letter-spacing: 0.2px;
  }
  .ss-btn-borrow:hover { background: var(--accent); color: #fff; }
  .ss-btn-mine {
    border: 1px solid var(--border); background: transparent; color: var(--text3);
    border-radius: var(--rSm); padding: 5px 12px; font-family: inherit;
    font-size: 12px; cursor: default;
  }
  .ss-borrower-row { margin-top: 8px; font-size: 11px; color: var(--text3); display: flex; align-items: center; gap: 4px; }

  .ss-empty { text-align: center; padding: 48px 20px; color: var(--text3); }
  .ss-empty-icon { font-size: 36px; margin-bottom: 12px; }
  .ss-empty p { font-size: 13px; }

  .ss-toast {
    position: fixed; bottom: 24px; right: 24px; background: var(--brand); color: #fff;
    padding: 12px 18px; border-radius: var(--r); font-size: 13px; font-weight: 500;
    transform: translateY(80px); opacity: 0; transition: all 0.3s; z-index: 999; pointer-events: none;
  }
  .ss-toast.show { transform: translateY(0); opacity: 1; }

  @media (max-width: 600px) {
    .ss-stats-row { grid-template-columns: 1fr 1fr; }
    .ss-topbar { flex-direction: column; align-items: flex-start; gap: 12px; }
    .ss-books-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  }
`;

function initials(id) {
  return id ? id.slice(0, 2).toUpperCase() : '?';
}

function Toast({ message, visible }) {
  return (
    <div className={`ss-toast ${visible ? 'show' : ''}`}>{message}</div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="ss-stat-card">
      <div className="ss-stat-label">{label}</div>
      <div className="ss-stat-num" style={{ color: color || 'var(--brand)' }}>{value}</div>
      <div className="ss-stat-sub">{sub}</div>
    </div>
  );
}

function BookCard({ book, myId, onBorrow }) {
  const avail = book.status === 'AVAILABLE';
  const isOwner = myId && book.ownerId === myId;

  return (
    <div className={`ss-book-card ${avail ? 'available' : 'loaned'}`}>
      <div className="ss-book-top">
        <div className="ss-book-icon">📗</div>
        <span className={`ss-status-badge ${avail ? 'available' : 'loaned'}`}>
          {avail ? 'Available' : 'On Loan'}
        </span>
      </div>
      <div className="ss-book-title">{book.title}</div>
      <div className="ss-book-author">{book.author}</div>
      <div className="ss-book-meta">
        <div className="ss-owner-chip">
          <div className="ss-avatar">{initials(book.ownerId)}</div>
          <span className="ss-owner-name">{book.ownerId || 'Unknown'}</span>
        </div>
        {avail && (
          isOwner
            ? <button className="ss-btn-mine">Your listing</button>
            : <button className="ss-btn-borrow" onClick={() => onBorrow(book.id)}>Borrow</button>
        )}
      </div>
      {book.borrowerId && (
        <div className="ss-borrower-row">↳ Borrowed by <strong style={{ marginLeft: 3 }}>{book.borrowerId}</strong></div>
      )}
    </div>
  );
}

export default function App() {
  const [books, setBooks] = useState([]);
  const [myId, setMyId] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get(API_BASE);
      setBooks(res.data);
    } catch {
      // backend not running — keep existing books
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!myId) { showToast('Enter your Enrollment ID first'); return; }
    await axios.post(API_BASE, { ...newBook, ownerId: myId });
    setNewBook({ title: '', author: '' });
    showToast('Book listed successfully');
    fetchBooks();
  };

  const handleBorrow = async (bookId) => {
    if (!myId) { showToast('Enter your Enrollment ID first'); return; }
    await axios.put(`${API_BASE}/${bookId}/borrow?borrowerId=${myId}`);
    showToast('Book borrowed!');
    fetchBooks();
  };

  const filtered = filter === 'all' ? books
    : filter === 'available' ? books.filter(b => b.status === 'AVAILABLE')
    : books.filter(b => b.status === 'ON_LOAN');

  const available = books.filter(b => b.status === 'AVAILABLE').length;
  const loaned = books.filter(b => b.status === 'ON_LOAN').length;

  const bookCountLabel = `${filtered.length} book${filtered.length !== 1 ? 's' : ''} ${
    filter === 'all' ? 'listed' : filter === 'available' ? 'available' : 'on loan'
  }`;

  return (
    <>
      <style>{styles}</style>
      <div className="ss-app">

        {/* Top Bar */}
        <div className="ss-topbar">
          <div className="ss-logo">
            <div className="ss-logo-icon">📚</div>
            <div>
              <div className="ss-logo-text">ShelfShare</div>
              <div className="ss-logo-sub">Bennett University</div>
            </div>
          </div>
          <div className="ss-id-pill">
            <label>Your ID</label>
            <input
              placeholder="23BTCS001"
              maxLength={10}
              value={myId}
              onChange={e => setMyId(e.target.value.toUpperCase())}
            />
            <div className={`ss-id-dot ${myId.length > 3 ? 'active' : ''}`} />
          </div>
        </div>

        {/* Stats */}
        <div className="ss-stats-row">
          <StatCard label="Total Listed" value={books.length} sub="books in network" />
          <StatCard label="Available" value={available} sub="ready to borrow" color="var(--green)" />
          <StatCard label="On Loan" value={loaned} sub="currently borrowed" color="#d97706" />
        </div>

        {/* Add Book */}
        <div className="ss-add-section">
          <div className="ss-section-title">List a new book</div>
          <form className="ss-form-row" onSubmit={handleAddBook}>
            <div className="ss-field">
              <label>Book Title</label>
              <input
                placeholder="e.g. Clean Code"
                value={newBook.title}
                onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                required
              />
            </div>
            <div className="ss-field">
              <label>Author</label>
              <input
                placeholder="e.g. Robert C. Martin"
                value={newBook.author}
                onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="ss-btn-primary">+ List Book</button>
          </form>
        </div>

        {/* Books Grid */}
        <div className="ss-books-header">
          <div className="ss-books-title">{bookCountLabel}</div>
          <div className="ss-filter-tabs">
            {['all', 'available', 'loaned'].map(f => (
              <button
                key={f}
                className={`ss-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'available' ? 'Available' : 'On Loan'}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="ss-empty">
            <div className="ss-empty-icon">📖</div>
            <p>No books here yet. Be the first to list one!</p>
          </div>
        ) : (
          <div className="ss-books-grid">
            {filtered.map(book => (
              <BookCard key={book.id} book={book} myId={myId} onBorrow={handleBorrow} />
            ))}
          </div>
        )}
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}