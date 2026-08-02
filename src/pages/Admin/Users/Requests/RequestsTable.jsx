import React from 'react';
import SmartInfiniteList from '../../../../components/ERP/Lists/SmartInfiniteList';

const colors = {
    lightGray: '#E5E5E5',
};

export default function RequestsTable({
    queryKey,
    fetchData,
    columns,
    onDoubleClick,
    onSelect,
    selectedItem,
    setCount,
    searchQuery,
    localFilter
}) {
    return (
        <div className="rounded-3xl border bg-white p-5 shadow-sm" style={{ borderColor: colors.lightGray }}>
            <SmartInfiniteList
                queryKey={queryKey}
                fetchData={fetchData}
                columns={columns.filter((col) => !col.hide)}
                onDoubleClick={onDoubleClick}
                idField="customerId"
                tier={4}
                onTotalCountChange={setCount}
                onSelect={onSelect}
                selectedItem={selectedItem}
                searchQuery={searchQuery}
                localFilter={localFilter}
            />
        </div>
    );
}
