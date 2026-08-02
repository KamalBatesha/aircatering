import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import ApprovalActions from './ApprovalActions';
import { ArrowLeft, Edit2, Save, X, Loader2, CreditCard, Landmark } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { UpdateMyInfo } from '../../../../assets/apis/auth/AuthApi';
import CustomLookup from '../../../../components/HelperComponents/CustomLookup';

import {
    GetFlightNumbersList,
    GetRegisterationList,
    GetAirCraftList,
    GetAgentsList,
    GetOperatorsList,
    GetBillToList,
    GetInvoiceToList,
} from '../../../../assets/apis/SalesAPI';

import { GetPayTypes } from '../../../../assets/apis/PurchasingAPI';

const colors = {
    primary: '#C5A76D',
    secondary: '#49494A',
    gray: '#6b6b6b',
    lightGray: '#E5E5E5',
};

// ─── Reusable field display component ────────────────────────────────────────
function ReadField({ label, value }) {
    const display =
        value !== null && value !== undefined && String(value).trim() !== ''
            ? String(value)
            : 'N/A';
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-[#1f1f1f] mt-0.5">{display}</p>
            </div>
        </div>
    );
}

// ─── Reusable section heading ─────────────────────────────────────────────────
function SectionTitle({ children }) {
    return (
        <h3
            className="text-base font-semibold border-b pb-2"
            style={{ color: colors.secondary, borderColor: colors.lightGray }}
        >
            {children}
        </h3>
    );
}

