const TYPE_STYLES = {
  object: { background: "#eef2ff", border: "1px solid #c7d2fe" },
  array: { background: "#ecfeff", border: "1px solid #a5f3fc" },
  primitive: { background: "#fff7ed", border: "1px solid #fed7aa" },
};

function valueType(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "primitive";
  if (typeof value === "object") return "object";
  return "primitive";
}

function previewValue(value) {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "number" || typeof value === "boolean" || value === null) return String(value);
  if (Array.isArray(value)) return `[${value.length}]`;
  if (typeof value === "object" && value !== null) return `{${Object.keys(value).length}}`;
  return String(value);
}

export function jsonToFlow(json) {
  const nodes = [];
  const edges = [];
  const pathToId = {};
  let rowIndex = 0;

  function addNode(value, path, depth, parentId, keyLabel) {
    const id = path;
    const t = valueType(value);
    const baseX = depth * 320;
    const baseY = rowIndex * 160;
    rowIndex += 1;

    let label;
    if (t === "object") label = `${keyLabel ?? "$"} (object)`;
    else if (t === "array") label = `${keyLabel ?? "$"} (array)`;
    else label = `${keyLabel ?? "$"}: ${previewValue(value)}`;

    const style = {
      borderRadius: 10,
      padding: 14,
      width: 240,
      fontSize: 14,
      textAlign: "left",
      ...TYPE_STYLES[t],
    };

    nodes.push({ id, data: { label, type: t, path, valuePreview: previewValue(value) }, position: { x: baseX, y: baseY }, style });
    pathToId[path] = id;

    if (parentId) {
      edges.push({ id: `${parentId}->${id}`, source: parentId, target: id });
    }

    if (t === "object") {
      const entries = Object.entries(value);
      for (let i = 0; i < entries.length; i++) {
        const [k, v] = entries[i];
        const childPath = `${path}.${k}`;
        addNode(v, childPath, depth + 1, id, k);
      }
    } else if (t === "array") {
      for (let i = 0; i < value.length; i++) {
        const v = value[i];
        const childPath = `${path}[${i}]`;
        addNode(v, childPath, depth + 1, id, `[${i}]`);
      }
    }
  }

  addNode(json, "$", 0, null, "$");

  return { nodes, edges, pathToId };
}
