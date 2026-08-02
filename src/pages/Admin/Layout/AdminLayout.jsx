import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuthStore from '../../../assets/store/authStore';

export default function AdminLayout() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuthStore();
    const Navigate = useNavigate();

    // Map path to friendly names for header title
    const getTitle = () => {
        const path = location.pathname;
        if (path.includes('/admin/users')) return 'User Requests Management';
        if (path.includes('/admin/dashboard')) return 'Admin Dashboard';
        if (path.includes('/admin/erp')) return 'ERP Modules Configuration';
        if (path.includes('/admin/settings')) return 'Admin Settings';
        return 'Admin Panel';
    };
    useEffect(() => {
        console.log("hi from admin 1");
        if (!user?.roles?.includes("Marketing")) {
            console.log("hi from admin 2");
            Navigate("/home")
            console.log("hi from admin 3");
        }
    }, [user, location.pathname])

    return (
        <div className="min-h-screen flex bg-[#F7F7F5] text-[#1f1f1f]">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Modal/Overlay */}
            {isMobileSidebarOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                    {/* Drawer */}
                    <div className="relative flex w-full max-w-xs flex-col bg-white shadow-xl animate-in slide-in-from-left duration-200">
                        <Sidebar onMobileClose={() => setIsMobileSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    onMenuClick={() => setIsMobileSidebarOpen(true)}
                    title={getTitle()}
                />

                {/* Scrollable Content Container */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
