import React, { useEffect, useState } from "react";
import LinkList from "./components/LinkList.jsx";

/*
 * The main application component.  It maintains state for the current input
 * URL, the list of links fetched from the backend, and a loading flag when
 * submitting.  It exposes functions for creating and deleting links and
 * fetches the list when the component first mounts.
 */

// Base URL used to construct short URLs on the client side.  If you set
// VITE_BASE_URL in a .env file when building or running the frontend, that
// value will be used instead.  Otherwise we fall back to localhost.
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

export default function App() {
  const [target, setTarget] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing links from the backend
  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data);
    } catch {
      console.error("Failed to fetch links");
    }
  };

  // Fetch once when the component mounts
  useEffect(() => {
    fetchLinks();
  }, []);

  // Create a new link via POST
  const createLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      }
      setTarget("");
      // Refresh the list after creation
      await fetchLinks();
    } catch {
      alert("Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  // Delete a link by ID
  const deleteLink = async (id) => {
    if (!confirm("Delete this link?")) return;
    try {
      await fetch(`/api/links/${id}`, { method: "DELETE" });
      await fetchLinks();
    } catch {
      alert("Failed to delete link");
    }
  };

  return (
    <div
      style={{
        margin: "2rem auto",
        maxWidth: 800,
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <h1>MERN URL Shortener</h1>
      <form
        onSubmit={createLink}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          type="url"
          placeholder="https://example.com/page"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          required
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 6 }}
        />
        <button disabled={loading} style={{ padding: "10px 16px" }}>
          {loading ? "Creating..." : "Shorten"}
        </button>
      </form>

      <LinkList links={links} onDelete={deleteLink} baseUrl={BASE_URL} />

      <p style={{ marginTop: 24, color: "#666" }}>
        Tip: Click <strong>Open</strong> to test the redirect.  Every visit
        increases the <strong>Clicks</strong> count.
      </p>
    </div>
  );
}