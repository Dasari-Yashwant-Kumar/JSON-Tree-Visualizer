import { useState } from "react";
import JsonInput from "./JsonInput";
import TreeVisualizer from "./TreeVisualizer";
import { jsonToFlow } from "./utils/jsonToFlow";

export default function App() {
  const [treeData, setTreeData] = useState({ nodes: [], edges: [], pathToId: {} });
  const [sourceJson, setSourceJson] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightNodeId, setHighlightNodeId] = useState(null);
  const [message, setMessage] = useState("");

  const handleVisualize = (json) => {
    const result = jsonToFlow(json);
    setTreeData(result);
    setSourceJson(json);
    setHighlightNodeId(null);
    setMessage("");
  };

  function parseJsonPath(path) {
    let raw = path.trim();
    if (!raw) return null;
    let norm = raw.startsWith("$") ? raw : `$.${raw}`;
    while (/\.\d+/.test(norm)) {
      norm = norm.replace(/\.(\d+)/g, "[$1]");
    }
    norm = norm.replace(/\[\[/g, "[").replace(/]]/g, "]");
    return norm;
  }

  const handleSearch = () => {
    const normalized = parseJsonPath(searchTerm);
    if (!normalized) {
      setMessage("Enter a JSON path, value, or key to search (e.g., $.user.name or orders[0].item or Alice)");
      setHighlightNodeId(null);
      return;
    }
    const { pathToId, nodes } = treeData;
    if (pathToId[normalized]) {
      setHighlightNodeId(pathToId[normalized]);
      setMessage("Match found");
      return;
    }
    const matchingPaths = Object.keys(pathToId).filter(key => key.toLowerCase().includes(normalized.toLowerCase()));
    if (matchingPaths.length > 0) {
      setHighlightNodeId(pathToId[matchingPaths[0]]);
      setMessage("Match found");
      return;
    }
    const termLower = searchTerm.trim().toLowerCase();
    const node = (nodes || []).find(n =>
      (n.data.label && n.data.label.toLowerCase().includes(termLower)) ||
      (n.data.valuePreview && n.data.valuePreview.toLowerCase().includes(termLower))
    );
    if (node) {
      setHighlightNodeId(node.id);
      setMessage("Match found");
      return;
    }
    setHighlightNodeId(null);
    setMessage("No match found");
  };

  const handleClear = () => {
    setTreeData({ nodes: [], edges: [], pathToId: {} });
    setSourceJson(null);
    setSearchTerm("");
    setHighlightNodeId(null);
    setMessage("");
  };

  return (
    <div className="min-h-screen px-2 py-8 sm:px-4 md:px-8 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-cyan-100 relative overflow-x-hidden">
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl bg-white/75 backdrop-blur-md border border-blue-100 py-10 px-4 sm:px-10 mb-12 mt-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 tracking-tight text-center mb-2 drop-shadow-lg">
          JSON Tree Visualizer
          <span className="ml-2 align-middle" role="img" aria-label="tree">🌳</span>
        </h1>
        <div className="text-center text-gray-500 mb-8 text-lg">Easily visualize and explore your JSON data structures</div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-5 mb-7 w-full max-w-2xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by JSON path, key, or value (e.g., $.user.name, orders[0].item, Alice)"
            className="border border-blue-200 bg-white rounded-xl w-full p-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow hover:from-blue-600 hover:to-cyan-600 transition"
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-100 text-gray-800 px-8 py-4 text-lg font-semibold rounded-xl border border-gray-200 shadow hover:bg-gray-200 transition"
          >
            Clear
          </button>
        </div>
        {message && (
          <div className={"mb-4 text-base text-center " + (message === 'Match found' ? 'text-green-600' : 'text-red-500')}>{message}</div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        <div className="w-full md:w-1/2 mb-10 md:mb-0">
          <div className="rounded-2xl shadow-lg bg-white/90 border border-blue-50">
            <JsonInput onVisualize={handleVisualize} />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="rounded-2xl shadow-lg bg-white/90 border border-blue-50 min-h-[420px]">
            {treeData.nodes.length === 0 ? (
              <div className="h-[70vh] flex items-center justify-center text-gray-400 text-lg font-semibold text-center px-2 select-none">
                No nodes yet.<br />Paste JSON and click Visualize.
              </div>
            ) : (
              <TreeVisualizer
                nodes={treeData.nodes}
                edges={treeData.edges}
                highlightNodeId={highlightNodeId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
