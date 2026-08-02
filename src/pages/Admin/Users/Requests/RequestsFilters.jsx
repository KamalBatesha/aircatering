import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const colors = {
    primary: '#C5A76D',
    secondary: '#49494A',
    gray: '#6b6b6b',
    lightGray: '#E5E5E5',
};

export default function RequestsFilters({
    search,
    setSearch,
    tabs = []
}) {
    return (
        <div className="rounded-3xl border bg-white p-5 shadow-sm space-y-4" style={{ borderColor: colors.lightGray }}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">User Requests Management</h2>
                    <p className="mt-1 text-sm text-[#6b6b6b]">
                        Review incoming requests, approve verified users, or disapprove invalid submissions.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex items-center gap-2 rounded-2xl border bg-[#fcfcfc] px-4 py-3" style={{ borderColor: colors.lightGray }}>
                        <Search size={16} style={{ color: colors.gray }} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, phone or company"
                            className="w-full bg-transparent text-sm outline-none placeholder:text-[#9b9b9b] sm:w-72"
                        />
                    </div>
                    {/* <button className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition hover:bg-[#f8f8f8]" style={{ borderColor: colors.lightGray, color: colors.secondary }}>
                        <Filter size={16} /> Filter
                    </button> */}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 rounded-3xl bg-[#F6F4EF] p-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <NavLink
                            key={tab.path}
                            to={`/admin/users/${tab.path}`}
                            className={({ isActive }) =>
                                `flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition border border-transparent`
                            }
                            style={({ isActive }) => ({
                                backgroundColor: isActive ? 'white' : 'transparent',
                                color: isActive ? colors.secondary : colors.gray,
                                boxShadow: isActive ? '0 8px 22px rgba(0,0,0,0.06)' : 'none',
                            })}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
}
