import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Code2, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Link } from "react-router-dom";
import { buildSearchTrace } from "./searchAlgorithms.js";
import { getSearchReferenceCode } from "./searchReferenceCode.js";

const LANGUAGES = [
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
];

function sampleInput(question) {
  return question.examples?.[0]?.input || "";
}

function ArrayView({ values, active, left, right, mid, label }) {
  if (!values.length) return <section className="search-structure"><b>{label}</b><span className="stack-empty">empty</span></section>;
  return <section className="search-structure">
    <b>{label}</b>
    <div className="search-array">
      {values.map((value, index) => <div className={`search-cell ${active.includes(index) ? "search-cell-active" : ""} ${index === mid ? "search-cell-mid" : ""}`} key={`${index}-${value}`}>
        <small>{index}</small><strong>{String(value)}</strong>
        {index === left && <span className="search-pointer search-pointer-left">L</span>}
        {index === right && <span className="search-pointer search-pointer-right">R</span>}
      </div>)}
    </div>
  </section>;
}

function MatrixView({ matrix, active }) {
  if (!matrix) return null;
  const cols = matrix[0]?.length || 1;
  return <section className="search-structure"><b>Matrix</b>
    <div className="search-matrix" style={{ gridTemplateColumns: `repeat(${cols}, minmax(35px, 1fr))` }}>
      {matrix.flatMap((row, r) => row.map((value, c) => {
        const index = r * cols + c;
        return <div className={`search-cell ${active.includes(index) ? "search-cell-active" : ""}`} key={`${r}-${c}`}><small>{r},{c}</small><strong>{value}</strong></div>;
      }))}
    </div>
  </section>;
}

