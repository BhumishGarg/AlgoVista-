import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Code2, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Link } from "react-router-dom";
import { buildQueueTrace } from "./queueAlgorithms.js";
import { getQueueReferenceCode } from "./queueReferenceCode.js";

const LANGUAGES = [
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
];

function sampleInput(question) {
  return question.examples?.[0]?.input || "";
}

function Structure({ structure, markers }) {
  if (structure.kind === "stack") {
    return <section className="stack-track queue-stack-track">
      <div className="stack-track-heading"><b>{structure.label}</b><span>{structure.values.length} item{structure.values.length === 1 ? "" : "s"}</span></div>
      <div className="stack-cells" aria-label={`${structure.label}, top at top`}>
        {structure.values.length ? [...structure.values].reverse().map((value, index) => <div className={`stack-cell ${index === 0 ? "stack-cell-top" : ""}`} key={`${index}-${value}`}>
          {index === 0 && <span className="stack-top-label">TOP</span>}<strong>{String(value)}</strong>
        </div>) : <span className="stack-empty">empty</span>}
      </div>
    </section>;
  }
  return <section className="queue-track">
    <div className="queue-track-heading"><b>{structure.label}</b><span>{structure.values.length} item{structure.values.length === 1 ? "" : "s"}</span></div>
    <div className={`queue-cells ${structure.kind === "array" ? "queue-array-cells" : ""}`} aria-label={structure.label}>
      {structure.values.length ? structure.values.map((value, index) => <div className={`queue-cell ${value === null || value === undefined || value === "·" ? "queue-placeholder" : ""}`} key={`${index}-${value}`}>
        {structure.kind === "array" && <small>{index}</small>}
        {value == null ? "·" : String(value)}
        {markers?.front === index && <span className="queue-marker queue-front-marker">FRONT</span>}
        {markers?.rear === index && <span className="queue-marker queue-rear-marker">REAR</span>}
      </div>) : <span className="stack-empty">empty</span>}
    </div>
  </section>;
}

function Grid({ values, mode }) {
  if (!values) return null;
  return <section className="queue-grid-panel">
    <b>{mode === "oranges" ? "Grid · minute-by-minute spread" : "Grid · blocked, visited, and open cells"}</b>
    <div className="queue-grid">
      {values.flatMap((row, r) => row.map((value, c) => {
        const state = mode === "oranges"
          ? value === 2 ? "rotten" : value === 1 ? "fresh" : "empty"
          : value === 1 ? "blocked" : value === 2 ? "visited" : "open";
        const label = mode === "oranges"
          ? value === 2 ? "Rotten orange" : value === 1 ? "Fresh orange" : "Empty"
          : value === 1 ? "Blocked" : value === 2 ? "Visited" : "Open";
        return <div className={`queue-grid-cell ${state}`} key={`${r}-${c}`} title={`${label} at row ${r}, column ${c}`} aria-label={`${label}, row ${r}, column ${c}`}>{mode === "oranges" ? value === 2 ? "●" : value === 1 ? "○" : "·" : value === 1 ? "■" : value === 2 ? "✓" : "·"}</div>;
      }))}
    </div>
    <div className="queue-grid-legend"><span><i className={mode === "oranges" ? "fresh" : "open"} />{mode === "oranges" ? "Fresh" : "Open"}</span><span><i className={mode === "oranges" ? "rotten" : "visited"} />{mode === "oranges" ? "Rotten" : "Visited"}</span><span><i className={mode === "oranges" ? "empty" : "blocked"} />{mode === "oranges" ? "Empty" : "Blocked"}</span></div>
  </section>;
}

export default function QueueVisualization({ question }) {
  const [input, setInput] = useState(() => sampleInput(question));
  const [language, setLanguage] = useState("java");
  const [frames, setFrames] = useState(() => buildQueueTrace(question.slug, sampleInput(question)));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const frame = frames[step];
  const code = useMemo(() => getQueueReferenceCode(question.slug, language), [question.slug, language]);
  const isSample = input.trim() === sampleInput(question).trim();
  const sampleKey = sampleInput(question);

  useEffect(() => {
    setInput(sampleInput(question));
    setPlaying(false);
    setError("");
    try {
      setFrames(buildQueueTrace(question.slug, sampleInput(question)));
      setStep(0);
    } catch (traceError) {
      setFrames([]);
      setStep(0);
      setError(traceError.message);
    }
  }, [question.slug, sampleKey]);

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
      setFrames(buildQueueTrace(question.slug, input));
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
    <div className="breadcrumbs"><Link to="/topics/queues">Queues</Link><span>/</span><span>{question.title}</span><span>/</span><span>Visualization</span></div>
    <div className="visualizer-intro">
      <div><span className="section-eyebrow"><Code2 size={14} /> QUEUE LEARNING WORKSPACE</span><h2>{question.title}</h2><p>Explore the queue, deque, or BFS frontier step by step, then try your own input.</p></div>
      <Link className="button secondary small" to={`/questions/${question.slug}`}><ArrowLeft size={15} /> Back to problem</Link>
    </div>

    <div className="visualizer-columns">
      <div className="visualizer-main">
        <section className="content-panel visualizer-input-panel">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">01 · TEST INPUT</span><h3>Choose input to visualize</h3></div><span className="sample-badge">{isSample ? "Sample input" : "Custom input"}</span></div>
          <form onSubmit={visualize}>
            <label className="visualizer-input-label" htmlFor="queue-visualizer-input">Input format</label>
            <p className="visualizer-hint">{question.inputDescription || "Enter input in the format described for this problem."}</p>
            <textarea id="queue-visualizer-input" className="visualizer-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" />
            {error && <p className="form-alert" role="alert">{error}</p>}
            <div className="visualizer-input-actions"><span>Sample input is loaded by default. Custom input is processed in this browser.</span><button className="button primary small" type="submit">Visualize input <ArrowRight size={15} /></button></div>
          </form>
        </section>

        <section className="content-panel visualization-stage" aria-live="polite">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">02 · QUEUE WALKTHROUGH</span><h3>Follow each operation</h3></div><span className="step-count">{frames.length ? `Step ${step + 1} of ${frames.length}` : "No steps"}</span></div>
          {frame ? <>
            <p className="frame-message">{frame.message}</p>
            {frame.grid && <Grid values={frame.grid} mode={frame.gridMode} />}
            <div className="queue-visualization">
              {frame.structures.map((structure, index) => <Structure key={`${structure.label}-${index}`} structure={structure} markers={frame.markers} />)}
            </div>
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
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">03 · REFERENCE CODE</span><h3>Queue solution</h3></div></div>
          <div className="language-tabs" role="tablist" aria-label="Programming language">
            {LANGUAGES.map((item) => <button type="button" role="tab" aria-selected={language === item.id} className={language === item.id ? "active" : ""} key={item.id} onClick={() => setLanguage(item.id)}>{item.label}</button>)}
          </div>
          <pre className="reference-code"><code>{code || "Reference solution is not available yet."}</code></pre>
          <p className="code-disclaimer">Reference methods are for learning and are not compiled or executed here.</p>
        </section>
        <section className="content-panel visualizer-note"><span className="section-eyebrow">HOW TO USE</span><p>Step through the sample or edit the input to explore queue operations, circular buffers, monotonic deques, and breadth-first search.</p><Link className="text-link" to={`/questions/${question.slug}`}>Review problem details <ArrowRight size={14} /></Link></section>
      </aside>
    </div>
  </div>;
}
