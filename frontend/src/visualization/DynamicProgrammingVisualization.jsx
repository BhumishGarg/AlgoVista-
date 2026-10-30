import { useState } from "react";
import { ArrowLeft, ArrowRight, Code2, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { getDynamicProgrammingCode, buildDynamicProgrammingFrames } from "./dynamicProgrammingAlgorithms.js";

const LANGUAGES = [["java", "Java"], ["python", "Python"], ["cpp", "C++"]];

function createWalkthrough(question, input) {
  try {
    return { frames: buildDynamicProgrammingFrames(question, input), error: "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "The input could not be visualized.";
    return {
      frames: [{ title: "Input needed", message, states: [], result: null }],
      error: message,
    };
  }
}

export default function DynamicProgrammingVisualization({ question }) {
  const sample = question.examples?.[0]?.input || "";
  const [input, setInput] = useState(sample);
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState("java");
  const [walkthrough, setWalkthrough] = useState(() => createWalkthrough(question, sample));
  const [error, setError] = useState(walkthrough.error);
  const { frames } = walkthrough;
  const frame = frames[Math.min(step, frames.length - 1)];
  const code = getDynamicProgrammingCode(question.slug, language);
  function visualize(e) {
    e.preventDefault();
    const nextWalkthrough = createWalkthrough(question, input);
    if (nextWalkthrough.error) {
      setError(nextWalkthrough.error);
      setStep(0);
      return;
    }
    setWalkthrough(nextWalkthrough);
    setError("");
    setStep(0);
  }
  return <div className="visualizer-page dp-visualizer">
    <div className="breadcrumbs"><Link to="/topics/dynamic-programming">Dynamic Programming</Link><span>/</span><span>{question.title}</span><span>/</span><span>Visualization</span></div>
    <div className="visualizer-intro"><div><span className="section-eyebrow"><Code2 size={14} /> DYNAMIC PROGRAMMING WORKSPACE</span><h2>{question.title}</h2><p>Follow the state transitions, then compare the implementation in your preferred language.</p></div><Link className="button secondary small" to={`/questions/${question.slug}`}><ArrowLeft size={15} /> Back to problem</Link></div>
    <div className="visualizer-columns"><div className="visualizer-main">
      <section className="content-panel visualizer-input-panel"><div className="visualizer-section-heading"><div><span className="section-eyebrow">01 · TEST INPUT</span><h3>Choose an input</h3></div></div><form onSubmit={visualize}><p className="visualizer-hint">{question.inputDescription}</p><textarea className="visualizer-input" value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} spellCheck="false" aria-label="Dynamic programming input" />{error && <p className="form-alert" role="alert">{error}</p>}<div className="visualizer-input-actions"><span>Use the sample or edit the input using the displayed format.</span><button className="button primary small">Visualize <ArrowRight size={15} /></button></div></form></section>
      <section className="content-panel visualization-stage"><div className="visualizer-section-heading"><div><span className="section-eyebrow">02 · DP STATE</span><h3>{frame.title}</h3></div><span className="step-count">Step {step + 1} of {frames.length}</span></div><p className="frame-message">{frame.message}</p><div className="dp-state-grid">{frame.states.map((state, index) => <div className={`dp-state ${state.active ? "active" : ""} ${state.done ? "done" : ""}`} key={`${state.label}-${index}`}><small>{state.label}</small><b>{state.value}</b><span>{state.note}</span></div>)}</div>{frame.result !== null && <div className="visualizer-result"><span>Result</span><code>{frame.result}</code></div>}<div className="step-controls"><button className="icon-button" onClick={() => setStep(0)} title="Restart"><RotateCcw size={17} /></button><button className="button secondary small" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Previous</button><button className="button primary small" onClick={() => setStep(Math.min(frames.length - 1, step + 1))} disabled={step === frames.length - 1}>Next <ArrowRight size={15} /></button></div></section>
    </div><aside className="visualizer-side"><section className="content-panel code-panel"><span className="section-eyebrow">03 · REFERENCE CODE</span><h3>Optimized solution</h3><div className="language-tabs">{LANGUAGES.map(([id, label]) => <button key={id} className={language === id ? "active" : ""} onClick={() => setLanguage(id)}>{label}</button>)}</div><pre className="reference-code"><code>{code}</code></pre></section><section className="content-panel visualizer-legend"><span className="section-eyebrow">WHAT TO NOTICE</span><p>{question.visualizationGuide}</p></section></aside></div>
  </div>;
}
