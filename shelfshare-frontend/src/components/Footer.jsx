import React from "react";

const Footer = () => {
  return (
    <>
      {/* Spacer so page content doesn't hide behind the fixed footer */}
      <div style={{ height: '56px' }} />

      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,          /* below sidebar (which is naturally higher) */
        background: 'rgba(6, 10, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        /* indent content so it starts after the sidebar */
        paddingLeft: '20px',
        paddingRight: '36px',
      }}>

        {/* Left — branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: '0.95rem',
            color: 'var(--text)',
            letterSpacing: '-0.01em',
          }}>
            Shelf<span style={{ color: 'var(--amber)' }}>Share</span>
          </div>
          <span style={{
            color: 'var(--muted)',
            fontSize: '0.65rem',
            fontFamily: "'Inter', sans-serif",
          }}>
            A student-built book sharing platform
          </span>
        </div>

        {/* Center — social icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* GitHub */}
          <a
            href="https://github.com/aarnav63"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--dim)', transition: 'color 0.2s, transform 0.2s', display: 'flex' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--amber)'; e.currentTarget.style.transform = 'scale(1.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--dim)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 4.99 3.22 9.23 7.69 10.73.56.1.77-.24.77-.53v-1.85c-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.24-1.64-1.24-1.64-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.71-1.49-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.15-3.03-.12-.28-.5-1.41.11-2.94 0 0 .94-.3 3.08 1.16a10.7 10.7 0 0 1 2.8-.38c.95 0 1.9.13 2.8.38 2.14-1.46 3.08-1.16 3.08-1.16.61 1.53.23 2.66.11 2.94.72.79 1.15 1.8 1.15 3.03 0 4.32-2.63 5.27-5.14 5.55.4.34.76 1.01.76 2.04v3.03c0 .29.21.64.77.53C20.78 21.23 24 16.99 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/aarnav-bajaj-b70088363/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--dim)', transition: 'color 0.2s, transform 0.2s', display: 'flex' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--amber)'; e.currentTarget.style.transform = 'scale(1.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--dim)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.93v5.68H9.37V9h3.41v1.56h.05c.47-.9 1.61-1.85 3.31-1.85 3.54 0 4.19 2.33 4.19 5.36v6.38zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
            </svg>
          </a>
        </div>

        {/* Right — credit */}
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.7rem',
          color: 'var(--muted)',
          textAlign: 'right',
          whiteSpace: 'nowrap',
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          Built by Aarnav &nbsp;·&nbsp;
          <span style={{ opacity: 0.6 }}>&nbsp;© {new Date().getFullYear()} ShelfShare</span>
        </div>

      </footer>
    </>
  );
};

export default Footer;