import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Code2, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Link } from "react-router-dom";
import { buildGraphTrace } from "./graphAlgorithms.js";
import { getGraphReferenceCode } from "./graphReferenceCode.js";

const LANGUAGES = [
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
];

function sampleInput(question) {
  return question.examples?.[0]?.input || "";
}

function GraphDiagram({ nodes, edges }) {
  if (!nodes.length) return null;
  const width = 620;
  const height = 380;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width * 0.38, height * 0.38, 145);
  const positions = nodes.map((_, index) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / nodes.length;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  });
  const labels = (label) => {
    const value = String(label);
    return value.length > 12 ? `${value.slice(0, 10)}…` : value;
  };

  return <section className="graph-diagram-panel">
    <b>Graph · nodes and connections</b>
    <div className="graph-diagram-scroll">
      <svg className="graph-diagram" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Graph node and edge visualization">
        <defs><marker id="graph-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
        {edges.map((edge, index) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          const labelX = (from.x + to.x) / 2;
          const labelY = (from.y + to.y) / 2;
          return <g key={`${edge.from}-${edge.to}-${index}`}>
            <line className="graph-edge" x1={from.x} y1={from.y} x2={to.x} y2={to.y} markerEnd={edge.directed ? "url(#graph-arrow)" : undefined} />
            {edge.weight != null && <text className="graph-edge-label" x={labelX} y={labelY - 5}>{edge.weight}</text>}
          </g>;
        })}
        {nodes.map((node, index) => {
          const position = positions[index];
          return <g className={`graph-node graph-node-${node.state}`} key={`${node.id}-${index}`}>
            <title>{String(node.label)}</title>
            <circle cx={position.x} cy={position.y} r="22" />
            <text x={position.x} y={position.y + 4}>{labels(node.label)}</text>
          </g>;
        })}
      </svg>
    </div>
    <div className="graph-legend"><span><i className="graph-legend-default" />Unvisited</span><span><i className="graph-legend-visited" />Visited</span><span><i className="graph-legend-active" />Current / conflict</span></div>
  </section>;
}

function GridDiagram({ grid }) {
  if (!grid) return null;
  const columns = grid[0]?.length || 1;
  return <section className="graph-grid-panel">
    <b>Grid · visited cells and traversal state</b>
    <div className="graph-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(25px, 38px))` }}>
      {grid.flatMap((row, r) => row.map((value, c) => {
        const text = String(value);
        const state = text.includes("✓") || text === "2" ? "graph-grid-visited"
          : text === "X" || text === "0" ? "graph-grid-blocked" : "graph-grid-open";
        return <div className={`graph-grid-cell ${state}`} key={`${r}-${c}`} title={`Row ${r}, column ${c}: ${text}`} aria-label={`Row ${r}, column ${c}: ${text}`}>{text.replace("✓", "")}</div>;
      }))}
    </div>
  </section>;
}

export default function GraphVisualization({ question }) {
  const initialInput = sampleInput(question);
  const [input, setInput] = useState(initialInput);
  const [language, setLanguage] = useState("java");
  const [frames, setFrames] = useState(() => buildGraphTrace(question.slug, initialInput).frames);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const frame = frames[step];
  const code = useMemo(() => getGraphReferenceCode(question.slug, language), [question.slug, language]);
  const isSample = input.trim() === initialInput.trim();

  useEffect(() => {
    setInput(sampleInput(question));
    setPlaying(false);
    setError("");
    try {
      setFrames(buildGraphTrace(question.slug, sampleInput(question)).frames);
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
    const timer = window.setTimeout(() => setStep((current) => Math.min(current + 1, frames.length - 1)), 750);
    return () => window.clearTimeout(timer);
  }, [playing, step, frames.length]);

  function visualize(event) {
    event.preventDefault();
    setPlaying(false);
    setError("");
    try {
      setFrames(buildGraphTrace(question.slug, input).frames);
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
    <div className="breadcrumbs"><Link to="/topics/graphs">Graphs</Link><span>/</span><span>{question.title}</span><span>/</span><span>Visualization</span></div>
    <div className="visualizer-intro">
      <div><span className="section-eyebrow"><Code2 size={14} /> GRAPH LEARNING WORKSPACE</span><h2>{question.title}</h2><p>Trace graph traversal, connectivity, and shortest-path state with sample or custom input.</p></div>
      <Link className="button secondary small" to={`/questions/${question.slug}`}><ArrowLeft size={15} /> Back to problem</Link>
    </div>

    <div className="visualizer-columns">
      <div className="visualizer-main">
        <section className="content-panel visualizer-input-panel">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">01 · TEST INPUT</span><h3>Choose input to visualize</h3></div><span className="sample-badge">{isSample ? "Sample input" : "Custom input"}</span></div>
          <form onSubmit={visualize}>
            <label className="visualizer-input-label" htmlFor="graph-visualizer-input">Input format</label>
            <p className="visualizer-hint">{question.inputDescription || "Enter input in the format described for this problem."}</p>
            <textarea id="graph-visualizer-input" className="visualizer-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" />
            {error && <p className="form-alert" role="alert">{error}</p>}
            <div className="visualizer-input-actions"><span>Custom input is processed locally and bounded for browser playback.</span><button className="button primary small" type="submit">Visualize input <ArrowRight size={15} /></button></div>
          </form>
        </section>

        <section className="content-panel visualization-stage" aria-live="polite">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">02 · GRAPH WALKTHROUGH</span><h3>Follow traversal and state</h3></div><span className="step-count">{frames.length ? `Step ${step + 1} of ${frames.length}` : "No steps"}</span></div>
          {frame ? <>
            <p className="frame-message">{frame.message}</p>
            {frame.grid && <GridDiagram grid={frame.grid} />}
            {frame.nodes.length > 0 && <GraphDiagram nodes={frame.nodes} edges={frame.edges} />}
            {frame.structures?.map((structure) => <div className="variable-chip" key={structure.label}><span>{structure.label}</span><b>{JSON.stringify(structure.values)}</b></div>)}
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
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">03 · REFERENCE CODE</span><h3>Graph solution</h3></div></div>
          <div className="language-tabs" role="tablist" aria-label="Programming language">
            {LANGUAGES.map((item) => <button type="button" role="tab" aria-selected={language === item.id} className={language === item.id ? "active" : ""} key={item.id} onClick={() => setLanguage(item.id)}>{item.label}</button>)}
          </div>
          <pre className="reference-code"><code>{code || "Reference solution is not available yet."}</code></pre>
          <p className="code-disclaimer">Reference methods are for learning and are not compiled or executed here.</p>
        </section>
        <section className="content-panel visualizer-note"><span className="section-eyebrow">04 · VISUALIZATION GUIDE</span><p>{question.visualizationGuide}</p><p>Graph sizes and grid dimensions are limited to keep playback responsive.</p><Link className="text-link" to={`/questions/${question.slug}`}>Review problem details <ArrowRight size={14} /></Link></section>
      </aside>
    </div>
  </div>;
}