// ─── Reusable text input ──────────────────────────────────────────────────────
function EditInput({ label, value, onChange, type = 'text', colSpan = '' }) {
    return (
        <div className={colSpan}>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">{label}</label>
            <input
                type={type}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-sm outline-none focus:border-[#C5A76D] transition"
                style={{ borderColor: colors.lightGray }}
            />
        </div>
    );
}

// ─── Checkbox with label ──────────────────────────────────────────────────────
function CheckOption({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 text-sm text-[#49494A] cursor-pointer select-none">
            <input
                type="checkbox"
                checked={!!checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 rounded accent-[#C5A76D]"
            />
            {label}
        </label>
    );
}

// ─── Lookup wrapper that uses the existing CustomLookup ───────────────────────
function FieldLookup({ label, options, value, onChange, getOptionLabel, getOptionValue }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">{label}</label>
            <CustomLookup
                options={options || []}
                value={value}
                onChange={onChange}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
            />
        </div>
    );
}

// ─── Status Pill ──────────────────────────────────────────────────────────────
function StatusPill({ status }) {
    const styles = {
        Pending: { bg: '#F7F3EA', fg: colors.primary, border: 'rgba(197,167,109,0.28)' },
        underprocedure: { bg: '#F7F3EA', fg: colors.primary, border: 'rgba(197,167,109,0.28)' },
        Approved: { bg: '#EEF6F0', fg: '#2F7D46', border: 'rgba(47,125,70,0.18)' },
        approved: { bg: '#EEF6F0', fg: '#2F7D46', border: 'rgba(47,125,70,0.18)' },
        Disapproved: { bg: '#FAECEC', fg: '#B54848', border: 'rgba(181,72,72,0.18)' },
        rejected: { bg: '#FAECEC', fg: '#B54848', border: 'rgba(181,72,72,0.18)' },
    }[status] || { bg: '#EFEFEF', fg: colors.gray, border: colors.lightGray };

    return (
        <span
            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: styles.bg, color: styles.fg, borderColor: styles.border }}
        >
            {status}
        </span>
    );
}

// ─── Payment method type constants ────────────────────────────────────────────
const PAYMENT_VISA = 'visa';
const PAYMENT_BANK = 'bank';

// ─── Helper: infer payment category from name ─────────────────────────────────
function inferPaymentType(name = '') {
    const n = name.toLowerCase();
    if (n.includes('visa') || n.includes('card') || n.includes('credit') || n.includes('debit')) return PAYMENT_VISA;
    if (n.includes('bank') || n.includes('iban') || n.includes('transfer') || n.includes('ach')) return PAYMENT_BANK;
    return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientDetails() {
    const { tabType, customerId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const statusMap = {
        requests: 'underprocedure',
        approved: 'approved',
        disapproved: 'rejected',
    };
    const apiStatus = statusMap[tabType] || 'underprocedure';

    const cachedList = queryClient.getQueryData(['MenuRequestsList', tabType]) || [];
    const customer = cachedList.find(c => String(c.customerId) === String(customerId)) || location.state?.item;

    // ── Dropdown data (same queries as CreateOrderModal) ──────────────────
    const { data: flightNumbers } = useQuery({ queryKey: ['flightNumbers'], queryFn: GetFlightNumbersList });
    const { data: registrations } = useQuery({ queryKey: ['registrations'], queryFn: GetRegisterationList });
    const { data: airCrafts } = useQuery({ queryKey: ['airCrafts'], queryFn: GetAirCraftList });
    const { data: agents } = useQuery({ queryKey: ['agents'], queryFn: GetAgentsList });
    const { data: operators } = useQuery({ queryKey: ['operators'], queryFn: GetOperatorsList });
    const { data: billToList } = useQuery({ queryKey: ['billTo'], queryFn: GetBillToList });
    const { data: invoiceToList } = useQuery({ queryKey: ['invoiceTo'], queryFn: GetInvoiceToList });
    const { data: payTypes } = useQuery({ queryKey: ['payTypes'], queryFn: GetPayTypes });

    // ── Edit form state ───────────────────────────────────────────────────
    const [editForm, setEditForm] = useState({});

    const set = (field) => (value) => setEditForm(prev => ({ ...prev, [field]: value }));

    // Resolve label from a dropdown list
    const resolveLabel = (list, id, getId, getLabel) => {
        if (!list || !id) return null;
        const found = list.find(item => getId(item) === id);
        return found ? getLabel(found) : null;
    };

    const handleBack = () => navigate(`/admin/users/${tabType}`);

    const handleActionComplete = () => {
        queryClient.invalidateQueries({ queryKey: ['MenuRequestsList'] });
        handleBack();
    };

    const handleStartEdit = () => {
        setEditForm({
            // Personal
            customerId: customer.customerId,
            customerPersonalName: customer.customerPersonalName || '',
            customerMail: customer.customerMail || '',
            customerMobile: customer.customerMobile || '',
            customerPhone: customer.customerPhone || '',
            // Company
            customerName: customer.customerName || '',
            customerAddress: customer.customerAddress || '',
            customerRemark: customer.customerRemark || '',
            customerPercentageToPay: customer.customerPercentageToPay || 0,
            // Flight
            flightNumber: customer.flightNumber || null,
            registration: customer.registration || null,
            aircraftType: customer.aircraftType || null,
            // Customer config
            agent: customer.agent || null,
            agentVisible: customer.agentVisible ?? true,
            agentRequired: customer.agentRequired ?? false,
            operator: customer.operator || null,
            operatorVisible: customer.operatorVisible ?? true,
            operatorRequired: customer.operatorRequired ?? false,
            billTo: customer.billTo || null,
            invoiceTo: customer.invoiceTo || null,
            paymentMethod: customer.paymentMethod || null,
            // Payment – Card
            cardholderName: customer.cardholderName || '',
            cardNumber: customer.cardNumber || '',
            cardExpiry: customer.cardExpiry || '',
            cardCvv: customer.cardCvv || '',
            cardBillingAddress: customer.cardBillingAddress || '',
            // Payment – Bank
            bankAccountHolder: customer.bankAccountHolder || '',
            bankIban: customer.bankIban || '',
            bankBic: customer.bankBic || '',
        });
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        setIsSaving(true);
        try {
            await UpdateMyInfo(editForm);
            toast.success('Customer details updated successfully!');
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['MenuRequestsList'] });
        } catch (error) {
            console.error('Save edit failed:', error);
            toast.error(error.response?.data?.message || 'Failed to update customer details.');
        } finally {
            setIsSaving(false);
        }
    };

    // ── Resolve display labels for read mode ──────────────────────────────
    const resolvedFlightNumber = resolveLabel(flightNumbers, customer?.flightNumber, o => o.flightNumberId, o => o.flightNumberName);
    const resolvedRegistration = resolveLabel(registrations, customer?.registration, o => o.registrationId, o => o.registrationName);
    const resolvedAircraftType = resolveLabel(airCrafts, customer?.aircraftType, o => o.actypeId, o => o.actypeName);
    const resolvedAgent = resolveLabel(agents, customer?.agent, o => o.agentId, o => o.agentName);
    const resolvedOperator = resolveLabel(operators, customer?.operator, o => o.operatorId, o => o.operatorName);
    const resolvedBillTo = resolveLabel(billToList, customer?.billTo, o => o.billToid, o => o.billToname);
    const resolvedInvoiceTo = resolveLabel(invoiceToList, customer?.invoiceTo, o => o.invoicingToId, o => o.invoicingToName);
    const resolvedPaymentMethod = resolveLabel(payTypes, customer?.paymentMethod, o => o.cashTransactionTypeId, o => o.cashTransactionTypeName);

    // Infer payment category for read and edit modes
    const activePaymentType = inferPaymentType(resolvedPaymentMethod || '');
    const editPaymentType = inferPaymentType(
        (payTypes || []).find(p => p.cashTransactionTypeId === editForm.paymentMethod)?.cashTransactionTypeName || ''
    );

    // ── Not found state ───────────────────────────────────────────────────
    if (!customer) {
        return (
            <div className="rounded-3xl border bg-white p-8 text-center space-y-4" style={{ borderColor: colors.lightGray }}>
                <p className="text-sm text-gray-500">Retrieving customer details...</p>
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition"
                    style={{ color: colors.primary }}
                >
                    <ArrowLeft size={16} /> Return to list
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border bg-white p-6 shadow-sm space-y-6" style={{ borderColor: colors.lightGray }}>

            {/* ── Top Toolbar ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: colors.lightGray }}>
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition text-[#49494A]"
                >
                    <ArrowLeft size={16} /> Back to Requests
                </button>
                <div className="flex items-center gap-3">
                    <StatusPill status={customer.customerApproveTest || customer.status || apiStatus} />
                    {!isEditing && (
                        <button
                            onClick={handleStartEdit}
                            className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition hover:bg-gray-50 text-[#49494A]"
                            style={{ borderColor: colors.lightGray }}
                        >
                            <Edit2 size={12} /> Edit
                        </button>
                    )}
                </div>
            </div>

            {/* ── Title Block ──────────────────────────────────────────── */}
            <div>
                <span className="text-xs uppercase tracking-widest text-gray-400">Client Profile</span>
                <h2 className="text-2xl font-bold text-[#1f1f1f] mt-1">
                    {customer.customerPersonalName || customer.customerName}
                </h2>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* EDIT MODE                                                  */}
            {/* ══════════════════════════════════════════════════════════ */}
            {isEditing ? (
                <div className="space-y-8 border-b pb-6" style={{ borderColor: colors.lightGray }}>

                    {/* 1 · Personal Information */}
                    <div className="space-y-4">
                        <SectionTitle>Personal Information</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditInput label="Personal Name" value={editForm.customerPersonalName} onChange={set('customerPersonalName')} />
                            <EditInput label="Email Address" value={editForm.customerMail} onChange={set('customerMail')} type="email" />
                            <EditInput label="Mobile Phone" value={editForm.customerMobile} onChange={set('customerMobile')} />
                            <EditInput label="Landline Phone" value={editForm.customerPhone} onChange={set('customerPhone')} />
                        </div>
                    </div>

                    {/* 2 · Company Information */}
                    <div className="space-y-4">
                        <SectionTitle>Company Information</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditInput label="Company Name" value={editForm.customerName} onChange={set('customerName')} />
                            <EditInput label="Percentage To Pay" value={editForm.customerPercentageToPay} onChange={(v) => set('customerPercentageToPay')(Number(v))} type="number" />
                            <div className="md:col-span-2">
                                <EditInput label="Address" value={editForm.customerAddress} onChange={set('customerAddress')} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Remarks</label>
                                <textarea
                                    value={editForm.customerRemark}
                                    onChange={(e) => set('customerRemark')(e.target.value)}
                                    className="w-full min-h-[60px] p-2.5 rounded-xl border text-sm outline-none resize-y focus:border-[#C5A76D] transition"
                                    style={{ borderColor: colors.lightGray }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3 · Flight Information */}
                    <div className="space-y-4">
                        <SectionTitle>Flight Information</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FieldLookup
                                label="Flight Number"
                                options={flightNumbers}
                                value={editForm.flightNumber}
                                onChange={set('flightNumber')}
                                getOptionLabel={o => o.flightNumberName}
                                getOptionValue={o => o.flightNumberId}
                            />
                            <FieldLookup
                                label="Registration"
                                options={registrations}
                                value={editForm.registration}
                                onChange={set('registration')}
                                getOptionLabel={o => o.registrationName}
                                getOptionValue={o => o.registrationId}
                            />
                            <FieldLookup
                                label="Aircraft Type"
                                options={airCrafts}
                                value={editForm.aircraftType}
                                onChange={set('aircraftType')}
                                getOptionLabel={o => o.actypeName}
                                getOptionValue={o => o.actypeId}
                            />
                        </div>
                    </div>

                    {/* 4 · Order Default Settings */}
                    <div className="space-y-4">
                        <SectionTitle>Order Default Settings</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Agent */}
                            <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: colors.lightGray }}>
                                <FieldLookup
                                    label="Agent"
                                    options={agents}
                                    value={editForm.agent}
                                    onChange={set('agent')}
                                    getOptionLabel={o => o.agentName}
                                    getOptionValue={o => o.agentId}
                                />
                                <div className="flex gap-4 pt-1">
                                    <CheckOption label="Visible" checked={editForm.agentVisible} onChange={set('agentVisible')} />
                                    <CheckOption label="Required" checked={editForm.agentRequired} onChange={set('agentRequired')} />
                                </div>
                            </div>

                            {/* Operator */}
                            <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: colors.lightGray }}>
                                <FieldLookup
                                    label="Operator"
                                    options={operators}
                                    value={editForm.operator}
                                    onChange={set('operator')}
                                    getOptionLabel={o => o.operatorName}
                                    getOptionValue={o => o.operatorId}
                                />
                                <div className="flex gap-4 pt-1">
                                    <CheckOption label="Visible" checked={editForm.operatorVisible} onChange={set('operatorVisible')} />
                                    <CheckOption label="Required" checked={editForm.operatorRequired} onChange={set('operatorRequired')} />
                                </div>
                            </div>

                            {/* Bill To */}
                            <FieldLookup
                                label="Bill To"
                                options={billToList}
                                value={editForm.billTo}
                                onChange={set('billTo')}
                                getOptionLabel={o => o.billToname}
                                getOptionValue={o => o.billToid}
                            />

                            {/* Invoice To */}
                            <FieldLookup
                                label="Invoice To"
                                options={invoiceToList}
                                value={editForm.invoiceTo}
                                onChange={set('invoiceTo')}
                                getOptionLabel={o => o.invoicingToName}
                                getOptionValue={o => o.invoicingToId}
                            />

                            {/* Payment Method */}
                            <div className="md:col-span-2">
                                <FieldLookup
                                    label="Payment Method"
                                    options={payTypes}
                                    value={editForm.paymentMethod}
                                    onChange={set('paymentMethod')}
                                    getOptionLabel={o => o.cashTransactionTypeName}
                                    getOptionValue={o => o.cashTransactionTypeId}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5 · Payment Information (conditional on selected payment method) */}
                    {/* {editPaymentType === PAYMENT_VISA && ( */}
                    <div className="space-y-4">
                        <SectionTitle>Payment Information — Card</SectionTitle>
                        <div className="rounded-xl border p-4 space-y-4" style={{ borderColor: colors.lightGray }}>
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCard size={16} style={{ color: colors.primary }} />
                                <span className="text-sm font-semibold text-[#49494A]">Visa / Credit or Debit Card</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <EditInput label="Cardholder Name" value={editForm.cardholderName} onChange={set('cardholderName')} />
                                </div>
                                <EditInput label="Card Number" value={editForm.cardNumber} onChange={set('cardNumber')} />
                                <EditInput label="Expiration Date" value={editForm.cardExpiry} onChange={set('cardExpiry')} />
                                <EditInput label="CVV / CVC" value={editForm.cardCvv} onChange={set('cardCvv')} />
                                <div className="md:col-span-2">
                                    <EditInput label="Billing Address" value={editForm.cardBillingAddress} onChange={set('cardBillingAddress')} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* )} */}

                    {/* {editPaymentType === PAYMENT_BANK && ( */}
                    <div className="space-y-4">
                        <SectionTitle>Payment Information — Bank Transfer</SectionTitle>
                        <div className="rounded-xl border p-4 space-y-4" style={{ borderColor: colors.lightGray }}>
                            <div className="flex items-center gap-2 mb-1">
                                <Landmark size={16} style={{ color: colors.primary }} />
                                <span className="text-sm font-semibold text-[#49494A]">Bank Payment (Direct Transfer / ACH / IBAN)</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <EditInput label="Account Holder Name" value={editForm.bankAccountHolder} onChange={set('bankAccountHolder')} />
                                </div>
                                <EditInput label="IBAN" value={editForm.bankIban} onChange={set('bankIban')} />
                                <EditInput label="BIC / SWIFT Code" value={editForm.bankBic} onChange={set('bankBic')} />
                            </div>
                        </div>
                    </div>
                    {/* )} */}

                    {/* Save / Cancel bar */}
                    <div className="flex gap-2 justify-end pt-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            disabled={isSaving}
                            className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-gray-50 text-[#49494A]"
                            style={{ borderColor: colors.lightGray }}
                        >
                            <X size={16} /> Cancel
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            disabled={isSaving}
                            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
                            style={{ backgroundColor: colors.primary }}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </div>

            ) : (

                /* ════════════════════════════════════════════════════════
                   READ MODE
                   ════════════════════════════════════════════════════════ */
                <div className="space-y-8 border-b pb-6" style={{ borderColor: colors.lightGray }}>

                    {/* 1 · Personal Information */}
                    <div className="space-y-4">
                        <SectionTitle>Personal Information</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReadField label="Personal Name" value={customer.customerPersonalName} />
                            <ReadField label="Email Address" value={customer.customerMail} />
                            <ReadField label="Mobile Phone" value={customer.customerMobile} />
                            <ReadField label="Landline Phone" value={customer.customerPhone} />
                        </div>
                    </div>

                    {/* 2 · Company Information */}
                    <div className="space-y-4">
                        <SectionTitle>Company Information</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReadField label="Company Name" value={customer.customerName} />
                            <ReadField label="Address" value={customer.customerAddress} />
                            <ReadField label="Percentage to Pay" value={customer.customerPercentageToPay != null ? `${customer.customerPercentageToPay}%` : null} />
                        </div>
                    </div>

                    {/* 3 · Flight Information */}
                    <div className="space-y-4">
                        <SectionTitle>Flight Information</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ReadField label="Flight Number" value={resolvedFlightNumber} />
                            <ReadField label="Registration" value={resolvedRegistration} />
                            <ReadField label="Aircraft Type" value={resolvedAircraftType} />
                        </div>
                    </div>

                    {/* 4 · Order Default Settings */}
                    <div className="space-y-4">
                        <SectionTitle>Order Default Settings</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReadField label="Agent" value={resolvedAgent} />
                            <ReadField label="Operator" value={resolvedOperator} />
                            <ReadField label="Bill To" value={resolvedBillTo} />
                            <ReadField label="Invoice To" value={resolvedInvoiceTo} />
                            <ReadField label="Payment Method" value={resolvedPaymentMethod} />
                        </div>
                    </div>

                    {/* 5 · Payment Information (conditional) */}
                    {/* {activePaymentType === PAYMENT_VISA && ( */}
                    <div className="space-y-4">
                        <SectionTitle>Payment Information — Card</SectionTitle>
                        <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: colors.lightGray }}>
                            <div className="flex items-center gap-2 mb-3">
                                <CreditCard size={16} style={{ color: colors.primary }} />
                                <span className="text-sm font-semibold text-[#49494A]">Visa / Credit or Debit Card</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ReadField label="Cardholder Name" value={customer.cardholderName} />
                                <ReadField label="Card Number" value={customer.cardNumber} />
                                <ReadField label="Expiry Date" value={customer.cardExpiry} />
                                <ReadField label="CVV / CVC" value={customer.cardCvv} />
                                <ReadField label="Billing Address" value={customer.cardBillingAddress} />
                            </div>
                        </div>
                    </div>
                    {/* )} */}

                    {/* {activePaymentType === PAYMENT_BANK && ( */}
                    <div className="space-y-4">
                        <SectionTitle>Payment Information — Bank Transfer</SectionTitle>
                        <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: colors.lightGray }}>
                            <div className="flex items-center gap-2 mb-3">
                                <Landmark size={16} style={{ color: colors.primary }} />
                                <span className="text-sm font-semibold text-[#49494A]">Bank Payment (Direct Transfer / ACH / IBAN)</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ReadField label="Account Holder" value={customer.bankAccountHolder} />
                                <ReadField label="IBAN" value={customer.bankIban} />
                                <ReadField label="BIC / SWIFT" value={customer.bankBic} />
                            </div>
                        </div>
                    </div>
                    {/* )} */}

                    {/* 6 · Request Details */}
                    <div className="space-y-4">
                        <SectionTitle>Request Details</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReadField label="Customer ID" value={customer.customerId} />
                            <ReadField label="Created Date" value={customer.customerCreatedDate ? dayjs(customer.customerCreatedDate).format('DD-MM-YYYY HH:mm') : null} />
                            <ReadField label="Created By" value={customer.customerCreatedBy} />
                            <ReadField label={tabType === 'disapproved' ? 'Rejected By' : 'Approved By'} value={customer.customerApprovedBy} />
                            <ReadField label="Approval Date" value={customer.customerApproveDate ? dayjs(customer.customerApproveDate).format('DD-MM-YYYY HH:mm') : null} />
                            <ReadField label="Remarks" value={customer.customerRemark} />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Approval Actions ─────────────────────────────────────── */}
            <ApprovalActions
                customerId={customer.customerId}
                currentStatus={customer.customerApproveTest || customer.status}
                onActionComplete={handleActionComplete}
            />
        </div>
    );
}
