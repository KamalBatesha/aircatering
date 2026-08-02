import React, { forwardRef } from "react";

const SelectableCard = forwardRef(({
  children,
  isSelected,
  onSelect,
  onDoubleClick,
  className,
  style,
  item, // item data to pass to handlers
  onTouchStart,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={`selectable-card ${isSelected ? "selected" : ""} ${className || ""}`}
      onClick={(e) => {
        if (onSelect) onSelect(item);
        if (props.onClick) props.onClick(e);
      }}
      onDoubleClick={(e) => {
        if (onDoubleClick) onDoubleClick(item);
        if (props.onDoubleClick) props.onDoubleClick(e);
      }}
      style={{
        cursor: "pointer",
        userSelect: "none",
        transition:
          "transform 0.1s ease, background-color 0.2s ease, box-shadow 0.2s ease",
        backgroundColor: isSelected ? "#e3f2fd" : "#fff",
        borderRadius: "12px",
        boxShadow: isSelected
          ? "0 0 0 2px #73b8f0b2"
          : "0 2px 8px rgba(0,0,0,0.08)",
        border: isSelected ? "1px solid #3d88c5b7" : "1px solid transparent",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        position: "relative",
        overflow: "hidden", // for ripple effect if added later
        ...style,
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.98)";
        if (props.onMouseDown) props.onMouseDown(e);
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = isSelected
          ? "scale(1.02)"
          : "scale(1)";
        if (props.onMouseUp) props.onMouseUp(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = isSelected
          ? "scale(1.02)"
          : "scale(1)";
        if (props.onMouseLeave) props.onMouseLeave(e);
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = "scale(0.98)";
        if (onTouchStart) onTouchStart(e);
        if (props.onTouchStart) props.onTouchStart(e);
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = isSelected
          ? "scale(1.02)"
          : "scale(1)";
        if (props.onTouchEnd) props.onTouchEnd(e);
      }}
    >
      {children}
    </div>
  );
});

export default SelectableCard;
