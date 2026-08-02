import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import GenericCodingCard from "../Cards/GenericCodingCard";
// import Loading from "../Loading/Loading";
import GenericListRow from "./GenericListRow";
import InfiniteScrollList from "./InfiniteScrollList";
import SortControl from "./SortControl";
import FilterControl from "./FilterControl";
import SelectionButton from "./SelectionButton";
import SelectionRow from "./SelectionRow";
// import useUIStore from "../../assets/Zustand/UI/UIState";
import { MdRefresh } from "react-icons/md";
import { exportToExcel, exportToPDF, printList } from "../../../assets/Constants/ExportUtils";
import Loading from "../../Loading/Loading";
import useUIStore from "../../../assets/store/UI/UIState";

/**
 * Smart Component that handles Data Fetching, Debounce, and Layout.
 *
 * @param {Object} props
 * @param {Array} props.queryKey - Base query key (search query will be appended)
 * @param {Function} props.fetchData - (page, pageSize, search) => Promise
 * @param {String} props.searchQuery - Raw search query from store or parent
 * @param {Number} props.debounceMs - Debounce delay in ms (default 500)
 * @param {String} props.viewMode - "list" or "grid"
 * @param {Array} props.columns - Column config for list view
 * @param {Function} props.renderGridItem - Component to render in grid view
 * @param {Function} props.onSelect - Item click handler
 * @param {Object} props.selectedItem - Currently selected item
 * @param {Object} props.listHeader - Optional custom header (if not using columns based)
 * @param {Number} props.pageSize - Page size (default 50)
 * @param {Number} props.rowHeight - Row height (default 60)
 * @param {Object} props.style - Style overrides
 * @param {String} props.tier - Tier for styling
 * @param {Function} props.onTotalCountChange - Callback for total count changes
 * @param {Function} props.onLoadedCountChange - Callback for loaded count changes
 * @param {Function} props.onDataChange - Callback for data changes (flatData, totalData)
 * @param {Function} props.onDoubleClick - Double click handler
 * @param {Number} props.gridItemHeight - Grid item height
 * @param {Number} props.minColumnWidth - Min column width for grid
 * @param {Function} props.dataAccessor - Optional function to extract row data from each item (e.g. (item) => item.header)
 * @param {String} props.idField - Field name for unique identifier (e.g. "orderHeaderId")
 * @param {Object} props.gridProps - Optional: { isGMView, queryKey, ... } for GenericCodingCard
 * @param {Array} props.staticData - Optional pre-fetched data array. When provided, skips useInfiniteQuery and uses this data directly.
 * @param {Function} props.renderRow - Optional custom row renderer (item, index) => JSX. Overrides GenericListRow.
 * @param {Boolean} props.showSortButton - If true, displays a sort control button at the end of the list header.
 * @param {Array} props.sortOptions - Array of sort options for the dropdown. Each option should be in the format: { label: string, value: string }.
 * @param {String} props.defaultSort - Initial sort value selected by default.
 * @param {Function} props.onSortChange - Callback triggered when sort value changes. Receives selected sort value as argument.
 * @param {Function} props.canSelect - Optional (item) => boolean. If provided, an item can only be added to the selection when this returns true. Deselecting always works. If not provided, all items are selectable.
 */

