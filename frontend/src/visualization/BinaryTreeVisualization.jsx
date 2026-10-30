import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Code2, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Link } from "react-router-dom";
import { buildBinaryTreeTrace } from "./binaryTreeAlgorithms.js";
import { getBinaryTreeReferenceCode } from "./binaryTreeReferenceCode.js";

const LANGUAGES = [
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
];

function sampleInput(question) {
  return question.examples?.[0]?.input || "";
}

function treePositions(root) {
  if (!root) return { nodes: [], edges: [], width: 420, height: 110 };
  const ordered = [];
  const depths = new Map();
  function visit(node, depth) {
    if (!node) return;
    depths.set(node.id, depth);
    visit(node.left, depth + 1);
    ordered.push(node);
    visit(node.right, depth + 1);
  }
  visit(root, 0);
  const width = Math.max(420, ordered.length * 74);
  const maxDepth = Math.max(...depths.values());
  const height = Math.max(110, (maxDepth + 1) * 82 + 28);
  const positions = new Map(ordered.map((node, index) => [node.id, {
    x: ((index + 1) * width) / (ordered.length + 1),
    y: 36 + depths.get(node.id) * 82,
  }]));
  const nodes = [];
  const edges = [];
  function collect(node) {
    if (!node) return;
    nodes.push({ ...node, ...positions.get(node.id) });
    for (const child of [node.left, node.right]) {
      if (child) edges.push({ from: positions.get(node.id), to: positions.get(child.id) });
      collect(child);
    }
  }
  collect(root);
  return { nodes, edges, width, height };
}

function TreeDiagram({ root, active, visited, title, prefix = "" }) {
  if (!root) return <div className="tree-empty"><b>{title}</b><span>empty tree</span></div>;
  const layout = treePositions(root);
  return <section className="tree-diagram">
    <b className="tree-diagram-title">{title}</b>
    <div className="tree-diagram-scroll">
      <svg role="img" aria-label={`${title} visualization`} viewBox={`0 0 ${layout.width} ${layout.height}`} width={layout.width} height={layout.height}>
        {layout.edges.map((edge, index) => <line key={`edge-${index}`} x1={edge.from.x} y1={edge.from.y} x2={edge.to.x} y2={edge.to.y} className="tree-edge" />)}
        {layout.nodes.map((node) => {
          const highlighted = active.includes(prefix ? `${prefix}-${node.id}` : node.id);
          const wasVisited = visited.includes(prefix ? `${prefix}-${node.id}` : node.id);
          return <g key={node.id} className={`tree-node ${highlighted ? "tree-node-active" : ""} ${wasVisited ? "tree-node-visited" : ""}`}>
            <circle cx={node.x} cy={node.y} r="21" />
            <text x={node.x} y={node.y + 4}>{node.value}</text>
          </g>;
        })}
      </svg>
    </div>
  </section>;
}

export default function BinaryTreeVisualization({ question }) {
  const initialInput = sampleInput(question);
  const [input, setInput] = useState(initialInput);
  const [frames, setFrames] = useState(() => buildBinaryTreeTrace(question.slug, initialInput).frames);
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState("java");
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const frame = frames[step];
  const isSample = input.trim() === initialInput.trim();
  const code = useMemo(() => getBinaryTreeReferenceCode(question.slug, language), [question.slug, language]);

  useEffect(() => {
    setInput(sampleInput(question));
    setPlaying(false);
    setError("");
    try {
      setFrames(buildBinaryTreeTrace(question.slug, sampleInput(question)).frames);
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
    const timer = window.setTimeout(() => setStep((current) => Math.min(current + 1, frames.length - 1)), 900);
    return () => window.clearTimeout(timer);
  }, [playing, step, frames.length]);

  function visualize(event) {
    event.preventDefault();
    setPlaying(false);
    setError("");
    try {
      setFrames(buildBinaryTreeTrace(question.slug, input).frames);
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
    <div className="breadcrumbs"><Link to="/topics/binary-trees">Binary Trees</Link><span>/</span><span>{question.title}</span><span>/</span><span>Visualization</span></div>
    <div className="visualizer-intro">
      <div><span className="section-eyebrow"><Code2 size={14} /> BINARY TREE LEARNING WORKSPACE</span><h2>{question.title}</h2><p>Explore the tree algorithm step by step, then try your own input.</p></div>
      <Link className="button secondary small" to={`/questions/${question.slug}`}><ArrowLeft size={15} /> Back to problem</Link>
    </div>

    <div className="visualizer-columns">
      <div className="visualizer-main">
        <section className="content-panel visualizer-input-panel">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">01 · TEST INPUT</span><h3>Choose input to visualize</h3></div><span className="sample-badge">{isSample ? "Sample input" : "Custom input"}</span></div>
          <form onSubmit={visualize}>
            <label className="visualizer-input-label" htmlFor="binary-tree-visualizer-input">Input format</label>
            <p className="visualizer-hint">{question.inputDescription || "Enter the tree values using the format described in this problem."}</p>
            <textarea id="binary-tree-visualizer-input" className="visualizer-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" />
            {error && <p className="form-alert" role="alert">{error}</p>}
            <div className="visualizer-input-actions"><span>Input is parsed and visualized in this browser; node values are not executed as code.</span><button className="button primary small" type="submit">Visualize input <ArrowRight size={15} /></button></div>
          </form>
        </section>

        <section className="content-panel visualization-stage" aria-live="polite">
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">02 · TREE WALKTHROUGH</span><h3>Follow the algorithm</h3></div><span className="step-count">{frames.length ? `Step ${step + 1} of ${frames.length}` : "No steps"}</span></div>
          {frame ? <>
            <p className="frame-message">{frame.message}</p>
            <div className={frame.compareTrees ? "tree-visualization tree-compare" : "tree-visualization"}>
              <TreeDiagram root={frame.tree} active={frame.active} visited={frame.visited} title={frame.compareTrees ? "Tree p" : "Tree"} prefix={frame.compareTrees ? "p" : ""} />
              {frame.compareTrees && <TreeDiagram root={frame.otherTree} active={frame.active} visited={frame.visited} title="Tree q" prefix="q" />}
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
          <div className="visualizer-section-heading"><div><span className="section-eyebrow">03 · REFERENCE CODE</span><h3>Tree solution</h3></div></div>
          <div className="language-tabs" role="tablist" aria-label="Programming language">
            {LANGUAGES.map((item) => <button type="button" role="tab" aria-selected={language === item.id} className={language === item.id ? "active" : ""} key={item.id} onClick={() => setLanguage(item.id)}>{item.label}</button>)}
          </div>
          <pre className="reference-code"><code>{code || "Reference solution is not available yet."}</code></pre>
          <p className="code-disclaimer">Reference methods are for learning and are not compiled or executed here.</p>
        </section>
        <section className="content-panel visualizer-note"><div className="visualizer-section-heading"><div><span className="section-eyebrow">04 · VISUALIZATION GUIDE</span><h3>What to watch</h3></div></div><p>{question.visualizationGuide || "Follow the highlighted node and algorithm state at every step."}</p><p>The interactive visualizer limits custom trees to 100 nodes so playback stays responsive.</p><Link className="text-link" to={`/questions/${question.slug}`}>Review problem details <ArrowRight size={14} /></Link></section>
        <section className="content-panel visualizer-legend"><h3>Node highlights</h3><p><i className="legend-dot legend-active" /> Current node or comparison</p><p><i className="legend-dot legend-muted" /> Not yet visited</p></section>
      </aside>
    </div>
  </div>;
}
