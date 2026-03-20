import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api/books";

/* ─── Inline global styles ─── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:      #0f1923;
      --paper:    #faf7f2;
      --amber:    #e8a020;  
      --amber-lt: #fdf3dc;
      --muted:    #8a8a8a;
      --border:   #e4ddd3;
      --card:     #ffffff;
      --green:    #2d8c6b;
      --red:      #c94040;
      --shadow:   0 2px 16px rgba(15,25,35,.08);
      --shadow-lg:0 8px 40px rgba(15,25,35,.13);
    }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--paper);
      color: var(--ink);
      min-height: 100vh;
    }

    /* ── Login ── */
    .login-wrap {
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: var(--ink);
      background-image: radial-gradient(ellipse at 20% 60%, #1e3a5f55 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 20%, #e8a02022 0%, transparent 50%);
    }
    .login-card {
      background: var(--card);
      border-radius: 20px;
      padding: 52px 48px;
      width: 420px;
      box-shadow: var(--shadow-lg);
      animation: slideUp .5s cubic-bezier(.16,1,.3,1) both;
    }
    .login-logo {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      font-weight: 700;
      color: var(--ink);
      letter-spacing: -.5px;
    }
    .login-logo span { color: var(--amber); }
    .login-sub {
      font-size: .875rem;
      color: var(--muted);
      margin-top: 6px;
      margin-bottom: 36px;
    }
    .field-label {
      display: block;
      font-size: .75rem;
      font-weight: 600;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .field-input {
      width: 100%;
      padding: 13px 16px;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: .95rem;
      background: var(--paper);
      color: var(--ink);
      transition: border-color .2s, box-shadow .2s;
      outline: none;
    }
    .field-input:focus { border-color: var(--amber); box-shadow: 0 0 0 3px #e8a02022; }
    .btn-primary {
      width: 100%;
      margin-top: 24px;
      padding: 14px;
      background: var(--ink);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: .95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background .2s, transform .1s;
      letter-spacing: .02em;
    }
    .btn-primary:hover { background: #1e3350; transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }

    /* ── App Shell ── */
    .app-shell { min-height: 100vh; display: flex; flex-direction: column; }

    /* ── Top Nav ── */
    .topnav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(15,25,35,.97);
      backdrop-filter: blur(12px);
      padding: 0 32px;
      height: 64px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .nav-logo {
      font-family: 'Playfair Display', serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -.3px;
    }
    .nav-logo span { color: var(--amber); }
    .nav-right { display: flex; align-items: center; gap: 16px; }
    .nav-badge {
      background: #1e3350;
      color: #8cb8e8;
      border-radius: 8px;
      padding: 5px 12px;
      font-size: .8rem;
      font-weight: 500;
    }
    .btn-ghost {
      background: transparent;
      color: #ccc;
      border: 1.5px solid #334;
      border-radius: 8px;
      padding: 7px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: .83rem;
      font-weight: 500;
      cursor: pointer;
      transition: all .2s;
    }
    .btn-ghost:hover { border-color: #aaa; color: #fff; }

    /* ── Main Content ── */
    .main-content {
      flex: 1;
      max-width: 1100px;
      width: 100%;
      margin: 0 auto;
      padding: 40px 32px;
    }

    /* ── Add Book Panel ── */
    .add-panel {
      background: var(--ink);
      border-radius: 18px;
      padding: 32px 36px;
      margin-bottom: 40px;
      display: flex;
      align-items: flex-end;
      gap: 16px;
      flex-wrap: wrap;
      background-image: radial-gradient(ellipse at 90% 50%, #e8a02015 0%, transparent 60%);
    }
    .add-panel-title {
      width: 100%;
      font-family: 'Playfair Display', serif;
      font-size: 1.15rem;
      font-weight: 500;
      color: #fff;
      margin-bottom: 4px;
    }
    .add-panel-sub { width: 100%; font-size: .82rem; color: #8a9bb0; margin-bottom: 8px; }
    .add-input {
      flex: 1;
      min-width: 180px;
      padding: 12px 16px;
      background: rgba(255,255,255,.07);
      border: 1.5px solid rgba(255,255,255,.12);
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: .92rem;
      color: #fff;
      outline: none;
      transition: border-color .2s, background .2s;
    }
    .add-input::placeholder { color: #5a7080; }
    .add-input:focus { border-color: var(--amber); background: rgba(255,255,255,.1); }
    .btn-amber {
      padding: 12px 28px;
      background: var(--amber);
      color: var(--ink);
      border: none;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: .92rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: background .2s, transform .1s;
    }
    .btn-amber:hover { background: #f5b030; transform: translateY(-1px); }
    .btn-amber:active { transform: translateY(0); }

    /* ── Columns ── */
    .columns { display: grid; grid-template-columns: 1fr 380px; gap: 28px; align-items: start; }

    /* ── Section Header ── */
    .section-header {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 20px;
    }
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--ink);
    }
    .section-count {
      background: var(--amber-lt);
      color: var(--amber);
      font-size: .75rem;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 20px;
    }

    /* ── Book Cards ── */
    .book-card {
      background: var(--card);
      border: 1.5px solid var(--border);
      border-radius: 14px;
      padding: 20px 22px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow);
      transition: box-shadow .2s, transform .2s, border-color .2s;
      animation: fadeIn .35s ease both;
    }
    .book-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); border-color: #d4c8b8; }
    .book-spine {
      width: 44px; height: 60px;
      background: linear-gradient(160deg, var(--amber) 0%, #c47a10 100%);
      border-radius: 6px 3px 3px 6px;
      flex-shrink: 0;
      display: grid; place-items: center;
      font-family: 'Playfair Display', serif;
      font-size: 1.25rem;
      color: var(--ink);
      font-weight: 700;
      box-shadow: inset -3px 0 6px rgba(0,0,0,.15);
    }
    .book-spine-alt { background: linear-gradient(160deg, #5b8dd9 0%, #2d5fa8 100%); color: #fff; }
    .book-spine-alt2 { background: linear-gradient(160deg, #7cb87a 0%, #3a7a38 100%); color: #fff; }
    .book-spine-alt3 { background: linear-gradient(160deg, #c47a9a 0%, #8a3055 100%); color: #fff; }
    .book-info { flex: 1; min-width: 0; }
    .book-title {
      font-family: 'Playfair Display', serif;
      font-size: 1rem;
      font-weight: 600;
      color: var(--ink);
      margin-bottom: 3px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .book-author { font-size: .8rem; color: var(--muted); }
    .book-owner-tag {
      font-size: .72rem;
      color: #7a9ab0;
      margin-top: 4px;
    }
    .btn-borrow {
      padding: 8px 20px;
      background: var(--ink);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: .82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all .2s;
      white-space: nowrap;
    }
    .btn-borrow:hover { background: #1e3350; transform: translateY(-1px); }
    .btn-return {
      padding: 8px 20px;
      background: transparent;
      color: var(--green);
      border: 1.5px solid var(--green);
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: .82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all .2s;
      white-space: nowrap;
    }
    .btn-return:hover { background: var(--green); color: #fff; }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--muted);
      font-size: .9rem;
      border: 1.5px dashed var(--border);
      border-radius: 14px;
    }

    /* ── My Shelf Panel ── */
    .shelf-panel {
      background: var(--card);
      border: 1.5px solid var(--border);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    .shelf-header {
      background: var(--ink);
      padding: 22px 24px;
      background-image: radial-gradient(ellipse at 80% 50%, #e8a02018 0%, transparent 60%);
    }
    .shelf-header-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
    }
    .shelf-header-sub { font-size: .78rem; color: #8a9bb0; margin-top: 3px; }
    .shelf-section { padding: 20px 24px; border-bottom: 1.5px solid var(--border); }
    .shelf-section:last-child { border-bottom: none; }
    .shelf-section-label {
      font-size: .7rem;
      font-weight: 700;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 12px;
    }
    .shelf-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
      gap: 10px;
    }
    .shelf-item:last-child { border-bottom: none; }
    .shelf-item-title {
      font-size: .88rem;
      font-weight: 500;
      color: var(--ink);
      flex: 1;
      min-width: 0;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .status-pill {
      font-size: .7rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
      white-space: nowrap;
    }
    .status-available { background: #d4f0e5; color: var(--green); }
    .status-borrowed  { background: #fde8e8; color: var(--red); }

    /* ── Stats row ── */
    .stats-row {
      display: flex; gap: 14px;
      margin-bottom: 28px;
    }
    .stat-card {
      flex: 1;
      background: var(--card);
      border: 1.5px solid var(--border);
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: var(--shadow);
    }
    .stat-num {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      font-weight: 700;
      color: var(--ink);
      line-height: 1;
    }
    .stat-label { font-size: .78rem; color: var(--muted); margin-top: 4px; }

    /* ── Animations ── */
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 780px) {
      .columns { grid-template-columns: 1fr; }
      .add-panel { padding: 24px 20px; }
      .main-content { padding: 24px 16px; }
      .stats-row { flex-wrap: wrap; }
    }
  `}</style>
);

/* ─── Spine color cycling ─── */
const spineClasses = ['', ' book-spine-alt', ' book-spine-alt2', ' book-spine-alt3'];
const getSpineClass = (id) => spineClasses[id % 4] || '';

export default function App() {
  const [books, setBooks]     = useState([]);
  const [user, setUser] = useState(localStorage.getItem('shelfshare_user') || null);
  const [tempId, setTempId]   = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  const fetchBooks = async () => {
    const res = await axios.get(API_BASE);
    setBooks(res.data);
  };

  useEffect(() => {
  fetchBooks();
  // Optional: Set up a timer to check for new books every 5 seconds
  const interval = setInterval(fetchBooks, 2000); 
  return () => clearInterval(interval); // Clean up on close
}, []);
  const handleLogin = (e) => {
  e.preventDefault();
  if (tempId.trim()) {
    const userId = tempId.trim().toUpperCase();
    setUser(userId);
    localStorage.setItem('shelfshare_user', userId); // Save it!
  }
};

  const handleAddBook = async (e) => {
    e.preventDefault();
    await axios.post(API_BASE, { ...newBook, ownerId: user });
    setNewBook({ title: '', author: '' });
    fetchBooks();
  };

  const handleBorrow = async (id) => {
    await axios.put(`${API_BASE}/${id}/borrow?borrowerId=${user}`);
    fetchBooks();
  };

  const handleReturn = async (id) => {
  try {
    await axios.put(`${API_BASE}/${id}/return`);
    // Immediately fetch the updated list so the book moves 
    // from "Borrowed by me" back to "Marketplace" instantly.
    await fetchBooks(); 
  } catch (err) {
    console.error("Return failed", err);
  }
};
  const handleLogout = () => {
  setUser(null);
  localStorage.removeItem('shelfshare_user'); // Clear it!
};

  /* ─── Derived data ─── */
  const marketplace    = books.filter(b => b.ownerId !== user && b.status === 'AVAILABLE');
  const borrowedByMe   = books.filter(b => b.borrowerId === user);
  const myListings     = books.filter(b => b.ownerId === user);

  /* ─────────────────────── LOGIN ─────────────────────── */
  if (!user) return (
    <>
      <GlobalStyle />
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">Shelf<span>Share</span></div>
          <p className="login-sub">Bennett University Book Exchange Platform</p>
          <form onSubmit={handleLogin}>
            <label className="field-label">Enrollment ID</label>
            <input
              className="field-input"
              placeholder="e.g. E22CSE001"
              onChange={e => setTempId(e.target.value)}
              required
            />
            <button className="btn-primary" type="submit">Enter Dashboard →</button>
          </form>
        </div>
      </div>
    </>
  );

  /* ─────────────────────── DASHBOARD ─────────────────── */
  return (
    <>
      <GlobalStyle />
      <div className="app-shell">

        {/* Navbar */}
     <nav className="topnav">
          <div className="nav-logo">Shelf<span>Share</span></div>
          <div className="nav-right">
            <span className="nav-badge">📚 {user}</span>
            {/* FIX: Call handleLogout instead of just setUser(null) */}
            <button className="btn-ghost" onClick={handleLogout}>Log out</button>
          </div>
        </nav>

        <div className="main-content">

          {/* Add Book */}
          <div className="add-panel">
            <div className="add-panel-title">List a Book</div>
            <div className="add-panel-sub">Share a book with your campus community</div>
            <form
              style={{ display: 'contents' }}
              onSubmit={handleAddBook}
            >
              <input
                className="add-input"
                placeholder="Book Title"
                value={newBook.title}
                onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                required
              />
              <input
                className="add-input"
                placeholder="Author"
                value={newBook.author}
                onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                required
              />
              <button className="btn-amber" type="submit">+ Add to Shelf</button>
            </form>
          </div>

          {/* Two-column layout */}
          <div className="columns">

            {/* Marketplace */}
            <div>
              <div className="section-header">
                <span className="section-title">Marketplace</span>
                <span className="section-count">{marketplace.length} available</span>
              </div>

              {marketplace.length === 0 ? (
                <div className="empty-state">No books available right now.<br />Check back soon!</div>
              ) : marketplace.map(book => (
                <div className="book-card" key={book.id}>
                  <div className={`book-spine${getSpineClass(book.id)}`}>
                    {(book.title?.[0] || '?').toUpperCase()}
                  </div>
                  <div className="book-info">
                    <div className="book-title">{book.title}</div>
                    <div className="book-author">{book.author}</div>
                    <div className="book-owner-tag">Listed by {book.ownerId}</div>
                  </div>
                  <button className="btn-borrow" onClick={() => handleBorrow(book.id)}>Borrow</button>
                </div>
              ))}
            </div>

            {/* My Shelf */}
            <div className="shelf-panel">
              <div className="shelf-header">
                <div className="shelf-header-title">My Shelf</div>
                <div className="shelf-header-sub">Your borrowed books & active listings</div>
              </div>

              <div className="shelf-section">
                <div className="shelf-section-label">Borrowed by me</div>
                {borrowedByMe.length === 0 ? (
                  <p style={{ fontSize: '.85rem', color: 'var(--muted)' }}>Nothing borrowed yet.</p>
                ) : borrowedByMe.map(book => (
                  <div className="shelf-item" key={book.id}>
                    <span className="shelf-item-title">{book.title}</span>
                    <button className="btn-return" onClick={() => handleReturn(book.id)}>Return</button>
                  </div>
                ))}
              </div>

              <div className="shelf-section">
                <div className="shelf-section-label">My listings</div>
                {myListings.length === 0 ? (
                  <p style={{ fontSize: '.85rem', color: 'var(--muted)' }}>You haven't listed any books.</p>
                ) : myListings.map(book => (
                  <div className="shelf-item" key={book.id}>
                    <span className="shelf-item-title">{book.title}</span>
                    <span className={`status-pill ${book.status === 'AVAILABLE' ? 'status-available' : 'status-borrowed'}`}>
                      {book.status === 'AVAILABLE' ? 'Available' : 'Borrowed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}