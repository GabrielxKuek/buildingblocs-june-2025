// dependencies
import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";

// components
import PatientItemsView from "@/components/patient/PatientItemsView";
import { getPatientItems, sendItemToCaregiver } from "@/services/api/patient";

const PatientPage = () => {
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingItem, setSendingItem] = useState(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await getPatientItems();
            setItems(data);
        } catch (error) {
            console.error('Error loading items:', error);
            alert('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateItem = async (itemData) => {
        try {
            const newItem = {
                ...itemData,
                imageUrl: itemData.imageFile ? URL.createObjectURL(itemData.imageFile) : "https://via.placeholder.com/300",
                type: "image"
            };
            
            setItems(prev => [...prev, newItem]);
            console.log('Created item:', newItem);
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    };

    const handleSendToCaregiver = async (item) => {
        try {
            setSendingItem(item.id);
            await sendItemToCaregiver(item);
            alert(`Successfully sent "${item.name}" to caregiver!`);
        } catch (error) {
            console.error('Error sending to caregiver:', error);
            alert('Failed to send item to caregiver');
        } finally {
            setSendingItem(null);
        }
    };

    if (location.pathname === '/patient') {
        return <Navigate to="/patient/items" replace />;
    }

    const isItemsPage = location.pathname === '/patient/items';

    if (isItemsPage) {
        return (
            <PatientItemsView
                items={items}
                onSendToCaregiver={handleSendToCaregiver}
                onCreateItem={handleCreateItem}
                loading={loading}
                sendingItem={sendingItem}
            />
        );
    }

    return <Navigate to="/patient/items" replace />;
};

export default PatientPage;