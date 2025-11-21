// src/components/cards/OrderCard.tsx
import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import type { Order } from '../../../types/orders';
import CountdownTimer from '../common/CountdownTimer';
import { createCalendarEvent, formatDateForCalendar, addDays } from '../../utils/googleCalendar';
import { useGoogleApi } from '../../hooks/useGoogleApi';

const statusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-300';
    case 'completed':
      return 'bg-green-500/20 text-green-300';
    case 'cancelled':
      return 'bg-red-500/20 text-red-300';
    default:
      return 'bg-slate-700 text-slate-300';
  }
};

const OrderCard = ({ order }: { order: Order }) => {
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
  const [calendarEventAdded, setCalendarEventAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isGoogleApiReady, error: googleApiError } = useGoogleApi();

  // Calculate delivery date based on order date and delivery time
  const orderDate = new Date(order.created_at);
  const deliveryDays = order.delivery_time || (order.category === 'electronics' ? 5 : 1); // Default to 5 days for electronics, 1 for others
  const estimatedDeliveryDate = addDays(orderDate, deliveryDays);

  const handleAddToCalendar = async () => {
    if (!isGoogleApiReady) {
      setError("Google Calendar integration not ready. Please try again later.");
      return;
    }
    try {
      setIsAddingToCalendar(true);
      setError(null);

      const event = {
        summary: `Delivery: ${order.product_name}`,
        description: `Order #${order.id}\nQuantity: ${order.quantity}\nTotal: ₹${order.total_price.toFixed(2)}`,
        start: formatDateForCalendar(orderDate),
        end: formatDateForCalendar(estimatedDeliveryDate),
      };

      await createCalendarEvent(event);
      setCalendarEventAdded(true);
    } catch (err) {
      console.error('Error adding to calendar:', err);
      setError('Failed to add to calendar. Please try again.');
    } finally {
      setIsAddingToCalendar(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md hover:scale-[1.01] transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white">{order.product_name}</h3>
          <p className="text-slate-400 text-sm mt-1">
            Order #{order.id} · {new Date(order.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${statusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="mt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Quantity:</span>
          <span className="text-white">{order.quantity}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-slate-400">Total:</span>
          <span className="text-white font-medium">₹{order.total_price.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Estimated delivery:</span>
          <span className="text-sm font-medium">
            {estimatedDeliveryDate.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
          </span>
        </div>
        
        <CountdownTimer
          targetDate={addDays(new Date(order.created_at), order.delivery_time || (order.category === 'electronics' ? 5 : 1))}
          className="mt-2"
        />

        {!calendarEventAdded && (
          <button
            onClick={handleAddToCalendar}
            disabled={isAddingToCalendar}
            className="mt-3 w-full flex items-center justify-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition disabled:opacity-50"
          >
            {isAddingToCalendar ? (
              'Adding to Calendar...'
            ) : (
              <>
                <CalendarIcon size={16} />
                Add to Google Calendar
              </>
            )}
          </button>
        )}

        {calendarEventAdded && (
          <div className="mt-3 text-center text-sm text-green-400">
            ✓ Added to your calendar
          </div>
        )}

        {error && (
          <div className="mt-2 text-center text-sm text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
