import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Code2, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Link } from "react-router-dom";
import { buildLinkedListTrace, getLinkedListReferenceCode } from "./linkedListAlgorithms.js";

const LANGUAGES = [
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
];

function sampleInput(question) {
  return question.examples?.[0]?.input || "";
}

function pointersForList(pointers, label, listIndex, nodeIndex) {
  const track = label.toLowerCase();
  return Object.entries(pointers)
    .filter(([name, index]) => {
      if (index !== nodeIndex) return false;
      const pointer = name.toLowerCase();
      if (track === "list" || track === "next links") return true;
      if (track.includes("number a") || track === "list a") return ["a", "p"].includes(pointer);
      if (track.includes("number b") || track === "list b") return ["b", "q"].includes(pointer);
      if (track.startsWith("list ")) return pointer === `l${listIndex + 1}`;
      if (track === "original nodes") return pointer === "original";
      if (track === "copied nodes") return pointer === "copy";
      if (track === "unprocessed" || track === "input") return ["current", "slow", "fast", "left", "right", "head", "tail"].includes(pointer);
      if (track === "reversed" || track === "reversed list") return ["previoushead", "prev", "previous", "head", "result"].includes(pointer);
      if (track === "first half") return pointer === "first";
      if (track === "reversed second half") return pointer === "second";
      if (["merged", "sum", "result", "unique result", "reordered"].includes(track)) return pointer === "result";
      return false;
    })
    .map(([name]) => name);
}

