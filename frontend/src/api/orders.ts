  // src/api/orders.ts
  import axiosInstance from "./axiosInstance";

  /* ---------- CUSTOMER ORDERS ---------- */
  export type CustomerOrder = {
    id: number;
    product_name: string;
    quantity: number;
    total_price: number;
    status: string;
    created_at: string;
  };

  export const fetchCustomerOrders = async (): Promise<CustomerOrder[]> => {
    const { data } = await axiosInstance.get("/orders/my-orders");
    return data;
  };

  /* ---------- RETAILER ORDERS ---------- */
  export const fetchRetailerOrders = async (): Promise<CustomerOrder[]> => {
    const { data } = await axiosInstance.get("/orders/retailer");
    return data;
  };

  /* ---------- WHOLESALER ORDERS ---------- */
  export const fetchWholesalerOrders = async (): Promise<CustomerOrder[]> => {
    const { data } = await axiosInstance.get("/orders/wholesaler");
    return data;
  };

  /* ---------- OPTIONAL: Update order status ---------- */
  export const updateOrderStatus = async (orderId: number, status: string) => {
    const res = await axiosInstance.patch(`/orders/${orderId}/status`, { status });
    return res.data;
  };

  export const fetchMyWholesaleOrders = async () => {
  const { data } = await axiosInstance.get("/orders/my-wholesale-orders");
  return data;
};
