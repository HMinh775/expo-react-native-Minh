import { ChevronLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { FoodItem } from '../App';

interface FoodSelectionProps {
  selectedFood: { item: FoodItem; quantity: number }[];
  onSelectFood: (food: { item: FoodItem; quantity: number }[]) => void;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Combo 1 - Bắp nước cơ bản',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1584474345633-cfd33a207dc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Bjb3JuJTIwY2luZW1hfGVufDF8fHx8MTc2NjQ1MjIyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Combo',
  },
  {
    id: '2',
    name: 'Combo 2 - Bắp nước lớn',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1584474345633-cfd33a207dc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Bjb3JuJTIwY2luZW1hfGVufDF8fHx8MTc2NjQ1MjIyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Combo',
  },
  {
    id: '3',
    name: 'Combo 3 - Family',
    price: 199000,
    image: 'https://images.unsplash.com/photo-1584474345633-cfd33a207dc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Bjb3JuJTIwY2luZW1hfGVufDF8fHx8MTc2NjQ1MjIyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Combo',
  },
  {
    id: '4',
    name: 'Bắp rang bơ vừa',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1584474345633-cfd33a207dc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Bjb3JuJTIwY2luZW1hfGVufDF8fHx8MTc2NjQ1MjIyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Bắp',
  },
  {
    id: '5',
    name: 'Bắp rang bơ lớn',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1584474345633-cfd33a207dc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Bjb3JuJTIwY2luZW1hfGVufDF8fHx8MTc2NjQ1MjIyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Bắp',
  },
  {
    id: '6',
    name: 'Nước ngọt có ga',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1735643434124-f51889fa1f8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2RhJTIwZHJpbmt8ZW58MXx8fHwxNzY2Mzk1ODU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Nước',
  },
  {
    id: '7',
    name: 'Nước cam ép',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1735643434124-f51889fa1f8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2RhJTIwZHJpbmt8ZW58MXx8fHwxNzY2Mzk1ODU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Nước',
  },
  {
    id: '8',
    name: 'Nachos phô mai',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1690085664028-3b8465e4ac24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWNob3MlMjBmb29kfGVufDF8fHx8MTc2NjQ1MjIyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Snack',
  },
  {
    id: '9',
    name: 'Hot dog',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1690085664028-3b8465e4ac24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWNob3MlMjBmb29kfGVufDF8fHx8MTc2NjQ1MjIyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Snack',
  },
];

const categories = ['Tất cả', 'Combo', 'Bắp', 'Nước', 'Snack'];

export function FoodSelection({ selectedFood, onSelectFood, onContinue, onSkip, onBack }: FoodSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const filteredItems =
    selectedCategory === 'Tất cả'
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  const handleQuantityChange = (item: FoodItem, change: number) => {
    const existing = selectedFood.find((f) => f.item.id === item.id);
    let newFood = [...selectedFood];

    if (existing) {
      const newQuantity = existing.quantity + change;
      if (newQuantity <= 0) {
        newFood = newFood.filter((f) => f.item.id !== item.id);
      } else {
        newFood = newFood.map((f) =>
          f.item.id === item.id ? { ...f, quantity: newQuantity } : f
        );
      }
    } else if (change > 0) {
      newFood.push({ item, quantity: 1 });
    }

    onSelectFood(newFood);
  };

  const getQuantity = (itemId: string) => {
    return selectedFood.find((f) => f.item.id === itemId)?.quantity || 0;
  };

  const total = selectedFood.reduce((sum, f) => sum + f.item.price * f.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-gray-950 z-10 border-b border-gray-800">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg">Chọn đồ ăn & nước</h1>
            <p className="text-sm text-gray-400">Tùy chọn (có thể bỏ qua)</p>
          </div>
          <button
            onClick={onSkip}
            className="text-yellow-400 text-sm active:opacity-70 transition-opacity"
          >
            Bỏ qua
          </button>
        </div>

        {/* Category Filter */}
        <div className="px-6 py-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Food Items */}
      <div className="px-6 py-6">
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const quantity = getQuantity(item.id);
            return (
              <div
                key={item.id}
                className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-lg text-yellow-400 mb-3">
                      {item.price.toLocaleString()}đ
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        disabled={quantity === 0}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          quantity === 0
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-800 text-white active:scale-95'
                        }`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        className="w-8 h-8 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-6 pb-8">
        {selectedFood.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-400">
                <ShoppingBag className="w-5 h-5" />
                <span>{selectedFood.reduce((sum, f) => sum + f.quantity, 0)} món</span>
              </div>
              <p className="text-2xl text-yellow-400">{total.toLocaleString()}đ</p>
            </div>
            <button
              onClick={onContinue}
              className="w-full bg-yellow-500 text-gray-900 py-4 rounded-xl transition-all active:scale-95"
            >
              Tiếp tục
            </button>
          </>
        ) : (
          <button
            onClick={onSkip}
            className="w-full bg-gray-800 text-white py-4 rounded-xl transition-all active:scale-95"
          >
            Bỏ qua phần này
          </button>
        )}
      </div>
    </div>
  );
}
