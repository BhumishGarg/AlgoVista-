import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Code2, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Link } from "react-router-dom";
import { buildSortingTrace } from "./sortingAlgorithms.js";
import { getSortingReferenceCode } from "./sortingReferenceCode.js";

const LANGUAGES = [
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
];

function sampleInput(question) {
  return question.examples?.[0]?.input || "";
}

function ArrayRow({ values, active, label }) {
  return <section className="sorting-structure">
    <b>{label}</b>
    {values.length ? <div className="sorting-cells">
      {values.map((value, index) => <div className={`sorting-cell ${active.includes(index) ? "sorting-cell-active" : ""}`} key={`${index}-${JSON.stringify(value)}`}>
        <small>{index}</small><strong>{Array.isArray(value) ? `[${value.join(", ")}]` : String(value)}</strong>
      </div>)}
    </div> : <span className="stack-empty">empty</span>}
  </section>;
}

export default function SortingVisualization({ question }) {
  const initialInput = sampleInput(question);
  const [input, setInput] = useState(initialInput);
  const [language, setLanguage] = useState("java");
  const [frames, setFrames] = useState(() => buildSortingTrace(question.slug, initialInput).frames);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const frame = frames[step];
  const code = useMemo(() => getSortingReferenceCode(question.slug, language), [question.slug, language]);
  const isSample = input.trim() === initialInput.trim();

  useEffect(() => {
    setInput(sampleInput(question));
    setPlaying(false);
    setError("");
    try {
      setFrames(buildSortingTrace(question.slug, sampleInput(question)).frames);
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
    const timer = window.setTimeout(() => setStep((current) => Math.min(current + 1, frames.length - 1)), 700);
    return () => window.clearTimeout(timer);
  }, [playing, step, frames.length]);

  function visualize(event) {
    event.preventDefault();
    setPlaying(false);
    setError("");
    try {
      setFrames(buildSortingTrace(question.slug, input).frames);
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
    <div className="breadcrumbs"><Link to="/topics/sorting">Sorting</Link><span>/</span><span>{question.title}</span><span>/</span><span>Visualization</span></div>
    <div className="visualizer-intro">
      <div><span className="section-eyebrow"><Code2 size={14} /> SORTING LEARNING WORKSPACE</span><h2>{question.title}</h2><p>Explore how comparisons, groupings, and rearrangements produce the final order.</p></div>
      <Link className="button secondary small" to={`/questions/${question.slug}`}><ArrowLeft size={15} /> Back to problem</Link>
    </div>

    <div className="visualizer-columns">
      <div className="visualizer-main">
        <section className="content-panel visualizer-input-panel">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">01 · TEST INPUT</span><h3>Choose input to visualize</h3></div><span className="sample-badge">{isSample ? "Sample input" : "Custom input"}</span></div>
          <form onSubmit={visualize}>
            <label className="visualizer-input-label" htmlFor="sorting-visualizer-input">Input format</label>
            <p className="visualizer-hint">{question.inputDescription || "Enter input in the format described for this problem."}</p>
            <textarea id="sorting-visualizer-input" className="visualizer-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" />
            {error && <p className="form-alert" role="alert">{error}</p>}
            <div className="visualizer-input-actions"><span>Custom input is processed locally; arrays are size-limited for playback.</span><button className="button primary small" type="submit">Visualize input <ArrowRight size={15} /></button></div>
          </form>
        </section>

        <section className="content-panel visualization-stage" aria-live="polite">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">02 · SORT WALKTHROUGH</span><h3>Follow the rearrangement</h3></div><span className="step-count">{frames.length ? `Step ${step + 1} of ${frames.length}` : "No steps"}</span></div>
          {frame ? <>
            <p className="frame-message">{frame.message}</p>
            <ArrayRow values={frame.array} active={frame.active} label="Current values" />
            {frame.auxiliary.length > 0 && <ArrayRow values={frame.auxiliary} active={[]} label="Sorted / auxiliary values" />}
            {Object.keys(frame.variables).length > 0 && <div className="variable-list">{Object.entries(frame.variables).map(([name, value]) => <div className="variable-chip" key={name}><span>{name}</span><b>{Array.isArray(value) ? JSON.stringify(value) : String(value)}</b></div>)}</div>}
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
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">03 · REFERENCE CODE</span><h3>Sorting solution</h3></div></div>
          <div className="language-tabs" role="tablist" aria-label="Programming language">
            {LANGUAGES.map((item) => <button type="button" role="tab" aria-selected={language === item.id} className={language === item.id ? "active" : ""} key={item.id} onClick={() => setLanguage(item.id)}>{item.label}</button>)}
          </div>
          <pre className="reference-code"><code>{code || "Reference solution is not available yet."}</code></pre>
          <p className="code-disclaimer">Reference methods are for learning and are not compiled or executed here.</p>
        </section>
        <section className="content-panel visualizer-note"><span className="section-eyebrow">04 · VISUALIZATION GUIDE</span><p>{question.visualizationGuide}</p><p>Custom inputs are limited to keep browser playback responsive.</p><Link className="text-link" to={`/questions/${question.slug}`}>Review problem details <ArrowRight size={14} /></Link></section>
      </aside>
    </div>
  </div>;
}
