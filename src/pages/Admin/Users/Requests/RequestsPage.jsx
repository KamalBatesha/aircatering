import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock3, CheckCircle2, XCircle } from 'lucide-react';
import dayjs from 'dayjs';

import { GetMenuRequestsList } from '../../../../assets/apis/Admin/AdminApi';
import RequestsFilters from './RequestsFilters';
import RequestsTable from './RequestsTable';

export default function RequestsPage() {
    const { tabType } = useParams();
    const navigate = useNavigate();
    const { search, setSearch } = useOutletContext();
    const [count, setCount] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);

    // Map the URL tab parameter to the API status string
    const statusMap = {
        requests: 'underprocedure',
        approved: 'approved',
        disapproved: 'rejected'
    };

    const apiStatus = statusMap[tabType] || 'underprocedure';

    const queryKey = useMemo(
        () => ["MenuRequestsList", tabType],
        [tabType]
    );

    const { data, refetch } = useQuery({
        queryKey,
        queryFn: () => GetMenuRequestsList(apiStatus),
        enabled: true
    });

    useEffect(() => {
        refetch();
    }, [tabType, refetch]);

    const fetchData = async (page, pageSize, searchQuery) => {
        try {
            const response = await GetMenuRequestsList(apiStatus);
            return response;
        } catch (error) {
            console.error("Error fetching Menu Requests:", error);
            return { sourceData: [], metaData: { hasNext: false, totalCount: 0 } };
        }
    };

    const tabs = [
        { label: 'Requests', path: 'requests', icon: Clock3 },
        { label: 'Approved', path: 'approved', icon: CheckCircle2 },
        { label: 'Disapproved', path: 'disapproved', icon: XCircle },
    ];

    const columns = useMemo(
        () => [
            {
                field: "customerCreatedDate",
                header: "Request Date",
                template: (props) => (
                    <span>
                        {dayjs(props.customerCreatedDate).format("DD-MM-YYYY")}
                    </span>
                ),
            },
            {
                field: "customerMail",
                header: "Email",
            },
            {
                field: "customerPersonalName",
                header: "Customer Name",
            },
            {
                field: "customerMobile",
                header: "Phone",
            }, 
            {
                field: "customerName",
                header: "Company Name",
            }
        ],
        []
    );

    const handleDoubleClick = (item) => {
        const id = item.customerId;
        navigate(`/admin/users/${tabType}/${id}`, {
            state: { item },
        });
    };

    const handleSelect = (item) => {
        setSelectedItem(item);
    };

    // Filter items client-side using localFilter prop of SmartInfiniteList
    const localFilter = (item) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
            (item.customerPersonalName || '').toLowerCase().includes(s) ||
            (item.customerName || '').toLowerCase().includes(s) ||
            (item.customerMail || '').toLowerCase().includes(s) ||
            (item.customerMobile || '').toLowerCase().includes(s)
        );
    };

    return (
        <div className="space-y-6">
            <RequestsFilters
                search={search}
                setSearch={setSearch}
                tabs={tabs}
            />
            <RequestsTable
                queryKey={queryKey}
                fetchData={fetchData}
                columns={columns}
                onDoubleClick={handleDoubleClick}
                onSelect={handleSelect}
                selectedItem={selectedItem}
                setCount={setCount}
                searchQuery={search}
                localFilter={localFilter}
            />
        </div>
    );
}
