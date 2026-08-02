import React, { useEffect, useMemo, useRef, useState } from "react";
import useUIStore from "../../../assets/store/UI/UIState";

const InfiniteScrollList = ({
  data = [],
  viewMode = "list", // "list" | "grid"
  renderListItem,
  renderGridItem,
  onLoadMore,
  hasMore,
  isLoadingMore,
  rowHeight = 50,
  gridItemHeight = 110, // Default height for grid items
  minColumnWidth = 250, // Default min width for grid columns
  className,
  style,
  tier,
  listHeader, // Optional header for list view
}) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const activateSelection = useUIStore((state) => state.activateSelection);

  const throttleRef = useRef(false);

  // Resize Observer for Container Width
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    // Initial width
    setContainerWidth(containerRef.current.clientWidth);

    return () => resizeObserver.disconnect();
  }, []);

  // Scroll Listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setScrollTop(scrollTop); // For virtualization

      if (throttleRef.current) return;

      // Trigger load more when near bottom (1500px threshold)
      if (
        scrollHeight - scrollTop - clientHeight < 1500 &&
        hasMore &&
        !isLoadingMore
      ) {
        throttleRef.current = true;
        onLoadMore();
        setTimeout(() => {
          throttleRef.current = false;
        }, 500); // Throttle fetch calls
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Virtualization Calculation
  const BUFFER_ROWS = 5; // Reduced buffer for performance
  const totalItems = data.length;

  let startIndex = 0;
  let endIndex = totalItems;
  let paddingTop = 0;
  let paddingBottom = 0;
  let visibleItems = data;

  // Grid Column Calculation
  const gridGap = 16; // Standard gap
  const numColumns = useMemo(() => {
    if (viewMode !== "grid" || containerWidth === 0) return 1;
    // Calculate how many columns fit: width = n * colWidth + (n-1) * gap
    // n * (colWidth + gap) - gap = width
    // n * (colWidth + gap) = width + gap
    // n = (width + gap) / (colWidth + gap)
    // using minColumnWidth logic
    const effectiveMinWidth = window.innerWidth < 768 ? 160 : minColumnWidth;
    return (
      Math.floor((containerWidth + gridGap) / (effectiveMinWidth + gridGap)) ||
      1
    );
  }, [containerWidth, viewMode, minColumnWidth]);

  if (viewMode === "list") {
    startIndex = Math.floor(scrollTop / rowHeight) - BUFFER_ROWS;
    startIndex = Math.max(0, startIndex);

    const containerHeight = containerRef.current
      ? containerRef.current.clientHeight
      : window.innerHeight;
    endIndex =
      Math.ceil((scrollTop + containerHeight) / rowHeight) + BUFFER_ROWS;
    endIndex = Math.min(totalItems, endIndex);

    visibleItems = data.slice(startIndex, endIndex);

    paddingTop = startIndex * rowHeight;
    paddingBottom = (totalItems - endIndex) * rowHeight;
  } else if (viewMode === "grid") {
    const totalRows = Math.ceil(totalItems / numColumns);
    const effectiveRowHeight = gridItemHeight + gridGap;

    const startRow = Math.floor(scrollTop / effectiveRowHeight) - BUFFER_ROWS;
    const safeStartRow = Math.max(0, startRow);

    const containerHeight = containerRef.current
      ? containerRef.current.clientHeight
      : window.innerHeight;
    const endRow =
      Math.ceil((scrollTop + containerHeight) / effectiveRowHeight) +
      BUFFER_ROWS;
    const safeEndRow = Math.min(totalRows, endRow);

    startIndex = safeStartRow * numColumns;
    endIndex = Math.min(totalItems, safeEndRow * numColumns);

    visibleItems = data.slice(startIndex, endIndex);

    paddingTop = safeStartRow * effectiveRowHeight;
    paddingBottom = Math.max(0, (totalRows - safeEndRow) * effectiveRowHeight);
  }

  return (
    <div
      ref={containerRef}
      className={`infinite-scroll-list ${className || ""}`}
      style={{
        overflowY: "auto",
        overflowX: "auto", // Enable horizontal scrolling for sticky columns
        position: "relative",
        top: "10px",
        height: `calc(${tier === 5
            ? "100vh - 400px"
            : tier === 4
              ? "100vh - 350px"
              : "100vh - 300px"
          } ${activateSelection ? "- 15px" : ""})`,
        ...style,
      }}
    >
      {viewMode === "list" && (
        <div style={{ position: "relative" }}>
          {/* List Header (Sticky if needed, managed by parent or passed here) */}
          {listHeader}

          <div
            style={{
              paddingTop: `${paddingTop}px`,
              paddingBottom: `${paddingBottom}px`,
            }}
          >
            {visibleItems.map((item, index) => (
              <React.Fragment key={index + startIndex}>
                {renderListItem(item, index + startIndex)}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {viewMode === "grid" && (
        <div
          style={{
            paddingTop: `${paddingTop}px`,
            paddingBottom: `${paddingBottom}px`,
            paddingLeft: "5px",
            paddingRight: "5px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
              gap: `${gridGap}px`,
              paddingTop: "5px",
            }}
          >
            {visibleItems.map((item, index) => (
              <React.Fragment key={index + startIndex}>
                {renderGridItem(item, index + startIndex)}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {isLoadingMore && (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              border: "3px solid #e0e0e0",
              borderTop: "3px solid #2196f3",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollList;