const SmartInfiniteList = ({
  queryKey,
  console2,
  fetchData,
  searchQuery = "",
  debounceMs = 500,
  viewMode = "list",
  columns = [],
  renderGridItem,
  onSelect,
  selectedItem,
  listHeader,
  pageSize = 50,
  rowHeight = 50,
  style,
  tier,
  onTotalCountChange,
  onLoadedCountChange,
  onDataChange,
  onDoubleClick,
  gridItemHeight,
  minColumnWidth,
  dataAccessor,
  idField,
  gridProps, // Optional: { isGMView, queryKey, ... } for GenericCodingCard
  rowClassName, // Optional: string or (item) => string
  rowAlert, // Optional: (item) => alertConfig
  staticData, // Optional: pre-fetched data array (skips useInfiniteQuery)
  renderRow, // Optional: (item, index) => JSX (overrides GenericListRow)
  localFilter, // Optional: (item) => boolean
  postProcessData, // Optional: (data) => processedData (e.g., grouping)
  refetchIntervalTimer,
  enabled = true, // Optional: control when fetching is enabled
  showSortButton = false,
  sortOptions = [],
  onSortChange,
  defaultSort = null,
  showSelectionButton = false,
  itemsSelected = [],
  setItemsSelected,
  onSelectAll,
  onConfirmSelect,
  selectedButtonName,
  showHelperIcons = false,
  renderHelperIcons,
  onEdit,
  onStar,
  onDelete,
  onDownload,
  onSend,
  isStarred,
  sending,
  allowDelete,
  showRefreshButton = true,
  showSelectAllButton = true,
  canSelect, // Optional: (item) => boolean — gates whether an item can be added to multi-select
  showFilterButton = false,
  filterContent, // Optional: React node to render inside FilterControl dropdown
  hasActiveFilters = false, // Optional: whether any filter is currently active
  onResetFilters, // Optional: callback to reset all filters
  exportFileName = "Export",
}) => {
  console.log("console", console2)
  const isRightBarOpen = useUIStore((state) => state.isRightBarOpen);
  const isMobileView = useUIStore((state) => state.isMobileView);
  const activateSelection = useUIStore((state) => state.activateSelection);
  const setActivateSelection = useUIStore(
    (state) => state.setActivateSelection
  );

  const setSmartListExportConfig = useUIStore((state) => state.setSmartListExportConfig);
  const triggerSmartListExportPdf = useUIStore((state) => state.triggerSmartListExportPdf);
  const setTriggerSmartListExportPdf = useUIStore((state) => state.setTriggerSmartListExportPdf);
  const triggerSmartListExportExcel = useUIStore((state) => state.triggerSmartListExportExcel);
  const setTriggerSmartListExportExcel = useUIStore((state) => state.setTriggerSmartListExportExcel);

  const isStaticMode = Array.isArray(staticData);
  // Helper to extract field mapping from columns for GenericCodingCard
  // Maps gridRole → { field, template } so grid cards can reuse list-view templates
  const fieldMap = React.useMemo(() => {
    if (renderGridItem) return null;
    const map = {};
    columns.forEach((col) => {
      if (col.gridRole) {
        map[col.gridRole] = {
          field: col.field || null,
          template: col.template || null,
          label: col.header || null,
        };
      }
    });
    // Handle ID field mapping automatically if not explicitly defined in columns
    if (!map.id && idField) {
      map.id = { field: idField, template: null };
    }

    // Fallback: if no gridRoles, try to map based on field names or first column
    if (Object.keys(map).length === 0 && columns.length > 0) {
      map.name = { field: columns[0].field || "name", template: null };
    }
    return map;
  }, [columns, renderGridItem]);

  const handleMultiSelect = useCallback(
    (item) => {
      if (!activateSelection) return;
      setItemsSelected((prev) => {
        const exists = prev?.some((i) => i[idField] === item[idField]);
        if (exists) {
          // Always allow deselecting
          return prev.filter((i) => i[idField] !== item[idField]);
        } else {
          // If canSelect is provided and returns false, skip adding
          if (typeof canSelect === "function" && !canSelect(item)) return prev;
          return [...(prev || []), item];
        }
      });
    },
    [activateSelection, setItemsSelected, canSelect]
  );

  const handleRowClick = useCallback(
    (item) => {
      onSelect?.(item);
      handleMultiSelect(item);
    },
    [onSelect, handleMultiSelect]
  );

  const selectedClassName = (item) =>
    activateSelection &&
      itemsSelected?.some((i) => i[idField] === item[idField])
      ? "selected-item"
      : "";

  // Default Grid Item Renderer using GenericCodingCard
  const defaultRenderGridItem = React.useMemo(() => {
    if (renderGridItem) return renderGridItem;

    return (item) => {
      const isSelected = idField
        ? selectedItem && selectedItem[idField] === item[idField]
        : selectedItem === item;

      const alertConfig = activateSelection
        ? null
        : typeof rowAlert === "function"
          ? rowAlert(item)
          : null;

      const rowClass =
        typeof rowClassName === "function" ? rowClassName(item) : rowClassName;

      const rowClass1 =
        typeof selectedClassName === "function"
          ? selectedClassName(item)
          : selectedClassName;

      const finalClassName = alertConfig?.className
        ? `${rowClass || ""} ${rowClass1 || ""} ${alertConfig.className}`.trim()
        : rowClass;
      return (
        <GenericCodingCard
          item={item}
          isSelected={isSelected}
          fieldMap={fieldMap}
          isGMView={gridProps?.isGMView}
          queryKey={gridProps?.queryKey || queryKey}
          onSelect={handleRowClick}
          onDoubleClick={onDoubleClick}
          className={finalClassName}
          alertConfig={alertConfig}
          {...gridProps}
        />
      );
    };
  }, [
    renderGridItem,
    fieldMap,
    selectedItem,
    gridProps,
    queryKey,
    idField,
    onSelect,
    onDoubleClick,
    rowClassName,
    rowAlert,
    staticData,
  ]);

  // rowAlert(staticData[0]);
  // 1. Handle Debounce
  // We debounce the search query here to prevent excessive API calls while typing.
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [searchQuery, debounceMs]);

  // 2. Data Fetching
  // queryKey should be an array. We append debouncedSearch to it so `useInfiniteQuery`
  // treats it as a dependency and refetches when it changes.
  const fullQueryKey = isStaticMode
    ? ["static"]
    : [...queryKey, debouncedSearch];

  const {
    data,
    isLoading: isQueryLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: fullQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      if (!enabled) return { sourceData: [], metaData: { hasNext: false } };
      return await fetchData(pageParam, pageSize, debouncedSearch);
    },
    getNextPageParam: (lastPage, allPages) => {
      // Handle simple array response (no pagination metadata)
      if (Array.isArray(lastPage)) return undefined;

      const meta = lastPage?.metaData;
      if (!meta) return undefined;

      const nextPageIndex = allPages.length + 1;

      // Check for more pages:
      const hasNextServer = meta.hasNext === true;

      const serverTotalPages =
        meta.totalPages ||
        (meta.totalCount
          ? Math.ceil(meta.totalCount / (meta.pageSize || pageSize))
          : 0);
      const hasMorePages = serverTotalPages
        ? nextPageIndex <= serverTotalPages
        : false;

      // If last page was empty, stop to avoid empty fetches
      if ((lastPage?.sourceData?.length || 0) === 0) return undefined;

      if (hasNextServer || hasMorePages) {
        return nextPageIndex;
      }
      return undefined;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
    initialPageParam: 1,
    enabled: !isStaticMode && enabled,
    refetchInterval: refetchIntervalTimer || 0,
    refetchOnWindowFocus: false,
    // refetchOnMount: false,
  });

  const isLoading = isStaticMode ? false : isQueryLoading;

  // 3. Flatten Data
  // React Query returns pages of data. We flatten them into a single array for the virtual list.
  // In static mode, use staticData directly.
  const rawFlatData = React.useMemo(() => {
    return isStaticMode
      ? staticData
      : data?.pages?.flatMap((page) => {
        if (!page) return [];
        if (Array.isArray(page)) return page;
        return page?.sourceData || [];
      }) || [];
  }, [isStaticMode, staticData, data]);

  // Apply dataAccessor if provided (e.g., (item) => item.header)
  const accessedData = React.useMemo(() => {
    return dataAccessor ? rawFlatData.map(dataAccessor) : rawFlatData;
  }, [rawFlatData, dataAccessor]);

  // Apply localFilter if provided (e.g., client-side filtering by specific field)
  const flatData = React.useMemo(() => {
    if (typeof localFilter === "function") {
      return accessedData.filter(localFilter);
    }
    return accessedData;
  }, [accessedData, localFilter]);
  // Apply post-processing (e.g., grouping)
  const finalFlatData = React.useMemo(() => {
    if (viewMode === "list" && typeof postProcessData === "function") {
      return postProcessData(flatData);
    }
    return flatData;
  }, [flatData, postProcessData, viewMode]);

  // 4. Report Total & Loaded Count
  // Effects to notify parent component of data state (e.g., for footer counts or external processing)
  const lastReportedTotal = React.useRef(null);
  const lastReportedLoaded = React.useRef(null);

  useEffect(() => {
    if (onTotalCountChange) {
      const firstPage = data?.pages?.[0];
      let totalCount = 0;
      if (Array.isArray(firstPage)) {
        totalCount = firstPage.length;
      } else if (firstPage?.metaData?.totalCount !== undefined) {
        totalCount = firstPage.metaData.totalCount;
      }

      if (lastReportedTotal.current !== totalCount) {
        lastReportedTotal.current = totalCount;
        onTotalCountChange(totalCount);
      }
    }

    const currentLoaded = flatData.length;
    if (onLoadedCountChange && lastReportedLoaded.current !== currentLoaded) {
      lastReportedLoaded.current = currentLoaded;
      onLoadedCountChange(currentLoaded);
    }

    if (onDataChange) {
      // Pass both flat list data AND the server-side aggregate/total data object (if present)
      const firstPage = data?.pages?.[0];
      console.log("firstPage", firstPage);

      const totalData =
        !Array.isArray(firstPage) && firstPage?.totalData
          ? firstPage.totalData
          : firstPage?.total
            ? firstPage.total
            : firstPage?.totals
              ? firstPage?.totals
              : null;

      const departments = !Array.isArray(firstPage) && firstPage?.totalEmployeesPerDepartment
        ? firstPage.totalEmployeesPerDepartment
        : null
      onDataChange(flatData, totalData, departments);
    }
  }, [data, flatData, onTotalCountChange, onLoadedCountChange, onDataChange]);

  // Export configuration registration
  useEffect(() => {
    const exportableCols = columns.filter(col => col.exportable);
    const currentConfig = useUIStore.getState().smartListExportConfig;
    if (exportableCols.length > 0) {
      if (!currentConfig || !currentConfig.active) {
        setSmartListExportConfig({
          active: true
        });
      }
    } else {
      if (currentConfig !== null) {
        setSmartListExportConfig(null);
      }
    }
  }, [columns, setSmartListExportConfig]);

  // Cleanup export configuration on unmount
  useEffect(() => {
    return () => {
      const configOnCleanup = useUIStore.getState().smartListExportConfig;
      if (configOnCleanup !== null) {
        setSmartListExportConfig(null);
      }
    };
  }, [setSmartListExportConfig]);

  // Listen to export triggers
  useEffect(() => {
    if (triggerSmartListExportPdf) {
      const exportableCols = columns.filter(col => col.exportable);
      if (exportableCols.length > 0) {
        printList(finalFlatData, exportableCols, exportFileName);
      }
      setTriggerSmartListExportPdf(false);
    }
    if (triggerSmartListExportExcel) {
      const exportableCols = columns.filter(col => col.exportable);
      if (exportableCols.length > 0) {
        exportToExcel(finalFlatData, exportableCols, exportFileName);
      }
      setTriggerSmartListExportExcel(false);
    }
  }, [
    triggerSmartListExportPdf,
    triggerSmartListExportExcel,
    finalFlatData,
    columns,
    exportFileName,
    setTriggerSmartListExportPdf,
    setTriggerSmartListExportExcel
  ]);

  // 5. Pre-process Columns for Frozen/Sticky logic
  // Automatically filter out columns with show === false (if show property is defined)
  const processedColumns = React.useMemo(() => {
    const visibleColumns = columns.filter((col) => col.show !== false);
    const totalCols = visibleColumns.length;

    // Helper to get width
    const getWidth = (col) => {
      if (typeof col.width === "number") return col.width;
      if (typeof col.width === "string" && col.width.endsWith("px"))
        return parseInt(col.width, 10);
      return 100; // Default/Fallback
    };

    // Calculate Left Offsets
    let currentLeft = 0;
    const leftOffsets = visibleColumns.map((col) => {
      const w = getWidth(col);
      const offset = currentLeft;
      currentLeft += w;
      return offset;
    });

    // Calculate Right Offsets (Iterate backwards)
    let currentRight = 0;
    const rightOffsets = new Array(totalCols).fill(0);
    for (let i = totalCols - 1; i >= 0; i--) {
      const col = visibleColumns[i];
      const w = getWidth(col);
      rightOffsets[i] = currentRight;
      currentRight += w;
    }

    return visibleColumns.map((col, index) => {
      const isFrozenLeft = col.frozen === true || col.frozen === "left";
      const isFrozenRight = col.frozen === "right";

      if (isFrozenLeft) {
        const style = {
          position: "sticky",
          left: leftOffsets[index] + "px",
          zIndex: 5,
          // borderRight: "2px solid #e0e0e0",
          ...col.style,
        };
        return {
          ...col,
          style,
          className: `sticky-cell ${col.className || ""}`,
          frozenDir: "left",
        };
      }

      if (isFrozenRight) {
        const style = {
          position: "sticky",
          right: rightOffsets[index] + "px",
          zIndex: 5,
          // borderLeft: "2px solid #e0e0e0",
          ...col.style,
        };
        return {
          ...col,
          style,
          className: `sticky-cell ${col.className || ""}`,
          frozenDir: "right",
        };
      }

      return col;
    });
  }, [columns]);

  // CSS for Sticky Columns and Hover handling
  const stickyStyles = `
    .sticky-cell {
      background-color: var(--color-card) !important;
    }
    .list-item:hover .sticky-cell {
      background-color: var(--color-soft, var(--color-bg)) !important;
    }
    .active-list-item .sticky-cell {
      background-color: var(--color-active) !important;
    }
    .active-list-item:hover .sticky-cell {
      background-color: var(--color-active) !important;
    }
    .sticky-header {
			height: 100%;
      background-color: inherit;
      z-index: 11;
      border-right: 1px solid var(--color-border);
    }
  `;

  // 6. Compute grid template for consistent column alignment
  const gridTemplateColumns = processedColumns
    .map((col) => {
      if (!col.width) return "1fr";
      return typeof col.width === "number" ? `${col.width}px` : col.width;
    })
    .join(" ");

  const [sortValue, setSortValue] = useState(defaultSort || null);
  // Handles sort selection change: updates local state and triggers external callback (if provided)
  const handleSortChange = (value) => {
    setSortValue(value);
    onSortChange?.(value);
  };

  const showActionColumn = showSelectionButton || showSortButton || showHelperIcons || showFilterButton;

  // Extends grid columns to include an extra column for the sort button (if enabled)
  const gridTemplateColumnsWithActions = showActionColumn ? gridTemplateColumns + " 176px" : gridTemplateColumns;

  // 7. Generate Header
  const header = listHeader || (
    <div
      id="listHeader"
      style={{
        display: "grid",
        gridTemplateColumns: gridTemplateColumnsWithActions,
        alignItems: "center",
        padding: "0px",
        height: "43px",
        borderBlock: "1px solid #e0e0e0",
        position: "sticky",
        top: 0,
        zIndex: 10,
        color: "var(--text-color)",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        width: "fit-content",
        minWidth: "100%",
        lineHeight: "1",
      }}
    >
      <style>{stickyStyles}</style>
      {processedColumns.map((col, index) => {
        // Sticky Header logic overrides
        const startStyle =
          col.frozenDir === "left" ? { left: col.style.left } : {};
        const endStyle =
          col.frozenDir === "right"
            ? {
              right: col.style.right,
              borderLeft: "2px solid #d8d8d8ff",
              borderRight: "0px solid #d8d8d8ff",
              height: "20px",
              marginInline: "4px",
            }
            : {};

        const additionalHeaderStyle = col.frozenDir
          ? {
            position: "sticky",
            zIndex: 11,
            ...startStyle,
            ...endStyle,
            ...col.headerStyle,
          }
          : col.headerStyle;

        const isFirst = index === 0;

        return (
          <div
            key={col.header || index}
            className={col.frozen ? "sticky-header" : ""}
            style={{
              display: "flex",
              alignItems: "center",
              // overflow: "hidden",
              paddingLeft: "8px",
              paddingRight: "8px",
              textAlign: col.textAlign || "left",
              boxSizing: "border-box",
              ...additionalHeaderStyle,
              justifyContent: col.position ? col.position : 'initial',
            }}
          >
            <div>{col.header}</div>
          </div>
        );
      })}

      {(showSelectionButton || showSortButton || showFilterButton) && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "end", marginRight: '7px' }}>
          {showSelectionButton && <SelectionButton />}
          {showFilterButton && filterContent && (
            <FilterControl
              hasActiveFilters={hasActiveFilters}
              onReset={onResetFilters}
            >
              {filterContent}
            </FilterControl>
          )}
          {showSortButton && (
            <SortControl
              value={sortValue}
              onChange={handleSortChange}
              options={sortOptions}
            />
          )}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          ...style,
        }}
      >
        {/* <Loading /> */}
      </div>
    );
  }

  if (flatData.length === 0) {
    return (
      <div
        style={{
          position: "relative",
          paddingTop: "10px",
          ...style,
        }}
      >
        {header}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
            color: "#888",
            fontSize: "14px",
          }}
        >
          <span>No data</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", ...style }}>
      {showSelectionButton && (
        <SelectionRow
          isActive={activateSelection}
          onSelectAll={onSelectAll}
          onConfirmSelect={onConfirmSelect}
          onCancelSelect={() => {
            setActivateSelection(false);
            setItemsSelected([]);
          }}
          itemsSelected={itemsSelected}
          selectedButtonName={selectedButtonName}
          showSelectAllButton={showSelectAllButton}
        />
      )}

      <InfiniteScrollList
        data={finalFlatData}
        viewMode={viewMode}
        onLoadMore={isStaticMode ? () => { } : fetchNextPage}
        hasMore={isStaticMode ? false : hasNextPage}
        isLoadingMore={isStaticMode ? false : isFetchingNextPage}
        rowHeight={rowHeight}
        style={style}
        tier={tier}
        listHeader={header}
        gridItemHeight={gridItemHeight}
        minColumnWidth={minColumnWidth}
        // List Item Renderer
        // Uses renderRow if provided, otherwise GenericListRow
        renderListItem={(item, index) => {
          // Custom row renderer takes precedence
          if (renderRow) {
            const alertConfig = activateSelection
              ? null
              : typeof rowAlert === "function"
                ? rowAlert(item)
                : null;

            const finalClassName = [
              rowClassName,
              selectedClassName(item),
              alertConfig?.className,
            ]
              .filter(Boolean)
              .join(" ");

            return renderRow(item, index, processedColumns, finalClassName);
          }
          if (index === 0 && showSelectionButton) {
            const alertConfig =
              typeof rowAlert === "function" ? rowAlert(item) : null;

            const finalClassName = [
              rowClassName,
              selectedClassName(item),
              alertConfig?.className,
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <React.Fragment key="header-sel">
                {/* <SelectionRow
                  key="selection-row"
                  isActive={activateSelection}
                  onSelectAll={onSelectAll}
                  onConfirmSelect={onConfirmSelect}
                  onCancelSelect={() => {
                    setActivateSelection(false);
                    setItemsSelected([]);
                  }}
                  itemsSelected={itemsSelected}
                  selectedButtonName={selectedButtonName}
                  showSelectAllButton={showSelectAllButton}
                /> */}

                <GenericListRow
                  key={idField ? item[idField] : item.uniqueId || index}
                  item={item}
                  columns={processedColumns}
                  onSelect={handleRowClick}
                  onDoubleClick={onDoubleClick}
                  isSelected={
                    selectedItem && selectedItem[idField] === item[idField]
                  }
                  className={finalClassName}
                  gridTemplateColumns={gridTemplateColumnsWithActions}
                  alertConfig={alertConfig}
                />
              </React.Fragment>
            );
          }
          const isSelected = idField
            ? selectedItem && selectedItem[idField] === item[idField]
            : selectedItem === item;

          const alertConfig =
            typeof rowAlert === "function" ? rowAlert(item) : null;
          const rowClass =
            typeof rowClassName === "function"
              ? rowClassName(item)
              : rowClassName;

          const rowClass1 =
            typeof rowClassName === "function"
              ? rowClassName(item)
              : rowClassName;

          const finalClassName = [
            rowClass1,
            selectedClassName(item),
            alertConfig?.className,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <GenericListRow
              key={idField ? item[idField] : item.uniqueId || index}
              item={item}
              columns={processedColumns}
              onSelect={handleRowClick}
              onDoubleClick={onDoubleClick}
              isSelected={isSelected}
              className={finalClassName}
              gridTemplateColumns={gridTemplateColumnsWithActions}
              alertConfig={alertConfig}
              showHelperIcons={showHelperIcons}
              renderHelperIcons={renderHelperIcons}
              onEdit={onEdit}
              onStar={onStar}
              onDelete={onDelete}
              onDownload={onDownload}
              onSend={onSend}
              isStarred={isStarred}
              sending={sending}
              allowDelete={allowDelete}
            />
          );
        }}
        // Grid Item Renderer
        // Uses defaultRenderGridItem which falls back to GenericCodingCard if no custom renderer
        renderGridItem={defaultRenderGridItem}
      />
      {/* Floating Refresh Button */}
      {/* {!isStaticMode && showRefreshButton && (
        <div
          className="glb-btn primary-btn refresh-fab"
          style={{
            position: "fixed",
            top: isMobileView ? "120px" : "73px",
            right:
              isMobileView ? "40px":
              isRightBarOpen ? "530px" : "150px",
            zIndex: 1,
            width: "auto",
            height: "36px",
            padding: "0 15px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "13px",
          }}
          onClick={() => refetch()}
        >
          <MdRefresh
            style={{
              fontSize: "18px",
              animation: isRefetching ? "spin 1s linear infinite" : "none",
            }}
          />
          <span>{isRefetching ? "Refreshing..." : "Refresh List"}</span>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .refresh-fab:active {
              transform: scale(0.95);
            }
          `}</style>
        </div>
      )} */}
    </div>
  );
};

export default SmartInfiniteList;