export default function SearchVisualization({ question }) {
  const initialInput = sampleInput(question);
  const [input, setInput] = useState(initialInput);
  const [language, setLanguage] = useState("java");
  const [frames, setFrames] = useState(() => buildSearchTrace(question.slug, initialInput).frames);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const frame = frames[step];
  const code = useMemo(() => getSearchReferenceCode(question.slug, language), [question.slug, language]);
  const isSample = input.trim() === initialInput.trim();

  useEffect(() => {
    setInput(sampleInput(question));
    setPlaying(false);
    setError("");
    try {
      setFrames(buildSearchTrace(question.slug, sampleInput(question)).frames);
      setStep(0);
    } catch (traceError) {
      setFrames([]);
      setStep(0);
      setError(traceError.message);
    }
  }, [question.slug, initialInput]);

  useEffect(() => {
    if (!playing) return undefined;
    if (step >= frames.length - 1) {
      setPlaying(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setStep((current) => Math.min(current + 1, frames.length - 1)), 850);
    return () => window.clearTimeout(timer);
  }, [playing, step, frames.length]);

  function visualize(event) {
    event.preventDefault();
    setPlaying(false);
    setError("");
    try {
      setFrames(buildSearchTrace(question.slug, input).frames);
      setStep(0);
    } catch (traceError) {
      setError(traceError.message);
    }
  }

  function restart() {
    setPlaying(false);
    setStep(0);
  }

  return <div className="visualizer-page">
    <div className="breadcrumbs"><Link to="/topics/searching">Searching</Link><span>/</span><span>{question.title}</span><span>/</span><span>Visualization</span></div>
    <div className="visualizer-intro">
      <div><span className="section-eyebrow"><Code2 size={14} /> SEARCHING LEARNING WORKSPACE</span><h2>{question.title}</h2><p>Trace the search range, comparisons, and decisions with sample or custom input.</p></div>
      <Link className="button secondary small" to={`/questions/${question.slug}`}><ArrowLeft size={15} /> Back to problem</Link>
    </div>

    <div className="visualizer-columns">
      <div className="visualizer-main">
        <section className="content-panel visualizer-input-panel">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">01 · TEST INPUT</span><h3>Choose input to visualize</h3></div><span className="sample-badge">{isSample ? "Sample input" : "Custom input"}</span></div>
          <form onSubmit={visualize}>
            <label className="visualizer-input-label" htmlFor="search-visualizer-input">Input format</label>
            <p className="visualizer-hint">{question.inputDescription || "Enter input in the format described for this problem."}</p>
            <textarea id="search-visualizer-input" className="visualizer-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" />
            {error && <p className="form-alert" role="alert">{error}</p>}
            <div className="visualizer-input-actions"><span>Custom input is processed locally in this browser.</span><button className="button primary small" type="submit">Visualize input <ArrowRight size={15} /></button></div>
          </form>
        </section>

        <section className="content-panel visualization-stage" aria-live="polite">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">02 · SEARCH WALKTHROUGH</span><h3>Follow the comparisons</h3></div><span className="step-count">{frames.length ? `Step ${step + 1} of ${frames.length}` : "No steps"}</span></div>
          {frame ? <>
            <p className="frame-message">{frame.message}</p>
            {frame.array.length > 0 && <ArrayView values={frame.array} active={frame.active} left={frame.left} right={frame.right} mid={frame.mid} label="Search values" />}
            {frame.secondArray.length > 0 && <ArrayView values={frame.secondArray} active={frame.active} left={frame.left} right={frame.right} mid={frame.mid} label="Second sorted array" />}
            {frame.matrix && <MatrixView matrix={frame.matrix} active={frame.active} />}
            {Object.keys(frame.variables).length > 0 && <div className="variable-list">{Object.entries(frame.variables).map(([name, value]) => <div className="variable-chip" key={name}><span>{name}</span><b>{String(value)}</b></div>)}</div>}
            <div className="step-controls">
              <button type="button" className="icon-button" onClick={restart} aria-label="Restart visualization" title="Restart"><SkipBack size={18} /></button>
              <button type="button" className="icon-button" onClick={() => { setPlaying(false); setStep((current) => Math.max(current - 1, 0)); }} disabled={step === 0} aria-label="Previous step" title="Previous step"><ArrowLeft size={18} /></button>
              <button type="button" className="button primary small play-control" onClick={() => step === frames.length - 1 ? restart() : setPlaying(!playing)} disabled={frames.length < 2}>{playing ? <><Pause size={15} /> Pause</> : step === frames.length - 1 ? <><RotateCcw size={15} /> Replay</> : <><Play size={15} /> Play</>}</button>
              <button type="button" className="icon-button" onClick={() => { setPlaying(false); setStep((current) => Math.min(current + 1, frames.length - 1)); }} disabled={step >= frames.length - 1} aria-label="Next step" title="Next step"><ArrowRight size={18} /></button>
              <button type="button" className="icon-button" onClick={() => { setPlaying(false); setStep(frames.length - 1); }} aria-label="Skip to result" title="Skip to result"><SkipForward size={18} /></button>
              <span className="step-progress"><span style={{ width: `${frames.length ? ((step + 1) / frames.length) * 100 : 0}%` }} /></span>
            </div>
            {frame.result !== null && <div className="visualizer-result"><span>Result</span><code>{frame.result}</code></div>}
          </> : <p className="visualizer-hint">Enter valid input above to start the visualization.</p>}
        </section>
      </div>

      <aside className="visualizer-side">
        <section className="content-panel code-panel">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">03 · REFERENCE CODE</span><h3>Search solution</h3></div></div>
          <div className="language-tabs" role="tablist" aria-label="Programming language">
            {LANGUAGES.map((item) => <button type="button" role="tab" aria-selected={language === item.id} className={language === item.id ? "active" : ""} key={item.id} onClick={() => setLanguage(item.id)}>{item.label}</button>)}
          </div>
          <pre className="reference-code"><code>{code || "Reference solution is not available yet."}</code></pre>
          <p className="code-disclaimer">Reference methods are for learning and are not compiled or executed here.</p>
        </section>
        <section className="content-panel visualizer-note"><span className="section-eyebrow">04 · VISUALIZATION GUIDE</span><p>{question.visualizationGuide}</p><p>Custom arrays and matrices are size-limited to keep playback responsive.</p><Link className="text-link" to={`/questions/${question.slug}`}>Review problem details <ArrowRight size={14} /></Link></section>
      </aside>
    </div>
  </div>;
}
