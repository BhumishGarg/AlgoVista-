import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowDown, ArrowLeft, ArrowRight, BarChart3, Bookmark, Check, ChevronDown, CircleHelp,
  Code2, ExternalLink, Eye, EyeOff, GitBranch, Layers3, ListFilter, LoaderCircle, LogOut,
  Menu, MessageSquare, Search, ShieldCheck, Sparkles, X,
} from "lucide-react";
import { api, ApiError } from "./services/api.js";
import { useAuth } from "./context/AuthContext.jsx";
import ArrayVisualization from "./visualization/ArrayVisualization.jsx";
import { getArrayReferenceCode } from "./visualization/arrayAlgorithms.js";
import LinkedListVisualization from "./visualization/LinkedListVisualization.jsx";
import { getLinkedListReferenceCode } from "./visualization/linkedListAlgorithms.js";
import StackVisualization from "./visualization/StackVisualization.jsx";
import { getStackReferenceCode } from "./visualization/stackAlgorithms.js";
import QueueVisualization from "./visualization/QueueVisualization.jsx";
import { getQueueReferenceCode } from "./visualization/queueReferenceCode.js";
import BinaryTreeVisualization from "./visualization/BinaryTreeVisualization.jsx";
import HeapVisualization from "./visualization/HeapVisualization.jsx";
import { getHeapReferenceCode } from "./visualization/heapReferenceCode.js";
import SearchVisualization from "./visualization/SearchVisualization.jsx";
import { getSearchReferenceCode } from "./visualization/searchReferenceCode.js";
import SortingVisualization from "./visualization/SortingVisualization.jsx";
import { getSortingReferenceCode } from "./visualization/sortingReferenceCode.js";
import GraphVisualization from "./visualization/GraphVisualization.jsx";
import { getGraphReferenceCode } from "./visualization/graphReferenceCode.js";
import DynamicProgrammingVisualization from "./visualization/DynamicProgrammingVisualization.jsx";
import { getDynamicProgrammingCode } from "./visualization/dynamicProgrammingAlgorithms.js";

const TOPIC_ICONS = {
  arrays: Layers3,
  "linked-lists": GitBranch,
  stacks: Layers3,
  queues: ListFilter,
  "binary-trees": GitBranch,
  "heaps-priority-queue": BarChart3,
  searching: Search,
  sorting: ListFilter,
  graphs: GitBranch,
  "dynamic-programming": Sparkles,
};

function Logo({ compact = false }) {
  return <Link className="brand" to="/" aria-label="AlgoVista home">
    <span className="brand-mark"><GitBranch size={20} strokeWidth={2.2} /></span>
    {!compact && <span>Algo<span>Vista</span></span>}
  </Link>;
}

function Spinner({ label = "Loading" }) {
  return <div className="status-box" role="status"><LoaderCircle className="spin" size={22} /> <span>{label}</span></div>;
}

function ErrorState({ message, retry }) {
  return <div className="empty-state error-state"><CircleHelp size={28} /><h3>We couldn't load this yet</h3><p>{message}</p>{retry && <button className="button secondary" onClick={retry}>Try again</button>}</div>;
}

function App() {
  const { initialized, initializationError, refresh } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    if (initialized) {
      const timer = window.setTimeout(() => setShowSplash(false), 220);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setShowSplash(false), 1800);
    return () => window.clearTimeout(timer);
  }, [initialized]);
  if (showSplash) return <div className="splash"><Logo /><p>Visualize. Understand. Master.</p>{!initialized && <LoaderCircle className="spin" size={20} aria-label="Initializing" />}</div>;
  return <>
    {initializationError && <div className="connection-banner" role="alert"><span>{initializationError}</span><button onClick={() => refresh().catch(() => {})}>Retry session check</button></div>}
    <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/signup" element={<AuthPage mode="signup" />} />
    <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
    <Route path="/topics" element={<TopicsPage />} />
    <Route path="/topics/:slug" element={<TopicQuestions />} />
    <Route path="/questions/:slug" element={<QuestionDetails />} />
    <Route path="/visualize/:slug" element={<VisualizationPage />} />
    <Route path="/bookmarks" element={<Protected><BookmarksPage /></Protected>} />
    <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
    <Route path="*" element={<NotFound />} />
    </Routes>
  </>;
}

