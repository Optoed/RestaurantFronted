import React, { useState, useEffect } from 'react';
import { OrderType } from '../types/orderType';
import { getAllOrders } from '../service/ordersService';
import { ErrorType } from '../types/errorType'; // Import ErrorType
import '../assets/styles/Orders.css'; // Import the CSS file

const Orders = () => {
    const [orders, setOrders] = useState<OrderType[]>([]); // State to hold orders
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<ErrorType>({ isError: false }); // Use ErrorType for error state

    useEffect(() => {
        // Fetch orders from API when the component mounts
        const fetchOrders = async () => {
            try {
                const response = await getAllOrders();
                setOrders(response.data); // Set the orders in state
            } catch (err) {
                // Handle errors with ErrorType
                setError({
                    isError: true,
                    message: 'Failed to fetch orders. Please try again later.',
                    code: '500', // Optional: You can set a custom error code
                    isOpenModal: true, // Optional: to control whether a modal should open
                });
            } finally {
                setLoading(false); // Set loading to false once the request is finished
            }
        };

        fetchOrders(); // Call the fetch function
    }, []); // Empty dependency array to run only once when the component mounts

    if (loading) {
        return <div className="loading-message">Loading...</div>; // Show loading indicator
    }

    if (error.isError) {
        return (
            <div className="error-message">
                <p>{error.message}</p>
                {error.code && <p>Error Code: {error.code}</p>} {/* Display error code if present */}
            </div>
        ); // Show error message if there's an error
    }

    return (
        <div className="orders-container">
            <h1 className="orders-title">Your Orders</h1>
            <p className="orders-message">Here you can view your orders.</p>
            {orders.length === 0 ? (
                <p>No orders found.</p> // If there are no orders
            ) : (
                <ul className="orders-list">
                    {orders.map((order) => (
                        <li key={order.id} className="orders-list-item">
                            Order #{order.id}: Total Cost: ${order.total_cost} - Status: {order.status}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Orders;