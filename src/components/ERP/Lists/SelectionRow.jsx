const SelectionRow = ({
  onConfirmSelect,
  onSelectAll,
  onCancelSelect,
  itemsSelected,
  isActive,
  selectedButtonName = "Confirm",
  showSelectAllButton = true,
}) => {
  return (
    <div className={`selection-row ${isActive ? "open" : ""}`}>
      <span style={{ marginRight: "auto", fontSize: "12px", color: "#555" }}>
        {itemsSelected.length} Selected
      </span>
      {showSelectAllButton && (

        <button
          className="glb-btn secondary-btn"
          style={{ display: isActive ? "block" : "none", padding: "4px 12px" }}
          onClick={onSelectAll}
        >
          Select All
        </button>
      )}

      <button
        className="glb-btn primary-btn"
        onClick={onConfirmSelect}
        style={{ display: isActive ? "block" : "none", padding: "4px 12px" }}
      >
        {selectedButtonName}
      </button>

      <button
        className="glb-btn danger-btn"
        onClick={onCancelSelect}
        style={{ display: isActive ? "block" : "none", padding: "4px 12px" }}
      >
        Cancel
      </button>
    </div>
  );
};

export default SelectionRow;