function Landing() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState("");
  async function loadTopics() {
    setTopicsLoading(true);
    setTopicsError("");
    try { setTopics(await api.topics()); }
    catch (error) { setTopicsError(error.message); }
    finally { setTopicsLoading(false); }
  }
  useEffect(() => { loadTopics(); }, []);
  return <div className="landing">
    <header className="site-header">
      <div className="container nav-inner"><Logo />
        <nav className={mobileOpen ? "public-nav open" : "public-nav"} aria-label="Main navigation">
          <a href="#home" onClick={() => setMobileOpen(false)}>Home</a>
          <a href="#topics" onClick={() => setMobileOpen(false)}>Explore Topics</a>
          <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How It Works</a>
        </nav>
        <div className="nav-actions">
          {user ? <Link className="button primary small" to="/topics">Continue learning <ArrowRight size={16} /></Link> : <>
            <Link className="login-link" to="/login">Log in</Link>
            <Link className="button primary small" to="/signup">Get started <ArrowRight size={16} /></Link>
          </>}
        </div>
        <button className="icon-button mobile-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
    <main>
      <section className="hero container" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> A clearer path to problem solving</div>
          <h1>Understand algorithms.<br /><span>One step at a time.</span></h1>
          <p className="hero-text">Explore data structures and algorithms through structured practice, clear explanations and interactive visual learning.</p>
          <div className="hero-actions"><Link className="button primary" to={user ? "/topics" : "/signup"}>Start learning <ArrowRight size={17} /></Link><a className="button secondary" href="#topics">Explore topics <ArrowDown size={16} /></a></div>
          <div className="hero-proof"><ShieldCheck size={17} /><span>Learn at your pace, one concept at a time</span></div>
        </div>
        <div className="preview-wrap" aria-label="Product preview, visualization features coming soon">
          <div className="preview-label"><span className="preview-dot" /> Product preview <span className="coming">Visualization coming soon</span></div>
          <div className="preview-card">
            <div className="preview-head"><div><div className="preview-kicker">ARRAYS · PRODUCT PREVIEW</div><h3>Problem workspace</h3></div><span className="difficulty">Preview only</span></div>
              <div className="preview-question"><span>A clear problem overview and room to think through an approach.</span><div className="array-row"><b>01</b><b>02</b><b>03</b><b>04</b><span className="target-chip">Example layout</span></div></div>
            <div className="preview-progress"><span>Learning path</span><span>01 <i>/</i> 04</span></div>
            <div className="progress-line"><span /></div>
            <div className="preview-steps"><div className="step active"><span>1</span><p>Understand<br />the problem</p></div><div className="step"><span>2</span><p>Choose an<br />approach</p></div><div className="step"><span>3</span><p>Visualize<br />the steps</p></div></div>
            <div className="preview-note"><Sparkles size={15} /> Interactive algorithm visualization is planned for a future release.</div>
          </div>
          <div className="preview-float"><div className="float-icon"><Check size={16} /></div><div><b>Built for understanding</b><small>Not just memorizing solutions</small></div></div>
        </div>
      </section>
      <section className="trust-strip"><div className="container trust-inner"><span>LEARN WITH A STRUCTURED APPROACH</span><div><Check size={16} /> Topic-based practice</div><div><Check size={16} /> Clear problem library</div><div><Check size={16} /> Your progress, your pace</div></div></section>
      <section className="section container" id="topics">
        <SectionHeading eyebrow="EXPLORE THE CATALOGUE" title="Build your foundations" text="Choose a topic and find the concepts you want to master next." action={<Link className="text-link" to="/topics">View all topics <ArrowRight size={16} /></Link>} />
        {topicsLoading ? <Spinner label="Loading topics…" /> : topicsError ? <ErrorState message={topicsError} retry={loadTopics} /> : <TopicGrid topics={topics.slice(0, 5)} compact />}
      </section>
      <section className="section feature-section" id="features"><div className="container">
        <SectionHeading eyebrow="A THOUGHTFUL LEARNING TOOLKIT" title="Designed around how you learn" text="A focused set of tools to help you go from unfamiliar to confident." />
        <div className="feature-grid">{[
          [Layers3, "Data Structure Explorer", "Build intuition for the structures behind common problems.", true],
          [ListFilter, "Topic-Based Question Library", "Browse a growing catalogue, organized around core concepts.", false],
          [BarChart3, "Step-by-Step Visualization", "See algorithms unfold at your own pace.", true],
          [Code2, "Java Code Walkthroughs", "Connect an approach to readable, carefully explained code.", true],
          [ArrowRight, "Interactive Playback Controls", "Pause, step and revisit important algorithm moments.", true],
          [Code2, "Multi-Language Playground", "Practice solutions in an in-browser coding environment.", true],
          [ShieldCheck, "Personal Learning Profile", "Keep your account and learning preferences in one place.", false],
          [Bookmark, "Bookmarks & Learning Progress", "Save problems you want to return to and track real activity.", false],
        ].map(([Icon, title, description, planned]) => <article className="feature-card" key={title}><div className="feature-icon"><Icon size={19} /></div><div className="feature-title-row"><h3>{title}</h3>{planned && <span className="planned-tag">Planned</span>}</div><p>{description}</p></article>)}</div>
      </div></section>
      <section className="section container" id="how-it-works"><SectionHeading eyebrow="HOW IT WORKS" title="A simple path to deeper understanding" text="Start with the fundamentals. Build confidence through deliberate practice." />
        <div className="journey-grid">{[
          ["01", "Choose a topic", "Start with a data structure or algorithm category that interests you."],
          ["02", "Select a problem", "Browse the catalogue and open a problem to understand what it asks."],
          ["03", "Learn the approach", "Explore verified problem information and join the discussion."],
          ["04", "Visualize & practice", "Interactive walkthroughs and the coding playground are planned for later phases."],
        ].map(([number, title, body], index) => <article className="journey-card" key={number}><div className="journey-number">{number}<span>{index < 3 && <ArrowRight size={15} />}</span></div><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>
      <section className="bottom-cta"><div className="container cta-inner"><div><div className="eyebrow light"><Sparkles size={14} /> YOUR NEXT CONCEPT STARTS HERE</div><h2>Make your next problem<br />a learning moment.</h2></div><Link className="button white" to={user ? "/topics" : "/signup"}>{user ? "Browse topics" : "Create your account"} <ArrowRight size={17} /></Link></div></section>
    </main>
    <Footer />
  </div>;
}

function SectionHeading({ eyebrow, title, text, action }) {
  return <div className="section-heading"><div><span className="section-eyebrow">{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>{action}</div>;
}

function TopicGrid({ topics, compact = false }) {
  if (!topics.length) return <div className="empty-state"><Layers3 size={28} /><h3>No topics available</h3><p>Topics will appear once the catalogue is available.</p></div>;
  return <div className={compact ? "topic-grid compact" : "topic-grid"}>{topics.map((topic) => {
    const Icon = topic.Icon || TOPIC_ICONS[topic.slug] || Layers3;
    return <Link to={`/topics/${topic.slug}`} className="topic-card" key={topic.id || topic.slug}><div className="topic-icon"><Icon size={20} /></div><h3>{topic.name}</h3><p>{topic.description}</p><div className="topic-card-footer"><span>{Number.isInteger(topic.questionCount) ? `${topic.questionCount} questions` : "Explore topic"}</span><ArrowRight size={16} /></div></Link>;
  })}</div>;
}

function Footer() {
  return <footer className="footer"><div className="container footer-main"><div className="footer-brand"><Logo /><p>A thoughtful way to learn data structures and algorithms, one concept at a time.</p></div><div className="footer-links"><div><b>Explore</b><Link to="/topics">Topics</Link><a href="/#features">Features</a></div><div><b>Account</b><Link to="/login">Log in</Link><Link to="/signup">Create account</Link></div></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} AlgoVista</span><span>Built for curious minds and careful problem solvers.</span></div></footer>;
}

function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const { user, setUser, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [fields, setFields] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");
  if (initialized && user) return <Navigate to="/dashboard" replace />;
  function update(event) {
    setFields({ ...fields, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: "" });
    setServerError("");
  }
  async function submit(event) {
    event.preventDefault();
    const next = {};
    if (isSignup && fields.fullName.trim().length < 2) next.fullName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = "Enter a valid email address.";
    if (fields.password.length < 8) next.password = "Use at least 8 characters.";
    if (new TextEncoder().encode(fields.password).length > 72) next.password = "Password must be at most 72 UTF-8 bytes.";
    if (isSignup && fields.password !== fields.confirmPassword) next.confirmPassword = "Passwords do not match.";
    if (Object.keys(next).length) { setErrors(next); return; }
    setBusy(true); setServerError("");
    try {
      const result = isSignup
        ? await api.signup({ fullName: fields.fullName.trim(), email: fields.email.trim(), password: fields.password })
        : await api.login({ email: fields.email.trim(), password: fields.password });
      setUser(result.user);
      const destination = location.state?.from;
      const safeDestination = typeof destination === "string" && destination.startsWith("/") && !destination.startsWith("//")
        ? destination
        : "/dashboard";
      navigate(safeDestination, { replace: true });
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "Unable to complete your request.");
    } finally { setBusy(false); }
  }

  if (isSignup) {
    return (
      <div className="signup-shell">
        <div className="signup-left">
          <Link className="brand brand-light" to="/"><span className="brand-mark"><GitBranch size={20} strokeWidth={2.2} /></span><span>Algo<span>Vista</span></span></Link>
          <div className="signup-left-content">
            <div className="signup-eyebrow">🚀 Start Your Journey</div>
            <h1>Join AlgoVista.<br /><span>Master DSA.</span></h1>
            <p>Practice, Visualize, Learn. Grow. All in One Place.</p>
            <div className="signup-features">
              <span><Check size={16} /> 500+ curated problems</span>
              <span><Check size={16} /> Interactive visualizations</span>
              <span><Check size={16} /> Track your progress</span>
              <span><Check size={16} /> Bookmark &amp; revisit</span>
            </div>
          </div>
          <div className="signup-left-deco">
            <div className="deco-blob deco-blob-1" />
            <div className="deco-blob deco-blob-2" />
          </div>
        </div>
        <div className="signup-right">
          <div className="auth-back-link"><Link className="text-link" to="/"><ArrowLeft size={16} /> Back to home</Link></div>
          <div className="auth-form-box">
            <div className="auth-form-header">
              <h2>Create your account</h2>
              <p>Start building your understanding, one topic at a time.</p>
            </div>
            {serverError && <div className="form-alert" role="alert">{serverError}</div>}
            <form onSubmit={submit} noValidate>
              <Field label="Full name" name="fullName" value={fields.fullName} onChange={update} error={errors.fullName} placeholder="Your name" autoComplete="name" />
              <Field label="Email address" name="email" type="email" value={fields.email} onChange={update} error={errors.email} placeholder="you@example.com" autoComplete="email" />
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="password-wrap">
                  <input id="password" name="password" type={visible ? "text" : "password"} value={fields.password} onChange={update} autoComplete="new-password" aria-invalid={Boolean(errors.password)} placeholder="At least 8 characters" />
                  <button className="password-toggle" type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                </div>
                {errors.password && <span className="field-error">{errors.password}</span>}
                <span className="field-hint">Use at least 8 characters (maximum 72 UTF-8 bytes).</span>
              </div>
              <Field label="Confirm password" name="confirmPassword" type={visible ? "text" : "password"} value={fields.confirmPassword} onChange={update} error={errors.confirmPassword} placeholder="Re-enter your password" autoComplete="new-password" />
              <button className="button signup-submit full" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={17} /> Please wait…</> : "Create account"}</button>
            </form>
            <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
            <div className="privacy-note"><ShieldCheck size={15} /> Your account information is handled securely.</div>
          </div>
        </div>
      </div>
    );
  }

  // Login page
  return (
    <div className="login-shell">
      <div className="login-left">
        <Link className="brand brand-light" to="/"><span className="brand-mark"><GitBranch size={20} strokeWidth={2.2} /></span><span>Algo<span>Vista</span></span></Link>
        <div className="login-left-content">
          <h1>Welcome Back! 👋</h1>
          <p>Continue your DSA learning journey. Pick up right where you left off.</p>
          <div className="login-features">
            <div className="login-feature-pill"><Check size={14} /> Track progress</div>
            <div className="login-feature-pill"><Bookmark size={14} /> View bookmarks</div>
            <div className="login-feature-pill"><BarChart3 size={14} /> Visualizations</div>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="auth-back-link"><Link className="text-link" to="/"><ArrowLeft size={16} /> Back to home</Link></div>
        <div className="auth-form-box">
          <div className="auth-form-header">
            <div className="login-form-icon"><ShieldCheck size={26} /></div>
            <h2>Log in to AlgoVista</h2>
            <p>Log in to continue your learning journey.</p>
          </div>
          {serverError && <div className="form-alert" role="alert">{serverError}</div>}
          <form onSubmit={submit} noValidate>
            <Field label="Email address" name="email" type="email" value={fields.email} onChange={update} error={errors.email} placeholder="you@example.com" autoComplete="email" />
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input id="password" name="password" type={visible ? "text" : "password"} value={fields.password} onChange={update} autoComplete="current-password" aria-invalid={Boolean(errors.password)} placeholder="Enter your password" />
                <button className="password-toggle" type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <button className="button login-submit full" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={17} /> Please wait…</> : "Log in"}</button>
          </form>
          <p className="auth-switch">New to AlgoVista? <Link to="/signup">Create an account</Link></p>
          <div className="privacy-note"><ShieldCheck size={15} /> Your account information is handled securely.</div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, error, placeholder, autoComplete }) {
  const id = `field-${name}`;
  return <div className="field"><label htmlFor={id}>{label}</label><input id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />{error && <span className="field-error" id={`${id}-error`}>{error}</span>}</div>;
}

