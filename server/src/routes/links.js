import express from "express";
import { customAlphabet } from "nanoid";
import Link from "../models/Link.js";

/*
 * Router that exposes basic CRUD endpoints for short links.  The POST
 * endpoint creates a new link, the GET endpoint lists recent links, and the
 * DELETE endpoint removes a link by ID.
 */

const router = express.Router();

// Configure nanoid to generate six‑character slugs consisting of lowercase
// letters and digits.  Using a custom alphabet reduces potential collisions
// and results in user‑friendly URLs.
const makeSlug = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

// POST /api/links
// Accepts a JSON body with { target: string } and returns the new link
router.post("/", async (req, res) => {
  try {
    const { target } = req.body;
    // Validate the target URL starts with http or https
    if (!target || !/^https?:\/\//i.test(target)) {
      return res
        .status(400)
        .json({ error: "Provide a valid URL starting with http:// or https://" });
    }

    // Generate unique slug; ensure no collision with existing slugs
    let slug = makeSlug();
    while (await Link.findOne({ slug })) {
      slug = makeSlug();
    }

    // Create the link document
    const link = await Link.create({ slug, target });
    return res.json(link);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/links
// Returns the most recent 100 links sorted by creation date (descending)
router.get("/", async (_req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 }).limit(100);
    return res.json(links);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/links/:id
// Deletes a link by its MongoDB object ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Link.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;