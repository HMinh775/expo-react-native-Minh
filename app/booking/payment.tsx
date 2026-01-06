import { ChevronLeft, CreditCard, Minus, Plus, Shield, Smartphone, Wallet } from 'lucide-react';
import { useState } from 'react';
import { snacks as snackData } from '../../data/snacks';
import { Movie, Seat, Showtime, Snack } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PaymentScreenProps {
  movie: Movie;
  showtime: Showtime;
  seats: Seat[];
  onBack: () => void;
  onComplete: (snacks: { snack: Snack; quantity: number }[]) => void;
}

export function PaymentScreen({ movie, showtime, seats, onBack, onComplete }: PaymentScreenProps) {
  const [selectedSnacks, setSelectedSnacks] = useState<{ snack: Snack; quantity: number }[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'momo' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const seatsTotal = seats.length * showtime.price;
  const snacksTotal = selectedSnacks.reduce((sum, item) => sum + (item.snack.price * item.quantity), 0);
  const bookingFee = 1.50;
  const total = seatsTotal + snacksTotal + bookingFee;

  const addSnack = (snack: Snack) => {
    const existing = selectedSnacks.find(item => item.snack.id === snack.id);
    if (existing) {
      setSelectedSnacks(selectedSnacks.map(item =>
        item.snack.id === snack.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setSelectedSnacks([...selectedSnacks, { snack, quantity: 1 }]);
    }
  };

  const removeSnack = (snackId: string) => {
    const existing = selectedSnacks.find(item => item.snack.id === snackId);
    if (existing && existing.quantity > 1) {
      setSelectedSnacks(selectedSnacks.map(item =>
        item.snack.id === snackId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    } else {
      setSelectedSnacks(selectedSnacks.filter(item => item.snack.id !== snackId));
    }
  };

  const getSnackQuantity = (snackId: string) => {
    return selectedSnacks.find(item => item.snack.id === snackId)?.quantity || 0;
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onComplete(selectedSnacks);
    }, 2000);
  };

  const paymentMethods = [
    { id: 'card', icon: CreditCard, label: 'Credit/Debit Card' },
    { id: 'momo', icon: Smartphone, label: 'MoMo Wallet' },
    { id: 'wallet', icon: Wallet, label: 'CinemaGo Wallet' },
  ];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-16 bg-gray-950 px-4 py-4 border-b border-gray-800 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-white">Food & Payment</h3>
            <p className="text-xs text-gray-400">{movie.title}</p>
          </div>
        </div>
      </div>

      {/* Snacks Section */}
      <div className="px-4 py-6 border-b border-gray-800">
        <h3 className="text-white mb-4">Add Snacks (Optional)</h3>
        
        {/* Combos */}
        <div className="mb-6">
          <h4 className="text-gray-400 text-sm mb-3">Popular Combos</h4>
          <div className="space-y-3">
            {snackData.filter(s => s.category === 'combo').map((snack) => {
              const quantity = getSnackQuantity(snack.id);
              return (
                <div key={snack.id} className="bg-gray-900 rounded-xl p-3 flex gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={snack.image}
                      alt={snack.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white text-sm mb-1">{snack.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">{snack.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-red-500">${snack.price}</span>
                      {quantity > 0 ? (
                        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                          <button
                            onClick={() => removeSnack(snack.id)}
                            className="w-6 h-6 flex items-center justify-center text-white hover:bg-gray-700 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white text-sm w-6 text-center">{quantity}</span>
                          <button
                            onClick={() => addSnack(snack)}
                            className="w-6 h-6 flex items-center justify-center text-white hover:bg-gray-700 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addSnack(snack)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Other Snacks */}
        <div>
          <h4 className="text-gray-400 text-sm mb-3">Individual Items</h4>
          <div className="grid grid-cols-2 gap-3">
            {snackData.filter(s => s.category !== 'combo').map((snack) => {
              const quantity = getSnackQuantity(snack.id);
              return (
                <div key={snack.id} className="bg-gray-900 rounded-xl p-3">
                  <div className="aspect-square rounded-lg overflow-hidden mb-2">
                    <ImageWithFallback
                      src={snack.image}
                      alt={snack.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-white text-sm mb-1">{snack.name}</h4>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-1">{snack.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-red-500 text-sm">${snack.price}</span>
                    {quantity > 0 ? (
                      <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
                        <button
                          onClick={() => removeSnack(snack.id)}
                          className="w-5 h-5 flex items-center justify-center text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white text-xs w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => addSnack(snack)}
                          className="w-5 h-5 flex items-center justify-center text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addSnack(snack)}
                        className="w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-4 py-6">
        <h3 className="text-white mb-4">Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method.id as any)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                selectedPayment === method.id
                  ? 'bg-red-500/10 border-red-500'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedPayment === method.id ? 'bg-red-500' : 'bg-gray-800'
              }`}>
                <method.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white flex-1 text-left">{method.label}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayment === method.id
                  ? 'border-red-500'
                  : 'border-gray-600'
              }`}>
                {selectedPayment === method.id && (
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Security Note */}
        <div className="mt-4 flex items-start gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
          <Shield className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-20">
        <div className="max-w-md mx-auto">
          {/* Price Breakdown */}
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Tickets ({seats.length}x)</span>
              <span>${seatsTotal.toFixed(2)}</span>
            </div>
            {selectedSnacks.length > 0 && (
              <div className="flex justify-between text-sm text-gray-400">
                <span>Snacks</span>
                <span>${snacksTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-400">
              <span>Booking Fee</span>
              <span>${bookingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white pt-2 border-t border-gray-800">
              <span>Total</span>
              <span className="text-xl">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Pay ${total.toFixed(2)}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
