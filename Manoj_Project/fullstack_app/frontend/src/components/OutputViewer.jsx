import React, { useState } from 'react';

function isObject(o) {
  return o && typeof o === 'object' && !Array.isArray(o);
}

function JsonViewer({ data }) {
  return <pre className="json-view">{JSON.stringify(data, null, 2)}</pre>;
}

function DynamicTable({ data }) {
  if (!isObject(data)) return <div className="muted">No tabular data available</div>;
  const rows = Object.keys(data).map((k) => ({ key: k, value: data[k] }));
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key}>
            <td className="mono">{r.key}</td>
            <td>{typeof r.value === 'object' ? JSON.stringify(r.value) : String(r.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function OutputViewer({ result }) {
  const [mode, setMode] = useState('json');

  if (!result) return <div className="card empty-card">No extracted data yet</div>;

  const structured = result;
  const top = isObject(structured) ? structured : { data: structured };

  return (
    <div className="card output-card">
      <div className="output-header">
        <h3 className="card-title">Extracted Output</h3>
        <div className="toggle">
          <button className={`tiny ${mode === 'json' ? 'active' : ''}`} onClick={() => setMode('json')}>JSON</button>
          <button className={`tiny ${mode === 'table' ? 'active' : ''}`} onClick={() => setMode('table')}>Table</button>
        </div>
      </div>

      <div className="output-body">
        {mode === 'json' ? <JsonViewer data={top} /> : <DynamicTable data={top} />}
      </div>
    </div>
  );
}
