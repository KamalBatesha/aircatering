import React, { useState, useRef } from "react";
import { Tooltip } from "@mui/material";
import dayjs from "dayjs";
import HelperIcons from "../../../assets/Helpers/HelperIcons";
// import HelperIcons from "../../assets/Helpers/HelperIcons";

/**
 * Generic Row for SmartInfiniteList
 * @param {Object} props
 * @param {Object} props.item - Data item
 * @param {Array} props.columns - Column configuration: { field, header, width, template, style }
 * @param {Function} props.onSelect - Click handler
 * @param {Boolean} props.isSelected - Selection state
 * @param {String} props.className - Custom class
 */
const GenericListRow = ({
  item,
  columns,
  onSelect,
  onDoubleClick,
  isSelected,
  className = "",
  style = {},
  gridTemplateColumns: gridTemplateColumnsProp,
  alertConfig,
  multiSelection,
  showHelperIcons,
  renderHelperIcons,
  onEdit,
  onStar,
  onDelete,
  onDownload,
  onSend,
  isStarred,
  sending,
  allowDelete,
}) => {
  // Compute grid template from columns if not passed explicitly
  const gridTemplateColumns =
    gridTemplateColumnsProp ||
    columns
      .map((col) => {
        if (!col.width) return "1fr";
        return typeof col.width === "number" ? `${col.width}px` : col.width;
      })
      .join(" ");

  const lastClickTimeRef = useRef(0);
  const [lastTap, setLastTap] = useState(0);

  const handleTouchStart = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (onDoubleClick) onDoubleClick(item);
    }
    setLastTap(now);
  };
  const finalColumns = showHelperIcons
    ? [...columns, { field: "__helpers__", width: "176px" }]
    : columns;

  const rowContent = (
    <div
      className={`list-item ${isSelected ? "active-list-item" : ""} ${className}`}
      onClick={() => {
        const now = Date.now();
        if (now - lastClickTimeRef.current < 400) {
          // Double-click detected via click timing
          if (onDoubleClick) onDoubleClick(item);
          lastClickTimeRef.current = 0; // Reset to prevent triple-click triggering
        } else {
          onSelect && onSelect(item);
          lastClickTimeRef.current = now;
        }
      }}
      onDoubleClick={() => onDoubleClick && onDoubleClick(item)}
      onTouchStart={handleTouchStart}
      style={{
        display: "grid",
        gridTemplateColumns,
        paddingBlock: "10px",
        alignItems: "center",
        padding: "0px",
        borderBottom: "1px solid var(--color-border, #f0f0f0)", // Clean separator
        boxSizing: "border-box",
        cursor: "pointer",
        width: "fit-content", // Ensure row grows with content (fixes background cut-off)
        minWidth: "100%", // Ensure it fills container at minimum
        ...style,
      }}
    >
      {finalColumns.map((col, index) => {
        // Calculate style for this cell
        const isFirst = index === 0;
        const isLast = index === columns.length - 1;
        let content = col.template ? col.template(item) : (col.render ? col.render(item) : item[col.field]);

        const cellStyle = {
          minHeight: col.height || "100%",
          display: "flex",
          alignItems: "center",
          paddingLeft: "8px",
          paddingRight: "8px",
          textAlign: col.textAlign || "left",
          justifyContent: col.position || 'initial',
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          color: "var(--text-color)",
          boxSizing: "border-box", // Ensure padding doesn't affect width
          borderBottom:
            col.header === "Sales" && isFirst && item.orderHeaderZasUpdate
              ? "2px solid red"
              : "",
          // paddingBottom: isLast ? "20px" : "",
          ...col.style,
        };

        if (col.field === "__helpers__") {
          return (
            <div
              key="helpers"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                paddingRight: "10px",
                alignItems: "center",
              }}
            >
              {renderHelperIcons ? (
                renderHelperIcons(item)
              ) : (
                <>
                  <HelperIcons
                    onEdit={onEdit}
                    onStar={onStar}
                    onDelete={onDelete}
                    onDownload={onDownload}
                    onSend={onSend}
                    isStarred={isStarred}
                    sending={sending}
                    allowDelete={allowDelete}
                  />
                </>
              )}
            </div>
          );
        }

        const isDateColumn =
          col.type === "date" ||
          (typeof col.field === "string" &&
            col.field.toLowerCase().split(/\s+/).includes("date")) ||
          (typeof col.header === "string" &&
            col.header.toLowerCase().split(/\s+/).includes("date"));

        const rawValue = item[col.field] || (isDateColumn ? content : null);

        let tooltipTitle = typeof content === "string" ? content : undefined;
        let formattedDate = null;

        if (isDateColumn && rawValue) {
          const dateObj = dayjs(rawValue);
          if (dateObj.isValid()) {
            formattedDate = dateObj.format("dddd, D MMMM YYYY");
            tooltipTitle = formattedDate;
          }
        }

        const cellContent = (
          <div
            key={`${col.field || "cell"}-${index}`}
            style={cellStyle}
            className={col.className}
            title={!formattedDate ? tooltipTitle : undefined}
          >
            {content}
          </div>
        );

        if (!col?.stopDefaultEffect && formattedDate) {
          return (
            <Tooltip
              key={`${col.field || "cell"}-${index}`}
              title={
                <div
                  style={{
                    padding: "5px",
                    backgroundColor: "var(--color-card)",
                  }}
                >
                  {formattedDate}
                </div>
              }
              arrow
              placement="bottom"
            >
              {cellContent}
            </Tooltip>
          );
        }

        return cellContent;
      })}
    </div>
  );

  if (alertConfig) {
    const { icon, label, message, colors } = alertConfig;
    return (
      <Tooltip
        followCursor
        placement="top-start"
        title={
          <div
            style={{
              background: colors?.bg || "#fff0f0",
              border: `1.5px solid ${colors?.border || "#e53935"}`,
              borderLeft: `4px solid ${colors?.border || "#e53935"}`,
              borderRadius: "8px",
              boxShadow: `0 4px 16px ${colors?.border || "#e53935"}33, 0 1px 4px rgba(0,0,0,0.10)`,
              padding: "8px 10px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              minWidth: "200px",
              maxWidth: "280px",
            }}
          >
            {/* Header row: icon + label */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: colors?.iconBg || "#fde8e8",
                  fontSize: "12px",
                  flexShrink: 0,
                }}
              >
                {icon}
              </span>
              <span
                style={{
                  fontWeight: "700",
                  fontSize: "12px",
                  color: colors?.labelColor || "#c62828",
                  letterSpacing: "0.2px",
                }}
              >
                {label}
              </span>
            </div>

            {/* Message */}
            <p
              style={{
                margin: 0,
                fontSize: "10.5px",
                color: colors?.text || "#b71c1c",
                lineHeight: "1.4",
                paddingLeft: "28px",
              }}
            >
              {message}
            </p>
          </div>
        }
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: "transparent",
              padding: 0,
              maxWidth: "none",
            },
          },
        }}
      >
        {rowContent}
      </Tooltip>
    );
  }

  return rowContent;
};

export default React.memo(GenericListRow);
