import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, LayoutDashboard, Settings, Layers, X } from 'lucide-react';

const colors = {
    primary: '#C5A76D',
    secondary: '#49494A',
    gray: '#6b6b6b',
    lightGray: '#E5E5E5',
};

export default function Sidebar({ onMobileClose }) {
    const menuItems = [
        // { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Users', path: '/admin/users', icon: Users },
        // { label: 'ERP Modules', path: '/admin/erp', icon: Layers },
        // { label: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <aside className="w-full h-full border-r bg-white p-6 flex flex-col" style={{ borderColor: colors.lightGray }}>
            <div className="flex items-center justify-between pb-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: colors.primary, color: 'white' }}>
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.16em]" style={{ color: colors.gray }}>
                            Admin Panel
                        </p>
                        <h1 className="text-xl font-semibold">Air Catering</h1>
                    </div>
                </div>
                {onMobileClose && (
                    <button
                        onClick={onMobileClose}
                        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition text-[#49494A]"
                        aria-label="Close Sidebar"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <nav className="space-y-2 flex-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onMobileClose}
                            className={({ isActive }) =>
                                `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-semibold transition border ${isActive
                                    ? 'bg-[#FBF8F1] text-[#49494A] border-[#E5E5E5]'
                                    : 'text-[#6b6b6b] border-transparent hover:bg-[#F9F9F9]'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}
