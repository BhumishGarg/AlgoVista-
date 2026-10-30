import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Code2, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Link } from "react-router-dom";
import { buildArrayTrace, getArrayReferenceCode } from "./arrayAlgorithms.js";

const LANGUAGES = [
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
];

function initialInput(question) {
  return question.examples?.[0]?.input || "";
}

export default function ArrayVisualization({ question }) {
  const [input, setInput] = useState(() => initialInput(question));
  const [language, setLanguage] = useState("java");
  const [frames, setFrames] = useState(() => buildArrayTrace(question.slug, initialInput(question)));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const sampleLoaded = input.trim() === initialInput(question).trim();
  const frame = frames[step];
  const code = useMemo(() => getArrayReferenceCode(question.slug, language), [question.slug, language]);

  useEffect(() => {
    setPlaying(false);
    setInput(initialInput(question));
    setError("");
    try {
      setFrames(buildArrayTrace(question.slug, initialInput(question)));
      setStep(0);
    } catch (traceError) {
      setFrames([]);
      setError(traceError.message);
    }
  }, [question.slug]);

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
      const nextFrames = buildArrayTrace(question.slug, input);
      setFrames(nextFrames);
      setStep(0);
    } catch (traceError) {
      setError(traceError.message);
    }
  }

  function reset() {
    setPlaying(false);
    setStep(0);
  }

  return <div className="visualizer-page">
    <div className="breadcrumbs"><span>Arrays</span><span>/</span><span>{question.title}</span><span>/</span><span>Visualization</span></div>
    <div className="visualizer-intro">
      <div><span className="section-eyebrow"><Code2 size={14} /> ARRAY LEARNING WORKSPACE</span><h2>{question.title}</h2><p>Explore the reference solution, then step through the algorithm with the sample or your own input.</p></div>
      <Link className="button secondary small" to={`/questions/${question.slug}`}><ArrowLeft size={15} /> Back to problem</Link>
    </div>

    <div className="visualizer-columns">
      <div className="visualizer-main">
        <section className="content-panel visualizer-input-panel">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">01 · TEST INPUT</span><h3>Choose an input to visualize</h3></div><span className="sample-badge">{sampleLoaded ? "Sample input" : "Custom input"}</span></div>
          <form onSubmit={visualize}>
            <label className="visualizer-input-label" htmlFor="visualizer-input">Input format</label>
            <p className="visualizer-hint">{question.inputDescription || "Enter values separated by spaces or new lines, following the problem's input format."}</p>
            <textarea id="visualizer-input" className="visualizer-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" />
            {error && <p className="form-alert" role="alert">{error}</p>}
            <div className="visualizer-input-actions"><span>Sample input is loaded by default. Your input stays in this browser.</span><button className="button primary small" type="submit">Visualize input <ArrowRight size={15} /></button></div>
          </form>
        </section>

        <section className="content-panel visualization-stage" aria-live="polite">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">02 · ALGORITHM STEPS</span><h3>Watch the algorithm work</h3></div><span className="step-count">{frames.length ? `Step ${step + 1} of ${frames.length}` : "No steps"}</span></div>
          {frame ? <>
            <p className="frame-message">{frame.message}</p>
            <div className={`array-visualization ${frame.kind === "bars" ? "bar-visualization" : ""}`}>
              {frame.arrays.map((array) => {
                const maxBar = Math.max(1, ...array.values.map((value) => Number(value) || 0));
                return <div className="array-track" key={array.label}>
                <span className="array-track-label">{array.label}</span>
                <div className="array-cells">{array.values.map((value, index) => {
                  const tags = frame.marks[index] || [];
                  return <div className={`array-cell ${tags.map((tag) => `cell-${tag.role}`).join(" ")}`} key={`${array.label}-${index}`} title={tags.map((tag) => tag.label).join(", ") || `Index ${index}`}>
                    {frame.kind === "bars" && <span className="bar-fill" style={{ height: `${Math.max(18, Math.min(145, 20 + ((Number(value) || 0) / maxBar) * 110))}px` }} />}
                    {frame.kind === "bars" && <span className="bar-value">{value}</span>}
                    <strong>{value}</strong><small>{index}</small>
                    {tags.length > 0 && <span className="cell-tags">{tags.map((tag) => tag.label).join(" · ")}</span>}
                  </div>;
                })}</div>
              </div>;
              })}
              {frame.extras.map((item) => <p className="visualizer-extra" key={item}>{item}</p>)}
            </div>
            {Object.keys(frame.variables).length > 0 && <div className="variable-list">{Object.entries(frame.variables).map(([name, value]) => <div className="variable-chip" key={name}><span>{name}</span><b>{String(value)}</b></div>)}</div>}
            <div className="step-controls">
              <button type="button" className="icon-button" onClick={reset} aria-label="Restart visualization" title="Restart"><SkipBack size={18} /></button>
              <button type="button" className="icon-button" onClick={() => { setPlaying(false); setStep((current) => Math.max(current - 1, 0)); }} disabled={step === 0} aria-label="Previous step" title="Previous step"><ArrowLeft size={18} /></button>
              <button type="button" className="button primary small play-control" onClick={() => step === frames.length - 1 ? reset() : setPlaying(!playing)} disabled={frames.length < 2}>{playing ? <><Pause size={15} /> Pause</> : step === frames.length - 1 ? <><RotateCcw size={15} /> Replay</> : <><Play size={15} /> Play</>}</button>
              <button type="button" className="icon-button" onClick={() => { setPlaying(false); setStep((current) => Math.min(current + 1, frames.length - 1)); }} disabled={step >= frames.length - 1} aria-label="Next step" title="Next step"><ArrowRight size={18} /></button>
              <button type="button" className="icon-button" onClick={() => { setPlaying(false); setStep(frames.length - 1); }} aria-label="Skip to result" title="Skip to result"><SkipForward size={18} /></button>
              <span className="step-progress"><span style={{ width: `${frames.length ? ((step + 1) / frames.length) * 100 : 0}%` }} /></span>
            </div>
            {frame.result !== null && <div className="visualizer-result"><span>Result</span><code>{frame.result}</code></div>}
          </> : <p className="visualizer-hint">Enter a valid input above to start the visualization.</p>}
        </section>
      </div>

      <aside className="visualizer-side">
        <section className="content-panel code-panel">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">03 · REFERENCE CODE</span><h3>Optimized solution</h3></div></div>
          <div className="language-tabs" role="tablist" aria-label="Programming language">
            {LANGUAGES.map((item) => <button type="button" role="tab" aria-selected={language === item.id} className={language === item.id ? "active" : ""} key={item.id} onClick={() => setLanguage(item.id)}>{item.label}</button>)}
          </div>
          <pre className="reference-code"><code>{code || "Reference solution is not available for this problem yet."}</code></pre>
          <p className="code-disclaimer">Reference code is shown for learning and is not compiled or executed. Java and C++ snippets are solution methods; standard-library imports are omitted. The browser visualizer runs its own matching algorithm.</p>
        </section>
        <section className="content-panel visualizer-legend">
          <span className="section-eyebrow">HOW TO READ THIS</span>
          <h3>Visual markers</h3>
          <p><i className="legend-dot legend-active" /> Current value or pointer</p>
          <p><i className="legend-dot legend-write" /> Write, second pointer, or updated value</p>
          <p><i className="legend-dot legend-success" /> Match or completed region</p>
          <p><i className="legend-dot legend-muted" /> Skipped value</p>
          {question.visualizationGuide && <div className="visualization-guide"><b>What to notice</b><br />{question.visualizationGuide}</div>}
        </section>
      </aside>
    </div>
    <p className="visualizer-safety-note">Custom inputs are processed locally in your browser. Keep the input within the displayed constraints; large inputs are capped to keep playback responsive.</p>
  </div>;
}
