"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ConfirmPaymentModal from "@/app/components/ConfirmPaymentModal";

const PAYMENT_PROVIDERS = [
  {
    id: "gcash",
    name: "GCash",
    icon: (
      <img src="/gcash.png" alt="GCash" className="w-8 h-8 object-contain dark:bg-white dark:p-1 dark:rounded-md" />
    )
  },
  {
    id: "maya",
    name: "Maya",
    icon: (
      <img src="/maya.png" alt="Maya" className="w-12 h-8 object-contain scale-[1.3] translate-y-1.5" />
    )
  },
  {
    id: "binance",
    name: "Binance",
    icon: (
      <svg className="w-8 h-8 text-[#F3BA2F]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 6L16 10L12 14L8 10L12 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 18L14 16M12 18L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: (
      <svg className="w-8 h-8 text-[#0079C1] dark:text-[#009CDE]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 6H9C8.44772 6 8 6.44772 8 7V17H11.5L12.5 12H15.5C17.433 12 19 10.433 19 8.5C19 6.567 17.433 6 15.5 6H14Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M14 6H9C8.44772 6 8 6.44772 8 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.5 17L12.5 12H15.5C17.433 12 19 10.433 19 8.5C19 6.567 17.433 6 15.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 10H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 10V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 10V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 10V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3L2 8V10H22V8L12 3Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

export default function EarningsPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState<"earnings" | "payment">("earnings");
  const [paymentStep, setPaymentStep] = useState<1 | 2>(1);

  // Payment Details State
  const [payeeName, setPayeeName] = useState("");
  const [payeeUid, setPayeeUid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Income State
  const [currentIncome, setCurrentIncome] = useState<any>(null);
  const [incomeHistory, setIncomeHistory] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("scrapedGingerData");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const userEmail = parsed?.user?.email || parsed?.email;
        if (userEmail) {
          setEmail(userEmail);
          fetchData(userEmail);
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchData = async (userEmail: string) => {
    setIsLoading(true);
    try {
      const payRes = await fetch(`/api/user/payment?email=${encodeURIComponent(userEmail)}`);
      const payData = await payRes.json();
      if (payData.success && payData.data) {
        setPayeeName(payData.data.payeeName || "");
        setPayeeUid(payData.data.payeeUid || "");

        if (payData.data.paymentMethod) {
          setPaymentMethod(payData.data.paymentMethod);
          setPaymentStep(2);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } else {
        setIsEditing(true);
      }

      const incRes = await fetch(`/api/user/income?email=${encodeURIComponent(userEmail)}`);
      const incData = await incRes.json();
      if (incData.success && incData.data) {
        setCurrentIncome(incData.data.current);
        setIncomeHistory(incData.data.history || []);
      }
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMethod = (methodId: string) => {
    setPaymentMethod(methodId);
    setPaymentStep(2);
  };

  const handleInitiateSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("User email not found");
    setShowConfirmModal(true);
  };

  const executeSavePayment = async () => {
    setShowConfirmModal(false);
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          payeeName,
          payeeUid,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Payment details saved successfully!");
        setIsEditing(false);
      } else {
        toast.error(data.error || "Failed to update payment details");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedProvider = PAYMENT_PROVIDERS.find(p => p.id === paymentMethod);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0D1B2A] dark:text-[#E0E1DD]">Earnings & Payments</h1>
        <p className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60 mt-1">
          Manage your payout methods and view your income history.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0D1B2A] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 rounded-tr-2xl rounded-bl-2xl shadow-sm overflow-hidden transition-colors duration-200">

        {/* Tabs */}
        <div className="p-5 pb-0 border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("earnings")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${activeTab === "earnings"
                ? 'bg-[#1B263B] dark:bg-[#E0E1DD] text-white dark:text-[#0D1B2A]'
                : 'text-[#2F3E46] dark:text-[#E0E1DD]/70 hover:bg-[#E0E1DD]/50 dark:hover:bg-[#1B263B]/50'
                }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${activeTab === "payment"
                ? 'bg-[#1B263B] dark:bg-[#E0E1DD] text-white dark:text-[#0D1B2A]'
                : 'text-[#2F3E46] dark:text-[#E0E1DD]/70 hover:bg-[#E0E1DD]/50 dark:hover:bg-[#1B263B]/50'
                }`}
            >
              Payment Method
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#2F3E46] dark:text-[#E0E1DD]/60">
            <div className="w-8 h-8 border-2 border-[#1F7A1F] border-t-transparent rounded-full animate-spin mb-3"></div>
            Loading data...
          </div>
        ) : (
          <div className="divide-y divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10">

            {/* EARNINGS TAB */}
            {activeTab === "earnings" && (
              <>
                {/* Current Income Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10">
                  <div className="grid grid-cols-[140px_1fr] p-5">
                    <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Current Cut-off</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">
                        ${currentIncome?.estimatedAmount?.toFixed(2) || "0.00"}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ${currentIncome?.status === "Pending Review"
                        ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                        : 'bg-[#1F7A1F]/10 border border-[#1F7A1F]/20 text-[#1F7A1F] dark:text-[#55f761]'
                        }`}>
                        {currentIncome?.status || "Accumulating"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] p-5">
                    <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Period</div>
                    <div className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">
                      {currentIncome?.currentPeriodStart ? new Date(currentIncome.currentPeriodStart).toLocaleDateString() : 'N/A'}
                      {' - '}
                      {currentIncome?.currentPeriodEnd ? new Date(currentIncome.currentPeriodEnd).toLocaleDateString() : 'Present'}
                    </div>
                  </div>
                </div>

                {/* History Section */}
                <div className="p-5">
                  <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-4">Payout History</div>
                  {incomeHistory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {incomeHistory.map((history, idx) => (
                        <div key={idx} className="flex flex-col p-4 bg-gray-50 dark:bg-[#060D14]/50 rounded-lg border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 shadow-sm">
                          <div className="text-xs text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">Date</div>
                          <div className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD] mb-3">
                            {history.payoutDate ? new Date(history.payoutDate).toLocaleDateString() : 'N/A'}
                          </div>

                          <div className="text-xs text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">Amount</div>
                          <div className="flex items-center justify-between text-sm font-mono font-medium text-[#1F7A1F] dark:text-[#55f761] bg-white dark:bg-[#0D1B2A] py-1.5 px-3 rounded border border-[#1B263B]/10 dark:border-[#E0E1DD]/10">
                            ${history.amountPaid?.toFixed(2)}
                            <span className="text-[10px] text-[#0D1B2A] dark:text-[#E0E1DD] font-sans px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 uppercase">
                              {history.status || "Paid"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-[#2F3E46]/50 dark:text-[#E0E1DD]/50">No history found.</div>
                  )}
                </div>
              </>
            )}

            {/* PAYMENT TAB */}
            {activeTab === "payment" && (
              <>
                {!isEditing && payeeUid && paymentMethod ? (
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Current Payment Method</div>
                      <button
                        onClick={() => { setIsEditing(true); setPaymentStep(2); }}
                        className="text-xs font-medium text-[#1F7A1F] dark:text-[#55f761] hover:underline"
                      >
                        Edit Details
                      </button>
                    </div>

                    <div className="divide-y divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10 border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 rounded-lg overflow-hidden bg-gray-50/30 dark:bg-white/[0.01]">
                      <div className="grid grid-cols-[140px_1fr] p-5 items-center">
                        <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Provider</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#0D1B2A] dark:text-[#E0E1DD] opacity-80 scale-75">
                            {selectedProvider?.icon}
                          </span>
                          <span className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">
                            {selectedProvider?.name}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] p-5 items-center">
                        <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Account Name</div>
                        <div className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">{payeeName}</div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] p-5 items-center">
                        <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Account Details</div>
                        <div className="text-sm font-mono font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">{payeeUid}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {paymentStep === 1 ? (
                      <div className="p-5">
                        <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-4">Select Payment Provider</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {PAYMENT_PROVIDERS.map((provider) => (
                            <button
                              key={provider.id}
                              onClick={() => handleSelectMethod(provider.id)}
                              className={`flex flex-col items-center justify-center p-5 rounded-lg border transition-colors ${paymentMethod === provider.id
                                ? "bg-[#1B263B]/5 dark:bg-[#E0E1DD]/5 border-[#1B263B] dark:border-[#E0E1DD]"
                                : "bg-gray-50 dark:bg-[#060D14]/50 border-[#1B263B]/10 dark:border-[#E0E1DD]/10 hover:border-[#1B263B]/30 dark:hover:border-[#E0E1DD]/30"
                                }`}
                            >
                              <div className="text-[#0D1B2A] dark:text-[#E0E1DD] mb-2 opacity-80 h-8 flex items-center justify-center">
                                {provider.icon}
                              </div>
                              <span className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">
                                {provider.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleInitiateSave}>
                        <div className="grid grid-cols-[140px_1fr] p-5 items-center">
                          <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Provider</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[#0D1B2A] dark:text-[#E0E1DD] opacity-80 scale-75">
                                {selectedProvider?.icon}
                              </span>
                              <span className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">
                                {selectedProvider?.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPaymentStep(1)}
                              className="text-xs font-medium text-[#1F7A1F] dark:text-[#55f761] hover:underline"
                            >
                              Change
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-[140px_1fr] p-5 items-center bg-gray-50/30 dark:bg-white/[0.01]">
                          <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Account Name</div>
                          <input
                            className="w-full max-w-md bg-white dark:bg-[#060D14] text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD] border border-[#1B263B]/20 dark:border-[#E0E1DD]/20 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#1F7A1F] dark:focus:ring-[#55f761]"
                            type="text"
                            required
                            value={payeeName}
                            onChange={(e) => setPayeeName(e.target.value)}
                            placeholder="e.g. John Doe"
                          />
                        </div>

                        <div className="grid grid-cols-[140px_1fr] p-5 items-center bg-gray-50/30 dark:bg-white/[0.01]">
                          <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Account Details</div>
                          <div>
                            <input
                              className="w-full max-w-md bg-white dark:bg-[#060D14] text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD] border border-[#1B263B]/20 dark:border-[#E0E1DD]/20 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#1F7A1F] dark:focus:ring-[#55f761]"
                              type="text"
                              required
                              value={payeeUid}
                              onChange={(e) => setPayeeUid(e.target.value)}
                              placeholder="Number / UID / Email"
                            />
                            <p className="text-xs text-[#2F3E46]/60 dark:text-[#E0E1DD]/40 mt-1.5">
                              Carefully verify this number to avoid transfer failures.
                            </p>
                          </div>
                        </div>

                        <div className="p-5 border-t border-[#1B263B]/10 dark:border-[#E0E1DD]/10 bg-gray-50/50 dark:bg-black/10 flex justify-end gap-3">
                          {payeeUid && (
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="px-6 py-2 border border-[#1B263B]/20 dark:border-[#E0E1DD]/20 hover:bg-gray-50 dark:hover:bg-[#1B263B]/80 text-[#0D1B2A] dark:text-[#E0E1DD] text-sm font-medium rounded-md transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 bg-[#1F7A1F] hover:bg-[#145214] dark:bg-[#55f761] dark:hover:bg-[#3de34a] text-white dark:text-[#060D14] text-sm font-medium rounded-md transition-colors disabled:opacity-70"
                          >
                            {isSaving ? "Saving..." : "Save Details"}
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </>
            )}

          </div>
        )}
      </div>

      <ConfirmPaymentModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={executeSavePayment}
        providerName={selectedProvider?.name}
        payeeName={payeeName}
        payeeUid={payeeUid}
      />
    </div>
  );
}
