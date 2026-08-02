import React, { useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ApproveCustomer, DisapproveCustomer } from '../../../../assets/apis/Admin/AdminApi';

const colors = {
    primary: '#C5A76D',
    secondary: '#49494A',
    lightGray: '#E5E5E5',
};

export default function ApprovalActions({ customerId, currentStatus, onActionComplete }) {
    const [remarks, setRemarks] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            await ApproveCustomer(customerId, remarks);
            toast.success("Customer approved successfully!");
            setRemarks('');
            if (onActionComplete) onActionComplete();
        } catch (error) {
            console.error("Approve failed:", error);
            toast.error(error.response?.data?.message || "Failed to approve customer.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisapprove = async () => {
        setIsLoading(true);
        try {
            await DisapproveCustomer(customerId, remarks);
            toast.success("Customer disapproved successfully!");
            setRemarks('');
            if (onActionComplete) onActionComplete();
        } catch (error) {
            console.error("Disapprove failed:", error);
            toast.error(error.response?.data?.message || "Failed to disapprove customer.");
        } finally {
            setIsLoading(false);
        }
    };

    const normalizedStatus = String(currentStatus || '').toLowerCase();
    const showApprove = normalizedStatus !== 'approved';
    const showDisapprove = normalizedStatus !== 'rejected' && normalizedStatus !== 'disapproved';

    return (
        <div className="space-y-4 pt-4 border-t" style={{ borderColor: colors.lightGray }}>
            <div>
                <label htmlFor="remarks" className="block text-xs font-semibold text-[#49494A] uppercase tracking-wider mb-2">
                    Action Remarks / Notes
                </label>
                <textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter remarks or reasoning for approval/disapproval..."
                    className="w-full min-h-[80px] p-3 rounded-2xl border text-sm outline-none resize-y placeholder:text-gray-300 focus:border-[#C5A76D] transition"
                    style={{ borderColor: colors.lightGray }}
                    disabled={isLoading}
                />
            </div>

            <div className="flex gap-3">
                {showApprove && (
                    <button
                        onClick={handleApprove}
                        disabled={isLoading}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
                        style={{ backgroundColor: colors.primary }}
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        Approve
                    </button>
                )}
                {showDisapprove && (
                    <button
                        onClick={handleDisapprove}
                        disabled={isLoading}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-semibold transition hover:bg-[#f8f8f8] disabled:opacity-60"
                        style={{ borderColor: colors.lightGray, color: colors.secondary }}
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                        Disapprove
                    </button>
                )}
            </div>
        </div>
    );
}
