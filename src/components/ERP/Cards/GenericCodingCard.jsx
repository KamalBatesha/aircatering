import { Checkbox, Tooltip } from "@mui/material";
import React, { useMemo, useState } from "react";
import HelperIcons from "../../../assets/Helpers/HelperIcons";
// import useGMStore from "../../../assets/store/GM/GMStore";
import useSalesStore from "../../../assets/store/Sales/SalesStore";
import { useCodingActions } from "../../../hooks/useCodingActions";
// import HelperIconMutation from "../../Pages/Sales/HelperIconMutations/HelperIconMutation";
import SelectableCard from "./SelectableCard";

/**
 * GenericCodingCard - A configurable card component for displaying list items.
 *
 * Props:
 * @param {Object} item - The data item object.
 * @param {Boolean} isSelected - Whether the card is selected.
 * @param {Boolean} isGMView - Whether the user has GM view permissions (for approval).
 * @param {Array} queryKey - Query key for react-query mutations (star, delete, etc.).
 * @param {Object} fieldMap - Configuration object mapping gridRole → { field, template }.
 *   Each entry can have:
 *   - field: the data field name (e.g. "agentName")
 *   - template: a render function (item) => JSX, reused from columns config
 *
 *   Supported gridRoles:
 *   - name: main title (Required)
 *   - id: unique ID field (Required for approval)
 *   - approved: approval checkbox (Optional — uses template if provided, else field)
 *   - detail1: first detail line (Optional)
 *   - detail2: second detail line (Optional)
 *   - mobile: mobile number (Optional)
 */

// Helper to render a fieldMap entry: use template if available, otherwise read item[field]
const renderFieldMapEntry = (entry, item) => {
  if (!entry) return null;
  if (entry.template) return entry.template(item);
  if (entry.field) return item[entry.field];
  return null;
};

const GenericCodingCard = ({
  item,
  isSelected,
  isGMView,
  queryKey,
  fieldMap,
  onSelect,
  onDoubleClick,
  className,
  alertConfig,
}) => {
  const setSelectedCodingItem = useSalesStore(
    (state) => state.setSelectedCodingItem
  );
  // const setSalesApproval = useGMStore((state) => state.setSalesApproval);

  const { handleEditAction } = useCodingActions();

  const [lastTap, setLastTap] = useState(0);
  const handleTouchStart = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (onDoubleClick) {
        onDoubleClick(item);
      } else {
        handleEditAction(item);
      }
    }
    setLastTap(now);
  };
  // Extract field/template pairs from fieldMap, with safe fallbacks
  const typeProps = useMemo(
    () => ({
      name: fieldMap?.name || null,
      id: fieldMap?.id || null,
      approved: fieldMap?.approved || null,
      detail1: fieldMap?.detail1 || null,
      detail2: fieldMap?.detail2 || null,
      mobile: fieldMap?.mobile || null,
    }),
    [fieldMap]
  );

  // const { starMutation, deleteMutation, downloadMutation } = HelperIconMutation(
  //   queryKey || [],
  //   {
  //     starred: item?.orderHeaderIsStare,
  //   }
  // );

  const cardStyle = useMemo(
    () => ({
      height: "auto",
      minHeight: "60px",
      padding: "10px",
      borderRadius: "8px",
      boxShadow: isSelected
        ? "0px 0px 5px 1px #55a9eead"
        : "0 2px 5px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "var(--grid-bg-color)",
    }),
    [isSelected]
  );

  // Determine the name to display
  const nameContent = useMemo(() => {
    if (!typeProps.name) return "";
    return renderFieldMapEntry(typeProps.name, item);
  }, [typeProps.name, item]);

  // Determine how to render the "approved" section
  const approvedContent = useMemo(() => {
    if (!typeProps.approved) return null;

    // If a template function was provided (from the column), use it directly
    if (typeProps.approved.template) {
      return typeProps.approved.template(item);
    }

    // Fallback: render the built-in Checkbox using the field name
    if (typeProps.approved.field) {
      return (
        <Checkbox
          checked={item[typeProps.approved.field] || false}
          onChange={(e) => {
            // if (isGMView) {
            //   setSalesApproval({
            //     id: typeProps.id?.field ? item[typeProps.id.field] : null,
            //     isApproved: e.target.checked,
            //     type: "",
            //   });
            // }
          }}
          disabled={!isGMView}
          size="small"
          style={{ padding: 0, width: "20px", height: "20px" }}
        />
      );
    }

    return null;
  }, [typeProps.approved, typeProps.id, item, isGMView
    // , setSalesApproval
  ]);


  const cardContent = (
    <SelectableCard
      isSelected={isSelected}
      onSelect={() => (onSelect ? onSelect(item) : setSelectedCodingItem(item))}
      onDoubleClick={() =>
        onDoubleClick ? onDoubleClick(item) : handleEditAction(item)
      }
      onTouchStart={handleTouchStart}
      item={item}
      className={`coding-card ${className || ""}`}
      style={{ ...cardStyle, position: "relative" }}
    >
      {/* Approved / Checkbox — fixed position top-left */}
      {approvedContent && (
        <div
          style={{
            position: "absolute",
            top: "6px",
            left: "6px",
            zIndex: 2,
          }}
        >
          {approvedContent}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "calc(100% - 40px)",
          overflow: "hidden",
          paddingLeft: approvedContent ? "24px" : "0px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "#333",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {/* Title */}
          {nameContent}
        </div>

        {/* Detail Line 1 */}
        {typeProps.detail1 &&
          (() => {
            const content = renderFieldMapEntry(typeProps.detail1, item);
            if (!content) return null;
            return (
              <div
                style={{ fontSize: "11px", color: "#666", marginBottom: "2px" }}
              >
                {typeProps.detail1.label && (
                  <span style={{ fontWeight: "600", color: "#444" }}>
                    {typeProps.detail1.label}:{" "}
                  </span>
                )}
                {content}
                {item.foodMenuItemSubGroupName
                  ? ` > ${item.foodMenuItemSubGroupName}`
                  : ""}
              </div>
            );
          })()}

        {/* Detail Line 2 */}
        {typeProps.detail2 &&
          (() => {
            const content = renderFieldMapEntry(typeProps.detail2, item);
            if (!content) return null;
            return (
              <div style={{ fontSize: "11px", color: "#888" }}>
                {typeProps.detail2.label && (
                  <span style={{ fontWeight: "600", color: "#444" }}>
                    {typeProps.detail2.label}:{" "}
                  </span>
                )}
                {item.foodMenuItemUnitValue
                  ? `${item.foodMenuItemUnitValue} `
                  : ""}
                {content}
              </div>
            );
          })()}

        {/* Mobile */}
        {typeProps.mobile &&
          (() => {
            const content = renderFieldMapEntry(typeProps.mobile, item);
            if (!content) return null;
            return (
              <div style={{ fontSize: "11px", color: "#666" }}>
                {typeProps.mobile.label && (
                  <span style={{ fontWeight: "600", color: "#444" }}>
                    {typeProps.mobile.label}:{" "}
                  </span>
                )}
                {content}
              </div>
            );
          })()}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <HelperIcons
          edit={true}
          onEdit={() =>
            onDoubleClick ? onDoubleClick(item) : handleEditAction(item)
          }
          disabled={isGMView}
          grid
        />
      </div>
    </SelectableCard>
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
        {cardContent}
      </Tooltip>
    );
  }

  return cardContent;
};

export default React.memo(GenericCodingCard);