export default function LinkedListVisualization({ question }) {
  const [input, setInput] = useState(() => sampleInput(question));
  const [language, setLanguage] = useState("java");
  const [frames, setFrames] = useState(() => buildLinkedListTrace(question.slug, sampleInput(question)));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const currentFrame = frames[step];
  const code = useMemo(() => getLinkedListReferenceCode(question.slug, language), [question.slug, language]);
  const isSample = input.trim() === sampleInput(question).trim();
  const sampleKey = sampleInput(question);

  useEffect(() => {
    setInput(sampleInput(question));
    setPlaying(false);
    setError("");
    try {
      setFrames(buildLinkedListTrace(question.slug, sampleInput(question)));
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
    const timer = window.setTimeout(() => setStep((current) => Math.min(current + 1, frames.length - 1)), 900);
    return () => window.clearTimeout(timer);
  }, [playing, step, frames.length]);

  function visualize(event) {
    event.preventDefault();
    setPlaying(false);
    setError("");
    try {
      setFrames(buildLinkedListTrace(question.slug, input));
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
    <div className="breadcrumbs"><Link to="/topics/linked-lists">Linked Lists</Link><span>/</span><span>{question.title}</span><span>/</span><span>Visualization</span></div>
    <div className="visualizer-intro">
      <div><span className="section-eyebrow"><Code2 size={14} /> LINKED LIST LEARNING WORKSPACE</span><h2>{question.title}</h2><p>Inspect node links and pointers, then step through the sample or your own input.</p></div>
      <Link className="button secondary small" to={`/questions/${question.slug}`}><ArrowLeft size={15} /> Back to problem</Link>
    </div>

    <div className="visualizer-columns">
      <div className="visualizer-main">
        <section className="content-panel visualizer-input-panel">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">01 · TEST INPUT</span><h3>Build the linked list</h3></div><span className="sample-badge">{isSample ? "Sample input" : "Custom input"}</span></div>
          <form onSubmit={visualize}>
            <label className="visualizer-input-label" htmlFor="linked-list-input">Input format</label>
            <p className="visualizer-hint">{question.inputDescription || "Enter the node values using the format described in this problem."}</p>
            <textarea id="linked-list-input" className="visualizer-input linked-list-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" />
            {error && <p className="form-alert" role="alert">{error}</p>}
            <div className="visualizer-input-actions"><span>Sample input is loaded by default. Custom input is processed in this browser.</span><button className="button primary small" type="submit">Build &amp; visualize <ArrowRight size={15} /></button></div>
          </form>
        </section>

        <section className="content-panel visualization-stage" aria-live="polite">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">02 · POINTER WALKTHROUGH</span><h3>Follow the links</h3></div><span className="step-count">{frames.length ? `Step ${step + 1} of ${frames.length}` : "No steps"}</span></div>
          {currentFrame ? <>
            <p className="frame-message">{currentFrame.message}</p>
            <div className="linked-list-diagram">
              {currentFrame.lists.map((list, listIndex) => <div className="linked-list-track" key={`${list.label}-${listIndex}`}>
                <span className="linked-list-label">{list.label}</span>
                <div className="linked-list-nodes">
                  {list.values.length ? list.values.map((value, index) => {
                    const pointerLabels = pointersForList(currentFrame.pointers, list.label, listIndex, index);
                    return <div className="linked-node-group" key={`${list.label}-${index}`}>
                      <div className={`linked-node ${pointerLabels.length ? "linked-node-active" : ""}`}>
                        {pointerLabels.length > 0 && <span className="linked-pointer-label">{pointerLabels.join(" · ")}</span>}
                        <strong>{value}</strong><small>node {index}</small>
                      </div>
                      {index < list.values.length - 1 && <span className="linked-arrow" aria-label="next pointer">→</span>}
                    </div>;
                  }) : <span className="linked-null">null</span>}
                  {list.values.length > 0 && <span className="linked-tail-link">{list.label === "next links" && currentFrame.links.some((link) => link.includes("tail at")) ? "↶ cycle entry" : "→ null"}</span>}
                </div>
              </div>)}
              {currentFrame.randomNodes && <div className="random-link-list"><b>random links</b>{currentFrame.randomNodes.map((node, index) => <span key={index}>node {index} ↗ {node.random === null ? "null" : `node ${node.random}`}</span>)}</div>}
              {currentFrame.links.map((link) => <p className="linked-link-note" key={link}>↶ {link}</p>)}
            </div>
            {Object.keys(currentFrame.variables).length > 0 && <div className="variable-list">{Object.entries(currentFrame.variables).map(([name, value]) => <div className="variable-chip" key={name}><span>{name}</span><b>{String(value)}</b></div>)}</div>}
            <div className="step-controls">
              <button type="button" className="icon-button" onClick={restart} aria-label="Restart visualization" title="Restart"><SkipBack size={18} /></button>
              <button type="button" className="icon-button" onClick={() => { setPlaying(false); setStep((current) => Math.max(current - 1, 0)); }} disabled={step === 0} aria-label="Previous step" title="Previous step"><ArrowLeft size={18} /></button>
              <button type="button" className="button primary small play-control" onClick={() => step === frames.length - 1 ? restart() : setPlaying(!playing)} disabled={frames.length < 2}>{playing ? <><Pause size={15} /> Pause</> : step === frames.length - 1 ? <><RotateCcw size={15} /> Replay</> : <><Play size={15} /> Play</>}</button>
              <button type="button" className="icon-button" onClick={() => { setPlaying(false); setStep((current) => Math.min(current + 1, frames.length - 1)); }} disabled={step >= frames.length - 1} aria-label="Next step" title="Next step"><ArrowRight size={18} /></button>
              <button type="button" className="icon-button" onClick={() => { setPlaying(false); setStep(frames.length - 1); }} aria-label="Skip to result" title="Skip to result"><SkipForward size={18} /></button>
              <span className="step-progress"><span style={{ width: `${frames.length ? ((step + 1) / frames.length) * 100 : 0}%` }} /></span>
            </div>
            {currentFrame.result !== null && <div className="visualizer-result"><span>Result</span><code>{currentFrame.result}</code></div>}
          </> : <p className="visualizer-hint">Enter valid node values above to start the visualization.</p>}
        </section>
      </div>

      <aside className="visualizer-side">
        <section className="content-panel code-panel">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">03 · REFERENCE CODE</span><h3>Linked-list solution</h3></div></div>
          <div className="language-tabs" role="tablist" aria-label="Programming language">
            {LANGUAGES.map((item) => <button type="button" role="tab" aria-selected={language === item.id} className={language === item.id ? "active" : ""} key={item.id} onClick={() => setLanguage(item.id)}>{item.label}</button>)}
          </div>
          <pre className="reference-code"><code>{code || "Reference solution is not available yet."}</code></pre>
          <p className="code-disclaimer">Reference methods are for learning and are not compiled or executed here. Node definitions and helper methods (such as reverse) are omitted where noted. The browser visualizer runs its own matching walkthrough.</p>
        </section>
        <section className="content-panel visualizer-legend">
          <span className="section-eyebrow">HOW TO READ THIS</span>
          <h3>Pointer symbols</h3>
          <p><i className="legend-symbol">→</i> next link to the following node</p>
          <p><i className="legend-symbol">↶</i> cycle, shared-tail, or changing link</p>
          <p><i className="legend-symbol">↗</i> random pointer target</p>
          <p><i className="legend-dot legend-active" /> Current pointer or node</p>
          {question.visualizationGuide && <div className="visualization-guide"><b>What to notice</b><br />{question.visualizationGuide}</div>}
        </section>
      </aside>
    </div>
    <p className="visualizer-safety-note">Custom linked lists are constructed locally in your browser. Inputs are bounded to keep step-by-step playback responsive.</p>
  </div>;
}
