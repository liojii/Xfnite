"use client";

interface ConfirmPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  providerName?: string;
  payeeName: string;
  payeeUid: string;
}

export default function ConfirmPaymentModal({ isOpen, onClose, onConfirm, providerName, payeeName, payeeUid }: ConfirmPaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0D1B2A] rounded-xl shadow-xl w-full max-w-md border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#0D1B2A] dark:text-[#E0E1DD] mb-2">
            Confirm Payment Details
          </h2>
          <p className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/70 mb-5">
            Please verify that your account information is correct. Incorrect details may result in payout delays or lost funds.
          </p>
          
          <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 space-y-4 border border-gray-100 dark:border-white/10">
            <div>
              <p className="text-xs text-[#2F3E46] dark:text-[#E0E1DD]/50 mb-1">Method</p>
              <p className="text-sm font-semibold text-[#0D1B2A] dark:text-[#E0E1DD]">{providerName || 'Not Selected'}</p>
            </div>
            <div>
              <p className="text-xs text-[#2F3E46] dark:text-[#E0E1DD]/50 mb-1">Account Name</p>
              <p className="text-sm font-semibold text-[#0D1B2A] dark:text-[#E0E1DD]">{payeeName || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[#2F3E46] dark:text-[#E0E1DD]/50 mb-1">Account Details / UID</p>
              <p className="text-sm font-semibold text-[#0D1B2A] dark:text-[#E0E1DD] break-all">{payeeUid || '-'}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#1B263B]/10 dark:border-[#E0E1DD]/10 p-4 flex justify-end gap-3 bg-gray-50 dark:bg-[#060D14]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#1B263B]/20 dark:border-[#E0E1DD]/20 bg-white dark:bg-[#1B263B] px-4 py-2 text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD] hover:bg-gray-50 dark:hover:bg-[#1B263B]/80 transition-colors shadow-sm"
          >
            Review Again
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-md bg-[#1F7A1F] hover:bg-[#145214] dark:bg-[#55f761] dark:hover:bg-[#3de34a] px-4 py-2 text-sm font-bold text-white dark:text-[#060D14] transition-colors shadow-sm"
          >
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
}
