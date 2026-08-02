import React, { useState, useRef, useEffect } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";

export default function SortControl({ value = null, onChange, options = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value?.value || null);

  const ref = useRef();

  useEffect(() => {
    setTempValue(value?.value || null);
  }, [value]);

  // close outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleField = (opt) => {
    setTempValue((prev) => (prev === opt.value ? null : opt.value));
  };

  const handleDone = () => {
    const selectedOption = options.find((o) => o.value === tempValue) || null;

    onChange?.(selectedOption);
    setIsOpen(false);
  };

  const hasValue = !!value?.value;

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
          border: hasValue
            ? "1px solid var(--color-primary)"
            : "1px solid #ccc",
          background: hasValue ? "var(--color-primary-light)" : "#fff",
          color: hasValue ? "var(--color-primary)" : "#333",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-soft)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = hasValue
            ? "var(--color-primary-light)"
            : "#fff";
        }}
      >
        <BiFilterAlt />
        Filter
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "120%",
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            zIndex: 1000,
            minWidth: "220px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              padding: "10px",
              fontWeight: 600,
              borderBottom: "1px solid #eee",
            }}
          >
            Filter By
          </div>

          {options.map((opt, index) => {
            const selected = tempValue === opt.value;

            return (
              <div
                key={opt.value}
                onClick={() => toggleField(opt)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  cursor: "pointer",
                  background: selected ? "var(--color-soft)" : "#fff",
                  borderBottom:
                    index !== options.length - 1 ? "1px solid #eee" : "none",
                }}
              >
                <div style={{ display: "flex", gap: "8px" }}>
                  {selected && <FaCheck />}
                  <span style={{fontWeight: '400'}}>{opt.label}</span>
                </div>
              </div>
            );
          })}

          <div
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "flex-end",
              borderTop: "1px solid #eee",
            }}
          >
            <button
              className="glb-btn primary-btn"
              onClick={handleDone}
              style={{ padding: "4px 12px" }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
