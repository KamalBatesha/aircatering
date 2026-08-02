import React from 'react';
import { Building2, MapPin, Globe } from 'lucide-react';

export default function CompanyInfo({ customer }) {
    if (!customer) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold border-b pb-2 text-[#49494A]">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-50 text-[#6b6b6b]">
                        <Building2 size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Company Name</p>
                        <p className="text-sm font-medium text-[#1f1f1f]">{customer.customerName || 'N/A'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-50 text-[#6b6b6b]">
                        <MapPin size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Address/Location</p>
                        <p className="text-sm font-medium text-[#1f1f1f]">{customer.customerAddress || 'Cairo, Egypt'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-50 text-[#6b6b6b]">
                        <Globe size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Website</p>
                        <p className="text-sm font-medium text-[#1f1f1f]">{customer.customerWebsite || 'www.company.com'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-50 text-[#6b6b6b]">
                        <Building2 size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Customer ID</p>
                        <p className="text-sm font-medium text-[#1f1f1f] uppercase tracking-wide">{customer.customerId}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