function Protected({ children }) {
  const { user, initialized } = useAuth();
  const location = useLocation();
  if (!initialized) return <Spinner label="Checking your session…" />;
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

function AppFrame({ title, children, action }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  async function handleLogout() { try { await logout(); navigate("/"); } catch (e) { window.alert(e.message); } }
  return <div className="app-shell"><header className="app-header"><div className="container app-nav"><Logo /><nav className={menuOpen ? "app-nav-links open" : "app-nav-links"}><Link to="/topics">Explore topics</Link><Link to="/bookmarks">My bookmarks</Link><Link to="/profile">Profile</Link></nav><div className="account-nav"><span>{user?.fullName}</span><button className="icon-button logout-button" onClick={handleLogout} title="Log out"><LogOut size={17} /><span>Log out</span></button></div><button className="icon-button app-mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></div></header>
    <main className="container app-content"><div className="page-heading"><div><span className="section-eyebrow">ALGOVISTA LEARNING</span><h1>{title}</h1></div>{action}</div>{children}</main><Footer /></div>;
}

function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() { setLoading(true); setError(""); try { setTopics(await api.topics()); } catch (e) { setError(e.message); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  const visible = (topics.length ? topics : []).filter((topic) => topic.name.toLowerCase().includes(query.toLowerCase()));
  return <AppFrame title="Explore topics"><div className="catalogue-intro"><p>Choose a topic to explore its problem catalogue. Question counts reflect the records currently available.</p><div className="search-box"><Search size={18} /><input aria-label="Search topics" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search topics…" /></div></div>
    {loading ? <Spinner label="Loading topics…" /> : error ? <ErrorState message={error} retry={load} /> : topics.length === 0 ? <div className="empty-state"><Layers3 size={28} /><h3>Topics are not available</h3><p>Try again later, or return to the home page.</p><Link className="button secondary" to="/">Back home</Link></div> : visible.length ? <TopicGrid topics={visible} /> : <div className="empty-state"><Search size={26} /><h3>No matching topics</h3><p>Try a different search term.</p></div>}</AppFrame>;
}

function TopicQuestions() {
  const { slug } = useParams();
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() { setLoading(true); setError(""); try { const [topicData, questionData] = await Promise.all([api.topic(slug), api.topicQuestions(slug, { search: query, difficulty, page, size: 20 })]); setTopic(topicData); setQuestions(questionData.content || []); } catch (e) { setError(e.message); } finally { setLoading(false); } }
  useEffect(() => { load(); }, [slug, query, difficulty, page]);
  useEffect(() => {
    const timer = window.setTimeout(() => { setQuery(searchInput); setPage(0); }, 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);
  return <AppFrame title={topic?.name || "Topic questions"}><div className="breadcrumbs"><Link to="/topics">Topics</Link><span>/</span><span>{topic?.name || "…"}</span></div>{topic?.description && <p className="topic-description">{topic.description}</p>}
    <div className="catalogue-controls"><div className="search-box"><Search size={18} /><input aria-label="Search questions" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search questions…" /></div><label className="select-wrap"><span className="sr-only">Filter by difficulty</span><select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(0); }}><option value="">All difficulties</option><option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option></select><ChevronDown size={16} /></label></div>
    {loading ? <Spinner label="Loading questions…" /> : error ? <ErrorState message={error} retry={load} /> : <><p className="result-count">{questions.length} question{questions.length === 1 ? "" : "s"} on this page</p>{questions.length ? <div className="question-list">{questions.map((question) => <QuestionRow key={question.id} question={question} />)}</div> : <div className="empty-state"><Search size={28} /><h3>No questions found</h3><p>This topic has no imported questions matching your search yet.</p></div>}<div className="pagination"><button className="button secondary small" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page + 1}</span><button className="button secondary small" disabled={questions.length < 20} onClick={() => setPage(page + 1)}>Next</button></div></>}</AppFrame>;
}

function QuestionRow({ question }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookmarked, setBookmarked] = useState(Boolean(question.bookmarked));
  const [busy, setBusy] = useState(false);
  async function toggle() {
    if (!user) { navigate("/login", { state: { from: location.pathname } }); return; }
    setBusy(true);
    try { if (bookmarked) await api.removeBookmark(question.id); else await api.addBookmark(question.id); setBookmarked(!bookmarked); }
    catch (e) { window.alert(e.message); } finally { setBusy(false); }
  }
  return <article className="question-row"><div className="question-main"><div className="question-name"><Link to={`/questions/${question.slug}`}>{question.title}</Link>{question.leetcodeNumber && <span className="problem-number">#{question.leetcodeNumber}</span>}</div><div className="question-meta">{question.difficulty && <span className={`difficulty ${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>}{question.completed === true && <span className="q-completed-badge"><Check size={12} /> Solved</span>}{question.shortDescription && <span>{question.shortDescription}</span>}</div></div><div className="question-actions"><button className={`icon-button bookmark-button ${bookmarked ? "saved" : ""}`} onClick={toggle} disabled={busy} aria-label={bookmarked ? "Remove bookmark" : "Bookmark question"} title={!user ? "Log in to bookmark" : undefined}><Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} /></button><Link className="button secondary small" to={`/questions/${question.slug}`}>Open problem <ArrowRight size={15} /></Link></div></article>;
}

function QuestionDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");
  async function loadQuestion() { setLoading(true); setError(""); try { setQuestion(await api.question(slug)); } catch (e) { setError(e.message); } finally { setLoading(false); } }
  async function loadComments(questionId) { setCommentsLoading(true); setCommentError(""); try { const result = await api.comments(questionId); setComments(result.content || []); } catch (e) { setCommentError(e.message); } finally { setCommentsLoading(false); } }
  useEffect(() => { loadQuestion(); }, [slug]);
  useEffect(() => { if (question?.id) loadComments(question.id); }, [question?.id]);
  async function submitComment(event) {
    event.preventDefault();
    const text = commentText.trim();
    if (text.length < 1 || text.length > 2000) { setCommentError("Comments must be between 1 and 2,000 characters."); return; }
    try { const created = await api.postComment(question.id, text); setComments([created, ...comments]); setCommentText(""); setCommentError(""); }
    catch (e) { setCommentError(e.message); }
  }
  async function updateComment(comment) {
    const content = window.prompt("Edit your comment", comment.content);
    if (content === null || !content.trim()) return;
    try { const updated = await api.editComment(comment.id, content.trim()); setComments(comments.map((item) => item.id === updated.id ? updated : item)); }
    catch (e) { window.alert(e.message); }
  }
  async function deleteComment(comment) {
    if (!window.confirm("Delete this comment?")) return;
    try { await api.deleteComment(comment.id); setComments(comments.filter((item) => item.id !== comment.id)); }
    catch (e) { window.alert(e.message); }
  }
  return <AppFrame title={loading ? "Problem details" : question?.title || "Problem not found"}>{loading ? <Spinner label="Loading problem…" /> : error ? <ErrorState message={error} retry={loadQuestion} /> : question && <>
    <div className="breadcrumbs"><Link to={`/topics/${question.topic.slug}`}>{question.topic.name}</Link><span>/</span><span>{question.title}</span></div>
    <div className="problem-layout"><div className="problem-primary">
      <section className="content-panel"><div className="problem-heading"><div>{question.leetcodeNumber && <span className="problem-number">#{question.leetcodeNumber}</span>} {question.difficulty && <span className={`difficulty ${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>}</div><BookmarkButton question={question} /></div><h2>{question.title}</h2>{question.shortDescription ? <p className="problem-intro">{question.shortDescription}</p> : !question.statement && <p className="problem-intro">Problem statement has not been imported yet.</p>}
        {question.statement ? <div className="problem-statement">{question.statement}</div> : <div className="unavailable"><CircleHelp size={20} /><div><b>Full problem statement unavailable</b><p>This catalogue entry does not include a verified statement. Open the official source if available.</p></div></div>}
        {question.examples?.length > 0 && <section className="metadata-block"><h3>Examples</h3>{question.examples.map((example, i) => <pre key={i}>{`Example ${i + 1}\nInput: ${example.input || "Not provided"}\nOutput: ${example.output || "Not provided"}${example.explanation ? `\nExplanation: ${example.explanation}` : ""}`}</pre>)}</section>}
        {question.constraints && <section className="metadata-block"><h3>Constraints</h3><p>{question.constraints}</p></section>}
        {question.inputDescription && <section className="metadata-block"><h3>Input format</h3><p>{question.inputDescription}</p></section>}
        {question.outputDescription && <section className="metadata-block"><h3>Expected output</h3><p>{question.outputDescription}</p></section>}
        {question.approaches?.length > 0 && <section className="metadata-block"><h3>Approaches</h3><div className="approach-list">{question.approaches.map((approach) => <article className="approach-card" key={approach.name}><h4>{approach.name}</h4><ol>{approach.steps.map((step, index) => <li key={index}>{step}</li>)}</ol><p className="approach-complexity"><span>Time: {approach.timeComplexity}</span><span>Space: {approach.spaceComplexity}</span></p></article>)}</div></section>}
        {question.officialUrl && <a className="text-link official-link" href={question.officialUrl} target="_blank" rel="noreferrer">View official problem <ExternalLink size={15} /></a>}
      </section>
      {["arrays", "linked-lists", "stacks", "queues", "binary-trees", "heaps-priority-queue", "searching", "sorting", "graphs", "dynamic-programming"].includes(question.topic.slug) ? <Link className="content-panel visualization-placeholder visualization-link" to={`/visualize/${question.slug}`}><div className="feature-icon"><BarChart3 size={19} /></div><div><span className="section-eyebrow">LEARNING WORKSPACE</span><h3>Visualize this problem <ArrowRight size={16} /></h3>{question.visualizationGuide && <p className="visualization-guide">{question.visualizationGuide}</p>}<p>Open the interactive workspace to try input and step through this algorithm.</p><span className="planned-tag">Open interactive workspace</span></div></Link> : <section className="content-panel visualization-placeholder"><div className="feature-icon"><BarChart3 size={19} /></div><div><span className="section-eyebrow">LEARNING WORKSPACE</span><h3>Visualization guide</h3>{question.visualizationGuide && <p className="visualization-guide">{question.visualizationGuide}</p>}<p>Interactive visualizations are not implemented yet; this guide describes what a walkthrough could show.</p><span className="planned-tag">Interactive playback: future phase</span></div></section>}
      <section className="content-panel comments-panel"><div className="comments-heading"><div><MessageSquare size={19} /><h3>Discussion</h3></div><span>{comments.length} comments</span></div>
        {user ? <form onSubmit={submitComment} className="comment-form"><label htmlFor="comment">Share a helpful thought</label><textarea id="comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} maxLength={2000} placeholder="Ask a question or share your approach…" /><div className="comment-form-footer"><span>{commentText.length}/2000</span><button className="button primary small" disabled={!commentText.trim()}>Post comment <ArrowRight size={15} /></button></div></form> : <div className="login-prompt"> <Link to="/login">Log in</Link> to join the discussion.</div>}
        {commentError && <p className="inline-error" role="alert">{commentError}</p>}
        {commentsLoading ? <Spinner label="Loading discussion…" /> : comments.length ? <div className="comment-list">{comments.map((comment) => <article className="comment" key={comment.id}><div className="comment-avatar">{comment.authorName?.[0]?.toUpperCase() || "A"}</div><div className="comment-body"><div className="comment-author"><b>{comment.authorName}</b><time>{new Date(comment.createdAt).toLocaleString()}</time></div><p>{comment.content}</p>{user?.id === comment.authorId && <div className="comment-actions"><button onClick={() => updateComment(comment)}>Edit</button><button onClick={() => deleteComment(comment)}>Delete</button></div>}</div></article>)}</div> : <div className="discussion-empty">{commentError ? <button className="text-link" onClick={() => loadComments(question.id)}>Retry loading comments</button> : "No comments yet. Start the discussion."}</div>}
      </section>
    </div><aside className="problem-side"><div className="content-panel"><span className="section-eyebrow">ABOUT THIS PROBLEM</span><dl className="problem-facts"><dt>Topic</dt><dd>{question.topic.name}</dd><dt>Difficulty</dt><dd>{question.difficulty || "Not verified"}</dd><dt>Visualization</dt><dd>{question.visualizationSupported ? "Available" : "Not available yet"}</dd></dl></div><div className="content-panel side-note"><Sparkles size={18} /><p>Use the problem statement, examples, and approaches to build your understanding before you code.</p></div></aside></div>
  </>}</AppFrame>;
}

function VisualizationPage() {
  const { slug } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function loadQuestion() {
    setLoading(true);
    setError("");
    try {
      const result = await api.question(slug);
      const isArray = result.topic.slug === "arrays" && getArrayReferenceCode(result.slug, "java");
      const isLinkedList = result.topic.slug === "linked-lists" && getLinkedListReferenceCode(result.slug, "java");
      const isStack = result.topic.slug === "stacks" && getStackReferenceCode(result.slug, "java");
      const isQueue = result.topic.slug === "queues" && getQueueReferenceCode(result.slug, "java");
      const isBinaryTree = result.topic.slug === "binary-trees" && result.visualizationSupported;
      const isHeap = result.topic.slug === "heaps-priority-queue" && getHeapReferenceCode(result.slug, "java");
      const isSearch = result.topic.slug === "searching" && getSearchReferenceCode(result.slug, "java");
      const isSorting = result.topic.slug === "sorting" && getSortingReferenceCode(result.slug, "java");
      const isGraph = result.topic.slug === "graphs" && getGraphReferenceCode(result.slug, "java");
      const isDynamicProgramming = result.topic.slug === "dynamic-programming" && getDynamicProgrammingCode(result.slug, "java");
      if (!isArray && !isLinkedList && !isStack && !isQueue && !isBinaryTree && !isHeap && !isSearch && !isSorting && !isGraph && !isDynamicProgramming) throw new Error("An interactive workspace is not available for this question yet.");
      setQuestion(result);
    } catch (loadError) {
      setError(loadError.message);
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { loadQuestion(); }, [slug]);
  return <AppFrame title={question?.title ? `${question.title} · Visualization` : "Problem visualization"}>
    {loading ? <Spinner label="Loading visualization workspace…" /> : error ? <ErrorState message={error} retry={loadQuestion} />     : question && (question.topic.slug === "arrays" ? <ArrayVisualization question={question} /> : question.topic.slug === "linked-lists" ? <LinkedListVisualization question={question} /> : question.topic.slug === "stacks" ? <StackVisualization question={question} /> : question.topic.slug === "binary-trees" ? <BinaryTreeVisualization question={question} /> : question.topic.slug === "heaps-priority-queue" ? <HeapVisualization question={question} /> : question.topic.slug === "searching" ? <SearchVisualization question={question} /> : question.topic.slug === "sorting" ? <SortingVisualization question={question} /> : question.topic.slug === "graphs" ? <GraphVisualization question={question} /> : question.topic.slug === "dynamic-programming" ? <DynamicProgrammingVisualization key={question.slug} question={question} /> : <QueueVisualization question={question} />)}
  </AppFrame>;
}

function BookmarkButton({ question }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [saved, setSaved] = useState(Boolean(question.bookmarked));
  const [busy, setBusy] = useState(false);
  async function toggle() {
    if (!user) { navigate("/login", { state: { from: location.pathname } }); return; }
    setBusy(true);
    try { if (saved) await api.removeBookmark(question.id); else await api.addBookmark(question.id); setSaved(!saved); }
    catch (e) { window.alert(e.message); } finally { setBusy(false); }
  }
  return <button className={`button secondary small ${saved ? "saved" : ""}`} onClick={toggle} disabled={busy}><Bookmark size={16} fill={saved ? "currentColor" : "none"} />{saved ? "Saved" : "Bookmark"}</button>;
}

function BookmarksPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() { setLoading(true); setError(""); try { setQuestions(await api.bookmarks()); } catch (e) { setError(e.message); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  return <AppFrame title="My bookmarks">{loading ? <Spinner label="Loading bookmarks…" /> : error ? <ErrorState message={error} retry={load} /> : questions.length ? <div className="question-list">{questions.map((question) => <QuestionRow question={question} key={question.id} />)}</div> : <div className="empty-state"><Bookmark size={28} /><h3>No bookmarks yet</h3><p>Save problems you want to return to while browsing topics.</p><Link className="button primary" to="/topics">Explore topics <ArrowRight size={16} /></Link></div>}</AppFrame>;
}

function ProfilePage() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function load() { setLoading(true); setError(""); try { const data = await api.profile(); setProfile(data); setName(data.fullName); } catch (e) { setError(e.message); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function save(event) {
    event.preventDefault();
    if (name.trim().length < 2) { setError("Name must contain at least 2 characters."); return; }
    setBusy(true); setError(""); setNotice("");
    try { const updated = await api.updateProfile({ fullName: name.trim() }); setProfile(updated); setUser(updated); setName(updated.fullName); setEditing(false); setNotice("Profile updated."); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <AppFrame title="Your profile">{loading ? <Spinner label="Loading profile…" /> : error && !profile ? <ErrorState message={error} retry={load} /> : profile && <div className="profile-layout"><section className="content-panel profile-card"><div className="profile-avatar">{profile.fullName?.[0]?.toUpperCase()}</div><div className="profile-title"><h2>{profile.fullName}</h2><p>{profile.email}</p></div><div className="profile-divider" />
    {notice && <div className="success-alert" role="status">{notice}</div>}{error && <div className="form-alert" role="alert">{error}</div>}
    {editing ? <form onSubmit={save}><Field label="Full name" name="profileName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /><div className="profile-form-actions"><button type="button" className="button secondary" onClick={() => { setEditing(false); setName(profile.fullName); }}>Cancel</button><button className="button primary" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button></div></form> : <><div className="profile-details"><div><span>Full name</span><b>{profile.fullName}</b></div><div><span>Email address</span><b>{profile.email}</b></div><div><span>Member since</span><b>{new Date(profile.createdAt).toLocaleDateString()}</b></div></div><button className="button secondary" onClick={() => setEditing(true)}>Edit profile</button></>}</section>
    <aside className="content-panel profile-stats"><span className="section-eyebrow">YOUR ACTIVITY</span><div className="stat-row"><span><Bookmark size={17} /> Bookmarked questions</span><b>{profile.bookmarkCount ?? 0}</b></div><div className="stat-row"><span><Check size={17} /> Completed questions</span><b>{profile.completedCount ?? 0}</b></div><div className="profile-empty-note">Your learning activity will appear here as you use AlgoVista.</div></aside></div>}</AppFrame>;
}

function NotFound() {
  return <main className="not-found"><Logo /><span className="section-eyebrow">404 · PAGE NOT FOUND</span><h1>This page isn't in the catalogue.</h1><p>The link may be outdated, or the page may have moved.</p><Link className="button primary" to="/">Return home <ArrowRight size={16} /></Link></main>;
}

function Dashboard() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.bookmarks()
      .then(data => setBookmarks(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.fullName?.split(" ")[0] || user?.fullName || "Learner";

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div className="dashboard-nav-inner">
          <Logo />
          <nav className="dashboard-nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/topics">Problems</Link>
            <Link to="/bookmarks">Bookmarks</Link>
            <Link to="/profile">Profile</Link>
          </nav>
          <DashboardUserMenu />
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div>
            <h1>Welcome back, {firstName}! 👋</h1>
            <p>Keep going! You're on a great learning journey.</p>
          </div>
          <Link className="button primary" to="/topics">Explore Problems <ArrowRight size={16} /></Link>
        </div>

        <div className="dashboard-stats">
          <div className="dash-stat-card dash-stat-blue">
            <div className="dash-stat-icon"><Bookmark size={22} /></div>
            <div>
              <div className="dash-stat-num">{loading ? "…" : bookmarks.length}</div>
              <div className="dash-stat-label">Bookmarked</div>
            </div>
          </div>
          <div className="dash-stat-card dash-stat-green">
            <div className="dash-stat-icon"><Check size={22} /></div>
            <div>
              <div className="dash-stat-num">0</div>
              <div className="dash-stat-label">Solved</div>
            </div>
          </div>
          <div className="dash-stat-card dash-stat-purple">
            <div className="dash-stat-icon"><Sparkles size={22} /></div>
            <div>
              <div className="dash-stat-num">10+</div>
              <div className="dash-stat-label">Topics Available</div>
            </div>
          </div>
          <div className="dash-stat-card dash-stat-orange">
            <div className="dash-stat-icon"><BarChart3 size={22} /></div>
            <div>
              <div className="dash-stat-num">500+</div>
              <div className="dash-stat-label">Problems</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <section className="dash-section">
            <div className="dash-section-head">
              <h2>Continue Learning</h2>
              <Link className="text-link" to="/topics">View all topics <ArrowRight size={15} /></Link>
            </div>
            <div className="dash-quick-actions">
              <Link to="/topics" className="dash-action-card">
                <div className="dash-action-icon dash-action-green"><Layers3 size={24} /></div>
                <div>
                  <h3>Topic Explorer</h3>
                  <p>Browse all DSA topics and problem categories</p>
                </div>
                <ArrowRight size={18} className="dash-action-arrow" />
              </Link>
              <Link to="/bookmarks" className="dash-action-card">
                <div className="dash-action-icon dash-action-blue"><Bookmark size={24} /></div>
                <div>
                  <h3>My Bookmarks</h3>
                  <p>{loading ? "Loading…" : `${bookmarks.length} saved problem${bookmarks.length !== 1 ? "s" : ""}`}</p>
                </div>
                <ArrowRight size={18} className="dash-action-arrow" />
              </Link>
              <Link to="/topics/arrays" className="dash-action-card">
                <div className="dash-action-icon dash-action-purple"><Code2 size={24} /></div>
                <div>
                  <h3>Start with Arrays</h3>
                  <p>The best foundation for DSA mastery</p>
                </div>
                <ArrowRight size={18} className="dash-action-arrow" />
              </Link>
            </div>
          </section>

          <section className="dash-section">
            <div className="dash-section-head">
              <h2>Recent Bookmarks</h2>
              <Link className="text-link" to="/bookmarks">View all <ArrowRight size={15} /></Link>
            </div>
            {loading ? (
              <Spinner label="Loading bookmarks…" />
            ) : bookmarks.length === 0 ? (
              <div className="dash-empty">
                <Bookmark size={26} />
                <p>No bookmarks yet. Start exploring problems and save ones you want to revisit!</p>
                <Link className="button secondary" to="/topics">Browse Topics</Link>
              </div>
            ) : (
              <div className="dash-bookmark-list">
                {bookmarks.slice(0, 5).map(q => (
                  <Link to={`/questions/${q.slug}`} className="dash-bookmark-row" key={q.id}>
                    <div className="dash-bookmark-info">
                      <span className="dash-bookmark-title">{q.title}</span>
                      {q.difficulty && <span className={`difficulty ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>}
                    </div>
                    <ArrowRight size={15} className="dash-bookmark-arrow" />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function DashboardUserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  async function handleLogout() {
    try { await logout(); navigate("/"); } catch (e) { window.alert(e.message); }
  }
  return (
    <div className="dash-user-menu" style={{ position: "relative" }}>
      <button className="dash-user-btn" onClick={() => setOpen(!open)}>
        <div className="dash-user-avatar">{user?.fullName?.[0]?.toUpperCase() || "U"}</div>
        <span className="dash-user-name">{user?.fullName}</span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="dash-user-dropdown">
          <Link to="/profile" onClick={() => setOpen(false)}><ShieldCheck size={15} /> Profile</Link>
          <button onClick={handleLogout}><LogOut size={15} /> Log out</button>
        </div>
      )}
    </div>
  );
}

export default App;
