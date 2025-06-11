// dependencies
import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";

// components
import PatientItemsView from "@/components/patient/PatientItemsView";
import { 
    getPatientItems, 
    sendItemToCaregiver, 
    createPatientItem,
    createPatientVideo,
    uploadPatientImage 
} from "@/services/api/patient";

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
            let newItem;
            
            if (itemData.imageFile) {
                // Handle uploaded image
                newItem = await uploadPatientImage(itemData.imageFile, itemData.name);
            } else if (itemData.type === 'video') {
                // Generate video from text
                newItem = await createPatientVideo(itemData);
            } else {
                // Generate image from text
                newItem = await createPatientItem(itemData);
            }
            
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
            const result = await sendItemToCaregiver(item);
            alert(result.message || `Successfully sent "${item.name}" to caregiver!`);
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