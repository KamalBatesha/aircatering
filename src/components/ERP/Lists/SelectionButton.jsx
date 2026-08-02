import React from "react";
import { PiSelectionAllBold } from "react-icons/pi";
import useUIStore from "../../../assets/store/UI/UIState";

const SelectionButton = () => {
  const activateSelection = useUIStore((state) => state.activateSelection);
  const setActivateSelection = useUIStore(
    (state) => state.setActivateSelection
  );

  return (
    <button
      onClick={() => setActivateSelection(!activateSelection)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "20px",
        border: activateSelection
          ? "1px solid var(--color-primary)"
          : "1px solid #ccc",
        background: activateSelection ? "var(--color-primary-light)" : "#fff",
        color: activateSelection ? "var(--color-primary)" : "#333",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--color-soft)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = activateSelection
          ? "var(--color-primary-light)"
          : "#fff";
      }}
    >
      <PiSelectionAllBold />
      {activateSelection ? "Deselect" : "Select"}
    </button>
  );
};

export default SelectionButton;
