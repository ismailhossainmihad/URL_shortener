import React from "react";

/*
 * Displays a table of short links with actions to copy, open and delete.
 * It takes three props:
 *   links: array of link objects returned from the backend
 *   onDelete: function to call when deleting a link (receives link ID)
 *   baseUrl: base URL of your API server (used to build the short link URL)
 */

export default function LinkList({ links, onDelete, baseUrl }) {
  // If there are no links, show a message
  if (!links.length) return <p>No links yet.</p>;

  // Utility to copy a string to the clipboard and show a simple alert
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th align="left">Slug</th>
          <th align="left">Target</th>
          <th>Clicks</th>
          <th align="right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {links.map((l) => {
          const shortUrl = `${baseUrl}/r/${l.slug}`;
          return (
            <tr key={l._id} style={{ borderTop: "1px solid #eee" }}>
              <td>{l.slug}</td>
              <td
                style={{
                  maxWidth: 420,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                <a href={l.target} target="_blank" rel="noreferrer">
                  {l.target}
                </a>
              </td>
              <td align="center">{l.clicks}</td>
              <td align="right">
                <button onClick={() => copy(shortUrl)} style={{ marginRight: 8 }}>
                  Copy
                </button>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginRight: 8 }}
                >
                  Open
                </a>
                <button
                  onClick={() => onDelete(l._id)}
                  style={{ color: "white", background: "crimson" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}