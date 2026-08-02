import React from 'react';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

export default function CustomerInfo({ customer }) {
    if (!customer) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold border-b pb-2 text-[#49494A]">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-50 text-[#6b6b6b]">
                        <User size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Full Name</p>
                        <p className="text-sm font-medium text-[#1f1f1f]">{customer.customerPersonalName || 'N/A'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-50 text-[#6b6b6b]">
                        <Mail size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Email Address</p>
                        <p className="text-sm font-medium text-[#1f1f1f] break-all">{customer.customerMail || 'N/A'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-50 text-[#6b6b6b]">
                        <Phone size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Mobile Phone</p>
                        <p className="text-sm font-medium text-[#1f1f1f]">{customer.customerMobile || 'N/A'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-50 text-[#6b6b6b]">
                        <Calendar size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Request Date</p>
                        <p className="text-sm font-medium text-[#1f1f1f]">
                            {customer.customerCreatedDate ? dayjs(customer.customerCreatedDate).format("DD-MM-YYYY HH:mm") : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
