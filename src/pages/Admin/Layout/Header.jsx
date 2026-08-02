import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import useAuthStore from '../../../assets/store/authStore';

const colors = {
    primary: '#C5A76D',
    secondary: '#49494A',
    gray: '#6b6b6b',
    lightGray: '#E5E5E5',
};

export default function Header({ onMenuClick, title = "Admin Panel" }) {
    const { user } = useAuthStore();
    console.log("user", user);
    return (
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between shrink-0" style={{ borderColor: colors.lightGray }}>
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition"
                    aria-label="Toggle Sidebar"
                >
                    <Menu size={20} style={{ color: colors.secondary }} />
                </button>
                <h1 className="text-lg font-semibold text-[#1f1f1f]">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-xl hover:bg-gray-100 transition relative" aria-label="Notifications">
                    <Bell size={20} style={{ color: colors.gray }} />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                </button>
                <div className="flex items-center gap-2 border-l pl-4" style={{ borderColor: colors.lightGray }}>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold" style={{ color: colors.secondary }}>
                        <User size={16} />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium" style={{ color: colors.secondary }}>{user?.userName || "Admin User"}</span>
                </div>
            </div>
        </header>
    );
}
