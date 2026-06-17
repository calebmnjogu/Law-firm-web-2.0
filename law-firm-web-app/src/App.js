import React, { useState, useEffect, useCallback } from 'react';
import styles from './App.module.css';
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from './api';

/* ─────────────────────────────────────────────────────
   Utility
───────────────────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

const CATEGORIES = [
  'General', 'Corporate Law', 'Criminal Defense', 'Family Law',
  'Conveyancing', 'Land Law', 'Immigration', 'Cross-Border Trade',
];

/* ─────────────────────────────────────────────────────
   Navbar
───────────────────────────────────────────────────── */
function Navbar({ activeSection }) {
  const [open, setOpen] = useState(false);
  const links = ['about', 'services', 'articles', 'contact'];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navInner}>
        <a href="#hero" className={styles.brand}>
          <span className={styles.brandGold}>MNM</span>
          <span className={styles.brandText}>Maureen Nyambura Mwangi &amp; Co</span>
          <span className={styles.brandSub}>Advocates</span>
        </a>

        <button className={styles.burger} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>

        <ul className={`${styles.navLinks} ${open ? styles.navOpen : ''}`}>
          {links.map(l => (
            <li key={l}>
              <a
                href={`#${l}`}
                className={activeSection === l ? styles.navActive : ''}
                onClick={() => setOpen(false)}
              >
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────
   Hero
───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroOverlay}>
        <p className={styles.heroEyebrow}>Nairobi, Kenya</p>
        <h1 className={styles.heroTitle}>
          Trusted Legal<br /><em>Representation</em>
        </h1>
        <div className={styles.heroDivider} />
        <p className={styles.heroSub}>
          Professional, ethical, and results-driven legal services.
        </p>
        <div className={styles.heroCtas}>
          <a href="#contact" className={styles.btnPrimary}>Request Consultation</a>
          <a href="#services" className={styles.btnGhost}>Our Practice Areas</a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   About
───────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutLabel}>
            <span>About the Firm</span>
          </div>
          <div className={styles.aboutContent}>
            <h2 className={styles.sectionTitle}>
              Experienced Attorneys<br /><em>Committed to Excellence</em>
            </h2>
            <p>
              Maureen Nyambura Mwangi &amp; Co. Law Firm provides comprehensive legal
              services across corporate law, criminal defense, and family law. We focus
              on protecting our clients' rights, delivering strategic legal solutions,
              and achieving favourable outcomes — with integrity at the heart of every
              matter we take on.
            </p>
            <div className={styles.statsRow}>
              {[['2+', 'Years Experience'], ['50+', 'Cases Handled'], ['7', 'Practice Areas']].map(([n, l]) => (
                <div key={l} className={styles.stat}>
                  <span className={styles.statNum}>{n}</span>
                  <span className={styles.statLabel}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   Services
───────────────────────────────────────────────────── */
const SERVICES = [
  { title: 'Corporate Law',      desc: 'Business formation, contracts, compliance, and dispute resolution.' },
  { title: 'Criminal Defense',   desc: 'Strong legal representation in criminal investigations and court cases.' },
  { title: 'Family Law',         desc: 'Divorce, custody matters, mediation, and family dispute resolution.' },
  { title: 'Conveyancing Law',   desc: 'Expert legal guidance for property transfers, purchases, and ownership transactions.' },
  { title: 'Land Law',           desc: 'Comprehensive legal advice on land rights, ownership disputes, and property interests.' },
  { title: 'Immigration Law',    desc: 'Trusted legal guidance on visas, residency, citizenship, and immigration matters.' },
  { title: 'Cross-Border Trade', desc: 'Expert advice on international trade agreements, customs regulations, and cross-border transactions.' },
];

function Services() {
  return (
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>What We Do</p>
          <h2 className={styles.sectionTitle}>Our Practice Areas</h2>
        </div>

        <div className={styles.servicesGrid}>
          {SERVICES.map((s, i) => (
            <div key={s.title} className={styles.serviceCard}>
              <span className={styles.serviceNum}>0{i + 1}</span>
              <h3 className={styles.serviceTitle}>{s.title}</h3>
              <p className={styles.serviceDesc}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.generalCard}>
          <h3 className={styles.generalTitle}>General Practice</h3>
          <p>
            Our firm handles a wide range of everyday legal needs — whether you need a{' '}
            <strong>Deed Poll</strong> to formally change your name, an{' '}
            <strong>Affidavit</strong> for legal proceedings, or a{' '}
            <strong>Demand Letter</strong> to assert your rights and resolve disputes
            before escalating to court. We provide prompt, professional, and reliable
            legal support ensuring every document is accurately drafted and legally sound.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   Article Card
───────────────────────────────────────────────────── */
function ArticleCard({ article, onClick }) {
  return (
    <article className={styles.articleCard} onClick={() => onClick(article.id)}>
      <div className={styles.articleMeta}>
        <span className={styles.articleCategory}>{article.category}</span>
        <span className={styles.articleDate}>{formatDate(article.created_at)}</span>
      </div>
      <h3 className={styles.articleTitle}>{article.title}</h3>
      {article.summary && (
        <p className={styles.articleSummary}>{article.summary}</p>
      )}
      <div className={styles.articleFooter}>
        <span className={styles.articleAuthor}>{article.author}</span>
        <span className={styles.readMore}>Read more →</span>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────
   Article Modal (full read view)
───────────────────────────────────────────────────── */
function ArticleModal({ articleId, onClose }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getArticle(articleId)
      .then(setArticle)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [articleId]);

  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>

        {loading ? (
          <div className={styles.spinner} />
        ) : article ? (
          <>
            <span className={styles.articleCategory}>{article.category}</span>
            <h2 className={styles.modalTitle}>{article.title}</h2>
            <p className={styles.modalMeta}>
              {article.author} · {formatDate(article.created_at)}
              {article.updated_at && ` · Updated ${formatDate(article.updated_at)}`}
            </p>
            <div className={styles.modalBody}>
              {article.content.split('\n').map((para, i) =>
                para ? <p key={i}>{para}</p> : <br key={i} />
              )}
            </div>
          </>
        ) : (
          <p>Article not found.</p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Article Form (create / edit)
───────────────────────────────────────────────────── */
function ArticleForm({ editing, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title:    editing?.title    || '',
    summary:  editing?.summary  || '',
    content:  editing?.content  || '',
    author:   editing?.author   || '',
    category: editing?.category || 'General',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (editing) {
        await updateArticle(editing.id, form);
      } else {
        await createArticle(form);
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <h3 className={styles.formTitle}>
        {editing ? 'Edit Article' : 'Post a New Article'}
      </h3>

      {error && <div className={styles.formError}>{error}</div>}

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label>Title *</label>
          <input value={form.title} onChange={set('title')} placeholder="Article title" />
        </div>

        <div className={styles.formField}>
          <label>Category</label>
          <select value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label>Author</label>
          <input value={form.author} onChange={set('author')} placeholder="e.g. Maureen N. Mwangi" />
        </div>

        <div className={`${styles.formField} ${styles.fullWidth}`}>
          <label>Summary <span className={styles.optional}>(optional — shown on card)</span></label>
          <input value={form.summary} onChange={set('summary')} placeholder="One-sentence teaser" />
        </div>

        <div className={`${styles.formField} ${styles.fullWidth}`}>
          <label>Content *</label>
          <textarea
            rows={10}
            value={form.content}
            onChange={set('content')}
            placeholder="Full article text. Press Enter for paragraph breaks."
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button className={styles.btnPrimary} onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Saving…' : editing ? 'Save Changes' : 'Publish Article'}
        </button>
        <button className={styles.btnOutline} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Articles Section
───────────────────────────────────────────────────── */
// Change this to a proper auth route in production
const ADMIN_PASSWORD = 'advocates2026';

function Articles() {
  const [articles,       setArticles]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [filter,         setFilter]         = useState('');
  const [viewId,         setViewId]         = useState(null);
  const [showForm,       setShowForm]       = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleting,       setDeleting]       = useState(null);
  const [adminMode,      setAdminMode]      = useState(false);
  const [adminPass,      setAdminPass]      = useState('');
  const [adminError,     setAdminError]     = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    getArticles(filter)
      .then(result => {
        if (!Array.isArray(result)) {
          throw new Error('Unexpected articles response from server');
        }
        setArticles(result);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async id => {
    if (!window.confirm('Delete this article permanently?')) return;
    setDeleting(id);
    try { await deleteArticle(id); load(); }
    catch (e) { alert(e.message); }
    finally { setDeleting(null); }
  };

  const openEdit = async id => {
    try {
      const full = await getArticle(id);
      setEditingArticle(full);
      setShowForm(true);
    } catch (e) { alert(e.message); }
  };

  const handleAdminLogin = () => {
    if (adminPass === ADMIN_PASSWORD) {
      setAdminMode(true);
      setAdminError('');
      setAdminPass('');
    } else {
      setAdminError('Incorrect password.');
    }
  };

  return (
    <section id="articles" className={styles.articles}>
      <div className={styles.container}>

        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Legal Insights</p>
          <h2 className={styles.sectionTitle}>Articles &amp; Updates</h2>
        </div>

        {/* ── Admin bar ── */}
        <div className={styles.adminBar}>
          {adminMode ? (
            <>
              <button
                className={styles.btnPrimary}
                onClick={() => { setEditingArticle(null); setShowForm(true); }}
              >
                + New Article
              </button>
              <button className={styles.btnOutline} onClick={() => { setAdminMode(false); setShowForm(false); }}>
                Exit Admin
              </button>
            </>
          ) : (
            <details className={styles.adminLogin}>
              <summary>Admin Login</summary>
              <div className={styles.adminLoginInner}>
                <input
                  type="password"
                  placeholder="Password"
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                />
                <button className={styles.btnPrimary} onClick={handleAdminLogin}>Login</button>
                {adminError && <span className={styles.formError}>{adminError}</span>}
              </div>
            </details>
          )}
        </div>

        {/* ── Category filter ── */}
        <div className={styles.filterBar}>
          {['', ...CATEGORIES].map(c => (
            <button
              key={c || 'all'}
              className={filter === c ? styles.filterActive : styles.filterBtn}
              onClick={() => setFilter(c)}
            >
              {c || 'All'}
            </button>
          ))}
        </div>

        {/* ── Create / Edit form ── */}
        {showForm && (
          <ArticleForm
            editing={editingArticle}
            onCancel={() => { setShowForm(false); setEditingArticle(null); }}
            onSuccess={() => { setShowForm(false); setEditingArticle(null); load(); }}
          />
        )}

        {/* ── Articles grid ── */}
        {loading ? (
          <div className={styles.loadingRow}>
            {[1, 2, 3].map(i => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : error ? (
          <div className={styles.errorBox}>
            <p>{error}</p>
            <button className={styles.btnOutline} onClick={load}>Retry</button>
          </div>
        ) : !Array.isArray(articles) || articles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No articles yet.{adminMode ? ' Click "+ New Article" to publish one.' : ''}</p>
          </div>
        ) : (
          <div className={styles.articlesGrid}>
            {articles.map(a => (
              <div key={a.id} className={styles.articleWrapper}>
                <ArticleCard article={a} onClick={setViewId} />
                {adminMode && (
                  <div className={styles.adminActions}>
                    <button className={styles.btnEdit} onClick={() => openEdit(a.id)}>
                      Edit
                    </button>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDelete(a.id)}
                      disabled={deleting === a.id}
                    >
                      {deleting === a.id ? '…' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Read modal ── */}
      {viewId && <ArticleModal articleId={viewId} onClose={() => setViewId(null)} />}
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   Contact
───────────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: wire to a Flask /api/contact route if needed
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <p className={styles.eyebrow}>Get in Touch</p>
            <h2 className={styles.sectionTitle}>
              Request a<br /><em>Consultation</em>
            </h2>
            <div className={styles.contactDetails}>
              {[
                ['✉', 'advocatenyambura@gmail.com'],
                ['✆', '+254 720 225 329 / +254 742 983 206'],
                ['⌂', 'Nairobi, Kenya'],
              ].map(([icon, text]) => (
                <div key={text} className={styles.contactItem}>
                  <span className={styles.contactIcon}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.contactForm}>
            {sent ? (
              <div className={styles.successBox}>
                <span className={styles.successIcon}>✓</span>
                <h3>Message Received</h3>
                <p>Thank you for reaching out. We will respond within 24 hours.</p>
                <button className={styles.btnOutline} onClick={() => setSent(false)}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {[
                  { label: 'Full Name',      field: 'name',    type: 'text',  placeholder: 'Your full name' },
                  { label: 'Email Address',  field: 'email',   type: 'email', placeholder: 'you@example.com' },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field} className={styles.formField}>
                    <label>{label}</label>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={set(field)}
                      placeholder={placeholder}
                      required
                    />
                  </div>
                ))}
                <div className={styles.formField}>
                  <label>Message</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Briefly describe your legal matter…"
                    required
                  />
                </div>
                <button type="submit" className={`${styles.btnPrimary} ${styles.fullWidth}`}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   Footer
───────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerInner}>
          <span className={styles.footerBrand}>MNM &amp; Co Advocates</span>
          <p>
            © {new Date().getFullYear()} Maureen Nyambura Mwangi &amp; Co Advocates.
            All Rights Reserved.
          </p>
          <div className={styles.footerLinks}>
            {['about', 'services', 'articles', 'contact'].map(l => (
              <a key={l} href={`#${l}`}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────
   App (root)
───────────────────────────────────────────────────── */
export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (typeof window.IntersectionObserver !== 'function') return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.35 }
    );
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar activeSection={activeSection} />
      <Hero />
      <About />
      <Services />
      <Articles />
      <Contact />
      <Footer />
    </>
  );
}
