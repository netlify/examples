import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch saved books from our DB
  const fetchSavedBooks = async () => {
    try {
      const res = await axios.get("/api/books");
      setSavedBooks(res.data);
    } catch (err) {
      setError("Failed to load saved books");
    }
  };

  useEffect(() => {
    fetchSavedBooks();
  }, []);

  // Search Open Library API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
      );
      setSearchResults(res.data.docs);
    } catch (err) {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Save book to DB
  const handleSave = async (book) => {
    setSaving(true);
    setError("");
    try {
      await axios.post("/api/books", {
        title: book.title,
        author: book.author_name ? book.author_name[0] : "Unknown",
        cover_url: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : "https://placehold.co/128x195?text=No\nCover",
      });
      fetchSavedBooks();
      setSearchResults([]); // Clear search results after saving
    } catch (err) {
      setError("Failed to save book");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h1>Book Tracker</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a book title..."
          className="search-input"
        />
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="book-grid">
            {searchResults.map(book => (
              <div key={book.key} className="book-card">
                <img
                  src={book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "https://placehold.co/128x195?text=No%20Cover"}
                  alt={book.title}
                />
                <div className="title">{book.title}</div>
                <div className="author">{book.author_name ? book.author_name[0] : "Unknown Author"}</div>
                <button
                  onClick={() => handleSave(book)}
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <h2>My Books</h2>
      <div className="book-grid my-books">
        {savedBooks.length === 0 ? (
          <div className="no-books">No books saved yet.</div>
        ) : (
          savedBooks.map(book => (
            <div key={book.id} className="book-card">
              <img
                src={book.cover_url}
                alt={book.title}
              />
              <div className="title">{book.title}</div>
              <div className="author">{book.author}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
