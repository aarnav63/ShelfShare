import { useEffect, useState } from 'react';
import axios from 'axios';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api/books";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:           #060a12;
      --glass:        rgba(255,255,255,0.05);
      --glass-border: rgba(255,255,255,0.08);
      --text:         #e8edf5;
      --dim:          #6b7a90;
      --muted:        #3a4555;

      --amber:      #f5a623;
      --amber-glow: rgba(245,166,35,0.35);
      --blue:       #4a90d9;
      --blue-glow:  rgba(74,144,217,0.35);
      --green:      #2ecc8f;
      --green-glow: rgba(46,204,143,0.35);
      --rose:       #e05c8a;
      --rose-glow:  rgba(224,92,138,0.35);

      --sidebar-w: 260px;
    }

    html, body { height: 100%; }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }

    .bg-blobs {
      position: fixed; inset: 0;
      pointer-events: none; z-index: 0; overflow: hidden;
    }
    .bg-blobs::before {
      content: '';
      position: absolute; top: -10%; left: -5%;
      width: 55%; height: 65%;
      background: radial-gradient(ellipse, rgba(20,50,100,0.55) 0%, transparent 70%);
    }
    .bg-blobs::after {
      content: '';
      position: absolute; bottom: -10%; right: -5%;
      width: 55%; height: 65%;
      background: radial-gradient(ellipse, rgba(140,80,20,0.3) 0%, transparent 70%);
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

    /* ════ LOGIN ════ */
    .login-wrap {
      min-height: 100vh; display: grid; place-items: center; position: relative;
    }
    .login-card {
      position: relative; z-index: 1;
      background: rgba(18,24,38,0.78);
      backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 20px;
      padding: 48px 44px 44px;
      width: min(600px, calc(100vw - 32px));
      text-align: center;
      box-shadow: 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
    }
    .login-logo {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.8rem, 8vw, 3.4rem);
      font-weight: 800; letter-spacing: -0.03em; color: var(--text);
      line-height: 1; white-space: nowrap;
    }
    .login-logo span { color: var(--amber); }
    .login-tagline { margin-top: 16px; color: var(--dim); font-size: 0.88rem; line-height: 1.65; }
    .btn-microsoft {
      width: 100%; margin-top: 36px; padding: 15px 20px;
      background: rgba(10,20,40,0.6); color: var(--text);
      border: 1.5px solid var(--amber); border-radius: 12px;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 12px;
      transition: all 0.25s ease;
      box-shadow: 0 0 24px var(--amber-glow), inset 0 1px 0 rgba(255,255,255,0.04);
    }
    .btn-microsoft:hover {
      background: rgba(245,166,35,0.12);
      box-shadow: 0 0 40px var(--amber-glow); transform: translateY(-1px);
    }
    .login-footer-links {
      margin-top: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.82rem;
      color: var(--dim);
      gap: 16px;
      white-space: nowrap;
    }
    .login-footer-links a {
      color: var(--dim); text-decoration: underline; text-underline-offset: 3px;
      cursor: pointer; transition: color 0.2s; white-space: nowrap;
    }
    .login-footer-links a:hover { color: var(--text); }
    .login-footer-links span { white-space: nowrap; }

    /* ════ APP SHELL ════ */
    .app-shell { min-height: 100vh; display: flex; position: relative; z-index: 1; }

    .sidebar {
      width: var(--sidebar-w); flex-shrink: 0;
      background: rgba(255,255,255,0.03);
      border-right: 1px solid var(--glass-border);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      display: flex; flex-direction: column;
      padding: 32px 20px;
      position: sticky; top: 0; height: 100vh; overflow-y: auto;
    }
    .sidebar-logo {
      font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800;
      letter-spacing: -0.02em; color: var(--text); margin-bottom: 40px; padding-left: 8px;
    }
    .sidebar-logo span { color: var(--amber); }

    .sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 12px; border-radius: 10px; cursor: pointer;
      font-size: 0.88rem; font-weight: 500; color: var(--dim);
      border: 1px solid transparent; transition: all 0.2s;
      background: transparent; width: 100%; text-align: left;
      font-family: 'Inter', sans-serif; position: relative;
    }
    .nav-item:hover { background: var(--glass); color: var(--text); }
    .nav-item.active {
      background: rgba(255,255,255,0.06); color: var(--text); border-color: var(--glass-border);
    }
    .nav-item.active::before {
      content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
      width: 3px; background: var(--amber); border-radius: 0 3px 3px 0;
      box-shadow: 0 0 8px var(--amber-glow);
    }
    .nav-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }

    .sidebar-user { margin-top: auto; padding-top: 20px; border-top: 1px solid var(--glass-border); }
    .user-chip {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 10px;
      background: var(--glass); border: 1px solid var(--glass-border);
    }
    .user-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, var(--amber), var(--rose));
      display: grid; place-items: center;
      font-size: 0.75rem; font-weight: 800; color: #fff; flex-shrink: 0;
      font-family: 'Syne', sans-serif;
    }
    .user-name {
      font-size: 0.8rem; font-weight: 600; color: var(--text);
      flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .btn-logout {
      background: none; border: none; color: var(--dim); cursor: pointer;
      font-size: 0.75rem; padding: 4px; transition: color 0.2s; font-family: 'Inter', sans-serif;
    }
    .btn-logout:hover { color: var(--rose); }

    .main-area { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .main-header { padding: 36px 36px 0; }
    .page-title {
      font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800;
      letter-spacing: -0.02em; color: var(--text);
    }
    .main-content { flex: 1; padding: 28px 36px 40px; }

    /* ════ ADD BOOK PANEL ════ */
    .add-panel {
      background: rgba(20,28,45,0.5);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border); border-radius: 16px;
      padding: 28px 28px;
      display: flex; flex-direction: column; gap: 14px;
      position: relative; overflow: hidden; max-width: 520px;
    }
    .add-panel::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--amber), var(--rose), transparent);
      opacity: 0.4;
    }
    .add-panel-title {
      font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800;
      color: var(--text); letter-spacing: -0.01em;
    }
    .add-field-label {
      font-size: 0.78rem; font-weight: 600; color: var(--dim);
      letter-spacing: 0.03em; margin-bottom: 6px;
    }
    .add-input {
      width: 100%; padding: 12px 16px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; color: var(--text); outline: none;
      font-family: 'Inter', sans-serif; font-size: 0.88rem; transition: all 0.2s;
    }
    .add-input::placeholder { color: var(--muted); }
    .add-input:focus {
      border-color: rgba(245,166,35,0.5);
      box-shadow: 0 0 0 3px rgba(245,166,35,0.08), 0 0 16px rgba(245,166,35,0.1);
      background: rgba(255,255,255,0.07);
    }
    .btn-submit {
      width: 100%; padding: 13px;
      background: transparent; color: var(--text);
      border: 1.5px solid var(--amber); border-radius: 10px;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer;
      transition: all 0.2s; box-shadow: 0 0 16px var(--amber-glow); letter-spacing: 0.02em;
    }
    .btn-submit:hover {
      background: rgba(245,166,35,0.12); box-shadow: 0 0 28px var(--amber-glow); transform: translateY(-1px);
    }

    /* ════ BOOK GRID ════ */
    .book-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }
    .book-card {
      background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border);
      border-radius: 16px; padding: 22px 20px;
      display: flex; align-items: center; gap: 18px;
      transition: all 0.25s ease;
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    }
    .book-card:hover {
      background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.14);
      transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.4);
    }
    .book-spine {
      width: 10px; flex-shrink: 0; align-self: stretch; border-radius: 6px; min-height: 64px;
    }
    .spine-amber { background: var(--amber);  box-shadow: 0 0 18px var(--amber-glow), 0 0 6px var(--amber-glow); }
    .spine-blue  { background: var(--blue);   box-shadow: 0 0 18px var(--blue-glow),  0 0 6px var(--blue-glow); }
    .spine-green { background: var(--green);  box-shadow: 0 0 18px var(--green-glow), 0 0 6px var(--green-glow); }
    .spine-rose  { background: var(--rose);   box-shadow: 0 0 18px var(--rose-glow),  0 0 6px var(--rose-glow); }

    .book-info { flex: 1; min-width: 0; }
    .book-title {
      font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
      color: var(--text); margin-bottom: 5px; letter-spacing: -0.01em;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .book-author { font-size: 0.8rem; color: var(--dim); }
    .book-owner  { font-size: 0.72rem; color: var(--muted); margin-top: 5px; }

    .btn-borrow {
      flex-shrink: 0; padding: 7px 14px;
      background: transparent; color: var(--amber);
      border: 1px solid rgba(245,166,35,0.35); border-radius: 8px;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.75rem;
      cursor: pointer; transition: all 0.2s; letter-spacing: 0.04em;
    }
    .btn-borrow:hover {
      background: rgba(245,166,35,0.12); border-color: var(--amber);
      box-shadow: 0 0 12px var(--amber-glow);
    }

    /* ════ MY SHELF ════ */
    .shelf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }

    .shelf-section-card {
      background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border);
      border-radius: 16px; overflow: hidden; backdrop-filter: blur(10px);
    }
    .shelf-section-header {
      padding: 16px 20px; border-bottom: 1px solid var(--glass-border);
      font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase; color: var(--dim);
      display: flex; align-items: center; gap: 8px;
    }
    .shelf-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 13px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); gap: 10px;
    }
    .shelf-row:last-child { border-bottom: none; }
    .shelf-row-title {
      font-size: 0.88rem; font-weight: 500; color: var(--text);
      flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .shelf-row-sub { font-size: 0.7rem; color: var(--dim); margin-top: 2px; }

    .btn-return {
      flex-shrink: 0; padding: 5px 12px;
      background: rgba(46,204,143,0.08); color: var(--green);
      border: 1px solid rgba(46,204,143,0.25); border-radius: 7px;
      font-family: 'Syne', sans-serif; font-size: 0.73rem; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-return:hover { background: rgba(46,204,143,0.16); border-color: var(--green); }

    .status-pill {
      flex-shrink: 0; font-size: 0.63rem; font-weight: 800;
      padding: 3px 9px; border-radius: 20px; letter-spacing: 0.06em;
      text-transform: uppercase; font-family: 'Inter', sans-serif;
    }
    .status-in  { background: rgba(46,204,143,0.1);  color: var(--green); border: 1px solid rgba(46,204,143,0.2); }
    .status-out { background: rgba(224,92,138,0.1);  color: var(--rose);  border: 1px solid rgba(224,92,138,0.2); }

    .empty-state {
      padding: 28px 20px; text-align: center; color: var(--muted); font-size: 0.85rem; font-style: italic;
    }

    /* ════ MOBILE ════ */
    .mobile-topbar {
      display: none; align-items: center; justify-content: space-between;
      padding: 0 20px; height: 56px;
      background: rgba(8,12,20,0.92); backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--glass-border);
      position: sticky; top: 0; z-index: 200;
    }
    .mobile-logo { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; color: var(--text); }
    .mobile-logo span { color: var(--amber); }
    .hamburger {
      background: none; border: 1px solid var(--glass-border);
      border-radius: 8px; padding: 7px 10px; cursor: pointer;
      color: var(--text); font-size: 1rem; line-height: 1;
    }
    .sidebar-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.6); z-index: 300; backdrop-filter: blur(4px);
    }
    .sidebar-overlay.open { display: block; }

    /* ════ BREAKPOINTS ════ */
    @media (max-width: 900px) {
      .shelf-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .mobile-topbar { display: flex; }
      .sidebar {
        position: fixed; top: 0; left: 0; height: 100%; z-index: 400;
        transform: translateX(-100%);
        transition: transform 0.28s cubic-bezier(.4,0,.2,1);
        width: 240px;
      }
      .sidebar.open { transform: translateX(0); }
      .app-shell { flex-direction: column; }
      .main-area { min-height: calc(100vh - 56px); }
      .main-header { padding: 24px 20px 0; }
      .page-title  { font-size: 1.5rem; }
      .main-content { padding: 20px 20px 36px; }
      .book-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 480px) {
      .login-card { width: calc(100vw - 28px); padding: 40px 28px 36px; border-radius: 18px; }
      .login-logo  { font-size: clamp(1.6rem, 7vw, 2.4rem); }
    }
  `}</style>
);

const spineColors = ['spine-amber', 'spine-blue', 'spine-green', 'spine-rose'];
const getSpine = (id) => spineColors[id % 4];

export default function App() {
  const [books, setBooks]             = useState([]);
  const [view, setView]               = useState('marketplace');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser]               = useState(() => {
    const saved = localStorage.getItem('shelfshare_user');
    try { return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const { instance } = useMsal();

  const fetchBooks = async () => {
    try {
      const res = await axios.get(API_BASE);
      setBooks(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchBooks();
    const interval = setInterval(fetchBooks, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMicrosoftLogin = () => {
    instance.loginPopup(loginRequest).then(response => {
      const email = response.account.username;
      if (email.toLowerCase().endsWith("@bennett.edu.in")) {
        const userData = { id: email.split('@')[0].toUpperCase(), name: response.account.name };
        setUser(userData);
        localStorage.setItem('shelfshare_user', JSON.stringify(userData));
      }
    }).catch(e => console.error(e));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('shelfshare_user');
    instance.logoutPopup();
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!user) return;
    await axios.post(API_BASE, { ...newBook, ownerId: user.id, ownerName: user.name });
    setNewBook({ title: '', author: '' });
    fetchBooks();
    setView('marketplace');
  };

  const handleBorrow = async (id) => {
    if (!user) return;
    await axios.put(`${API_BASE}/${id}/borrow?borrowerId=${user.id}&borrowerName=${user.name}`);
    fetchBooks();
  };

  const handleReturn = async (id) => {
    await axios.put(`${API_BASE}/${id}/return`);
    fetchBooks();
  };

  const marketplace  = user ? books.filter(b => b.ownerId !== user?.id && b.status === 'AVAILABLE') : [];
  const borrowedByMe = user ? books.filter(b => b.borrowerId === user?.id) : [];
  const myListings   = user ? books.filter(b => b.ownerId === user?.id) : [];

  const navItems = [
    { id: 'marketplace', label: 'Marketplace', icon: '⊞' },
    { id: 'shelf',       label: 'My Shelf',    icon: '⊟' },
    { id: 'add',         label: 'Add Book',    icon: '+' },
  ];

  const handleNav = (id) => { setView(id); setSidebarOpen(false); };

  /* ── Login ── */
  if (!user) return (
    <>
      <GlobalStyle />
      <div className="bg-blobs" />
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">Shelf<span>Share</span></div>
          <p className="login-tagline">Share books, connect with peers.<br />Your university library, redefined.</p>
          <button className="btn-microsoft" onClick={handleMicrosoftLogin}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" width="20" alt="MS" />
            Sign in with Bennett ID
          </button>

        </div>
      </div>
    </>
  );

  const initials = user.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || user.id[0];

  return (
    <>
      <GlobalStyle />
      <div className="bg-blobs" />

      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <div className="mobile-logo">Shelf<span>Share</span></div>
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
      </div>

      {/* Sidebar overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className="app-shell">
        {/* ── Sidebar ── */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-logo">Shelf<span>Share</span></div>
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${view === item.id ? 'active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-user">
            <div className="user-chip">
              <div className="user-avatar">{initials}</div>
              <div className="user-name">{user.name}</div>
              <button className="btn-logout" onClick={handleLogout} title="Log out">✕</button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main-area">
          <div className="main-header">
            <h1 className="page-title">
              {view === 'marketplace' && 'Marketplace'}
              {view === 'shelf'       && 'My Shelf'}
              {view === 'add'         && 'Add Book'}
            </h1>
          </div>

          <div className="main-content">

            {/* MARKETPLACE */}
            {view === 'marketplace' && (
              marketplace.length === 0
                ? <div className="empty-state">No books listed yet — be the first!</div>
                : <div className="book-grid">
                    {marketplace.map(book => (
                      <div className="book-card" key={book.id}>
                        <div className={`book-spine ${getSpine(book.id)}`} />
                        <div className="book-info">
                          <div className="book-title">{book.title}</div>
                          <div className="book-author">{book.author}</div>
                          <div className="book-owner">by {book.ownerName || book.ownerId}</div>
                        </div>
                        <button className="btn-borrow" onClick={() => handleBorrow(book.id)}>Borrow</button>
                      </div>
                    ))}
                  </div>
            )}

            {/* MY SHELF */}
            {view === 'shelf' && (
              <div className="shelf-grid">
                <div className="shelf-section-card">
                  <div className="shelf-section-header"><span>📥</span> Borrowed by me</div>
                  {borrowedByMe.length === 0
                    ? <div className="empty-state">Nothing borrowed right now</div>
                    : borrowedByMe.map(book => (
                        <div className="shelf-row" key={book.id}>
                          <div>
                            <div className="shelf-row-title">{book.title}</div>
                            <div className="shelf-row-sub">{book.author}</div>
                          </div>
                          <button className="btn-return" onClick={() => handleReturn(book.id)}>Return</button>
                        </div>
                      ))
                  }
                </div>
                <div className="shelf-section-card">
                  <div className="shelf-section-header"><span>📤</span> My listings</div>
                  {myListings.length === 0
                    ? <div className="empty-state">You haven't listed any books yet</div>
                    : myListings.map(book => (
                        <div className="shelf-row" key={book.id}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="shelf-row-title">{book.title}</div>
                            {book.status !== 'AVAILABLE' && (
                              <div className="shelf-row-sub">→ {book.borrowerName || book.borrowerId}</div>
                            )}
                          </div>
                          <span className={`status-pill ${book.status === 'AVAILABLE' ? 'status-in' : 'status-out'}`}>
                            {book.status === 'AVAILABLE' ? 'In' : 'Out'}
                          </span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {/* ADD BOOK */}
            {view === 'add' && (
              <div className="add-panel">
                <div className="add-panel-title">Add Book</div>
                <form style={{ display: 'contents' }} onSubmit={handleAddBook}>
                  <div>
                    <div className="add-field-label">Book Title</div>
                    <input
                      className="add-input"
                      placeholder="Book Title"
                      value={newBook.title}
                      onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <div className="add-field-label">Author</div>
                    <input
                      className="add-input"
                      placeholder="Enter Author"
                      value={newBook.author}
                      onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                      required
                    />
                  </div>
                  <button className="btn-submit" type="submit">Submit Book</button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}