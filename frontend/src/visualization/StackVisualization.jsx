import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Code2, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Link } from "react-router-dom";
import { buildStackTrace, getStackReferenceCode } from "./stackAlgorithms.js";

const LANGUAGES = [
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
];

function sampleInput(question) {
  return question.examples?.[0]?.input || "";
}

export default function StackVisualization({ question }) {
  const [input, setInput] = useState(() => sampleInput(question));
  const [language, setLanguage] = useState("java");
  const [frames, setFrames] = useState(() => buildStackTrace(question.slug, sampleInput(question)));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const frame = frames[step];
  const code = useMemo(() => getStackReferenceCode(question.slug, language), [question.slug, language]);
  const isSample = input.trim() === sampleInput(question).trim();
  const sampleKey = sampleInput(question);

  useEffect(() => {
    setInput(sampleInput(question));
    setPlaying(false);
    setError("");
    try {
      setFrames(buildStackTrace(question.slug, sampleInput(question)));
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
      setFrames(buildStackTrace(question.slug, input));
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
    <div className="breadcrumbs"><Link to="/topics/stacks">Stacks</Link><span>/</span><span>{question.title}</span><span>/</span><span>Visualization</span></div>
    <div className="visualizer-intro">
      <div><span className="section-eyebrow"><Code2 size={14} /> STACK LEARNING WORKSPACE</span><h2>{question.title}</h2><p>Watch values move through the stack, then step through the sample or your own input.</p></div>
      <Link className="button secondary small" to={`/questions/${question.slug}`}><ArrowLeft size={15} /> Back to problem</Link>
    </div>

    <div className="visualizer-columns">
      <div className="visualizer-main">
        <section className="content-panel visualizer-input-panel">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">01 · TEST INPUT</span><h3>Choose input to visualize</h3></div><span className="sample-badge">{isSample ? "Sample input" : "Custom input"}</span></div>
          <form onSubmit={visualize}>
            <label className="visualizer-input-label" htmlFor="stack-visualizer-input">Input format</label>
            <p className="visualizer-hint">{question.inputDescription || "Enter input in the format described for this problem."}</p>
            <textarea id="stack-visualizer-input" className="visualizer-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" />
            {error && <p className="form-alert" role="alert">{error}</p>}
            <div className="visualizer-input-actions"><span>Sample input is loaded by default. Custom input is processed in this browser.</span><button className="button primary small" type="submit">Visualize input <ArrowRight size={15} /></button></div>
          </form>
        </section>

        <section className="content-panel visualization-stage" aria-live="polite">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">02 · STACK WALKTHROUGH</span><h3>Follow each operation</h3></div><span className="step-count">{frames.length ? `Step ${step + 1} of ${frames.length}` : "No steps"}</span></div>
          {frame ? <>
            <p className="frame-message">{frame.message}</p>
            <div className="stack-visualization">
              {frame.stacks.map((stack, stackIndex) => <section className="stack-track" key={`${stack.label}-${stackIndex}`}>
                <div className="stack-track-heading"><b>{stack.label}</b><span>{stack.values.length} item{stack.values.length === 1 ? "" : "s"}</span></div>
                <div className="stack-cells" aria-label={`${stack.label}, top at top`}>
                  {stack.values.length ? [...stack.values].reverse().map((value, index) => <div className={`stack-cell ${index === 0 ? "stack-cell-top" : ""}`} key={`${stack.label}-${index}-${value}`}>
                    {index === 0 && <span className="stack-top-label">TOP</span>}
                    <strong>{String(value)}</strong>
                  </div>) : <span className="stack-empty">empty</span>}
                </div>
              </section>)}
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
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">03 · REFERENCE CODE</span><h3>Stack solution</h3></div></div>
          <div className="language-tabs" role="tablist" aria-label="Programming language">
            {LANGUAGES.map((item) => <button type="button" role="tab" aria-selected={language === item.id} className={language === item.id ? "active" : ""} key={item.id} onClick={() => setLanguage(item.id)}>{item.label}</button>)}
          </div>
          <pre className="reference-code"><code>{code || "Reference solution is not available yet."}</code></pre>
          <p className="code-disclaimer">Reference methods are for learning and are not compiled or executed here. The browser visualizer runs its own matching walkthrough.</p>
        </section>
        <section className="content-panel visualizer-legend">
          <span className="section-eyebrow">HOW TO READ THIS</span>
          <h3>Stack symbols</h3>
          <p><i className="legend-symbol">TOP</i> Next item to be read or removed</p>
          <p><i className="legend-symbol">↓</i> Items below remain in the stack</p>
          <p><i className="legend-dot legend-active" /> The highlighted top value changes as operations run</p>
          {question.approaches?.[0] && <div className="visualization-guide"><b>What to notice</b><br />{question.approaches[0].steps.join(" ")}</div>}
        </section>
      </aside>
    </div>
    <p className="visualizer-safety-note">Stack operations are simulated locally in your browser. Inputs and playback steps are capped to keep the workspace responsive.</p>
  </div>;
}
