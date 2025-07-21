import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Plus,
  Trash2,
  Edit,
  Shield,
  Calendar,
  User,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Import payment services
import { bookingService } from "@/lib/booking-service";
interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex" | "discover";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
}

export default function PaymentMethodsForm() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  // Form state
  const [form, setForm] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Replace with your auth token logic
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || ""
      : "";

  // Fetch payment methods on mount
  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      setError(null);
      try {
        const res = await bookingService.getPaymentDetails(token);
        if (res.success === false) {
          setError(res.error || "Failed to fetch payment methods");
        } else if (res.payments) {
          console.log(res.payments);
          setPaymentMethods(
            res.payments.map((p: any) => ({
              id: p.id || p.payment_id || p.cardnumber,
              type: p.cardType || "visa",
              last4: p.card_number?.slice(-4) || "0000",
              expiryMonth: p.exp_date?.split("-")[1] || "",
              expiryYear: p.exp_date?.split("-")[0] || "",
              cardholderName: p.holder_name,
              isDefault: p.is_default,
            }))
          );
        }
      } catch (err: any) {
        setError("Failed to fetch payment methods");
      }
      setLoading(false);
    }
    fetchPayments();
  }, [token]);

  const getCardIcon = (type: string) => {
    const iconProps = { className: "w-8 h-8" };

    switch (type) {
      case "visa":
        return (
          <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
            VISA
          </div>
        );
      case "mastercard":
        return (
          <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            MC
          </div>
        );
      case "amex":
        return (
          <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
            AMEX
          </div>
        );
      case "discover":
        return (
          <div className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold">
            DISC
          </div>
        );
      default:
        return <CreditCard {...iconProps} />;
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    setIsDeleting(cardId);

    // Simulate API call delay
    setTimeout(() => {
      setPaymentMethods((prev) => prev.filter((card) => card.id !== cardId));
      setIsDeleting(null);
    }, 1000);
  };

  const handleSetDefault = (cardId: string) => {
    setPaymentMethods((prev) =>
      prev.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  };

  // Handle add payment form submit
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        cardNumber: form.cardNumber,
        expiryDate: `${form.expiryYear}-${form.expiryMonth}-01`,
        cvv: form.cvv,
        cardHolderName: form.cardholderName,
        token,
        isDefault: form.isDefault,
      };
      const res = await bookingService.savePaymentDetails(payload);
      if (res?.success === false) {
        setError(res.error || "Failed to add payment method");
      } else {
        setShowAddForm(false);
        setForm({
          cardNumber: "",
          cardholderName: "",
          expiryMonth: "",
          expiryYear: "",
          cvv: "",
          isDefault: false,
        });
        // Refresh payment methods
        const refreshed = await bookingService.getPaymentDetails(token);
        if (refreshed.payments) {
          setPaymentMethods(
            refreshed.payments.map((p: any) => ({
              id: p.id || p.paymentid || p.cardnumber,
              type: p.cardType || "visa",
              last4: p.cardnumber?.slice(-4) || "0000",
              expiryMonth: p.expiryDate?.split("-")[1] || "",
              expiryYear: p.expiryDate?.split("-")[0] || "",
              cardholderName: p.cardholdername,
              isDefault: p.isdefault,
            }))
          );
        }
      }
    } catch (err: any) {
      setError("Failed to add payment method");
    }
    setLoading(false);
  };

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto p-2 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-gray-900 mb-2">
            Payment Methods
          </h2>
          <p className="text-sm sm:text-base text-brand-gray-600">
            Manage your saved payment methods for faster checkout
          </p>
        </div>

        {/* Existing Payment Methods or Loading */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 min-h-[80px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-3"></div>
              <div className="text-blue-700 font-medium">Loading payment methods...</div>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No payment methods found.</div>
          ) : (
            paymentMethods.map((card) => (
              <div
                key={card.id}
                className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Card Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-xl"></div>

                <div className="relative z-10">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      {getCardIcon(card.type)}
                      <div>
                        <p className="text-xs sm:text-sm text-gray-300">
                          Payment Method
                        </p>
                        <p className="font-semibold text-base sm:text-lg">
                          •••• •••• •••• {card.last4}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleSetDefault(card.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            disabled={card.isDefault}
                          >
                            <Shield
                              className={`w-4 h-4 ${
                                card.isDefault ? "text-green-400" : "text-gray-400"
                              }`}
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{card.isDefault ? "Default" : "Set as default"}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit payment method</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                            disabled={isDeleting === card.id}
                          >
                            {isDeleting === card.id ? (
                              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4 text-red-400" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete payment method</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{card.cardholderName}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>
                        {card.expiryMonth}/{card.expiryYear}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New Payment Method */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full border-2 border-dashed border-brand-gray-300 rounded-xl p-6 sm:p-8 hover:border-brand-pink-500 hover:bg-brand-pink-50 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-brand-pink-100 group-hover:bg-blue-200 rounded-full p-3 transition-colors">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-brand-pink-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm sm:text-base text-brand-gray-900">
                  Add New Payment Method
                </p>
                <p className="text-xs sm:text-sm text-brand-gray-500 mt-1">
                  Add a credit or debit card for faster checkout
                </p>
              </div>
            </div>
          </button>
        ) : (
          <div className="bg-white rounded-xl border border-brand-gray-200 p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-brand-gray-900 mb-4 sm:mb-6">
              Add New Payment Method
            </h3>
            {error && (
              <div className="text-red-500 text-sm mb-2">{error}</div>
            )}
            <form className="space-y-4" onSubmit={handleAddPayment}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent transition-all cursor-text text-sm sm:text-base"
                    value={form.cardNumber}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cardNumber: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-3 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent transition-all cursor-text text-sm sm:text-base"
                    value={form.cardholderName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cardholderName: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    Expiry Month
                  </label>
                  <select
                    className="w-full p-3 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
                    value={form.expiryMonth}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, expiryMonth: e.target.value }))
                    }
                    required
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    Expiry Year
                  </label>
                  <select
                    className="w-full p-3 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
                    value={form.expiryYear}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, expiryYear: e.target.value }))
                    }
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength={4}
                  className="w-full sm:w-32 p-3 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent transition-all cursor-text text-sm sm:text-base"
                  value={form.cvv}
                  onChange={(e) => setForm((f) => ({ ...f, cvv: e.target.value }))}
                  required
                />
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="setDefault"
                  className="w-4 h-4 text-brand-pink-600 border-brand-gray-300 rounded focus:ring-brand-pink-500 mt-0.5"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isDefault: e.target.checked }))
                  }
                />
                <label
                  htmlFor="setDefault"
                  className="text-sm text-brand-gray-700 leading-5"
                >
                  Set as default payment method
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button
                  type="submit"
                  variant="default"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Payment Method"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setShowAddForm(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 sm:mt-8 bg-blue-50 border border-brand-pink-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand-pink-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Secure Payment Processing
              </p>
              <p className="text-xs sm:text-sm text-blue-700 mt-1">
                Your payment information is encrypted and securely stored. We
                never store your full card number or CVV.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}


