import React, { useState, useRef, useEffect } from "react";
import { BiFilterAlt } from "react-icons/bi";

/**
 * FilterControl — a dropdown button that renders custom filter content.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The filter form content (Autocomplete fields, etc.)
 * @param {Boolean} props.hasActiveFilters - Whether any filter is currently active (controls visual indicator)
 * @param {Function} props.onReset - Called when user clicks "Reset"
 * @param {String} props.label - Button label (default "Filter")
 */
export default function FilterControl({
  children,
  hasActiveFilters = false,
  onReset,
  label = "Filter",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        // Don't close if clicking on MUI popper/dropdown (Autocomplete options)
        const popper = document.querySelector(".MuiAutocomplete-popper");
        if (popper && popper.contains(e.target)) return;
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* BUTTON */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "20px",
          border: hasActiveFilters
            ? "1px solid var(--color-primary)"
            : "1px solid #ccc",
          background: hasActiveFilters ? "var(--color-primary-light)" : "#fff",
          color: hasActiveFilters ? "var(--color-primary)" : "#333",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-soft)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = hasActiveFilters
            ? "var(--color-primary-light)"
            : "#fff";
        }}
      >
        <BiFilterAlt />
        {label}
        {hasActiveFilters && (
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--color-primary)",
              marginLeft: "2px",
            }}
          />
        )}
      </button>

      {/* DROPDOWN PANEL */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "120%",
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            zIndex: 1000,
            minWidth: "250px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            borderRadius: "8px",
            overflow: "visible",
          }}
        >
          {/* Header */}
          <div
            style={{
              fontSize: "13px",
              padding: "10px 14px",
              fontWeight: 600,
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Filters by</span>
            {hasActiveFilters && onReset && (
              <button
                onClick={() => {
                  onReset();
                }}
                style={{
                  border: "none",
                  background: "none",
                  color: "var(--color-primary)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-soft)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                Reset All
              </button>
            )}
          </div>

          {/* Filter Content */}
          <div
            style={{
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
