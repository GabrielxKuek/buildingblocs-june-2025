// dependencies
import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";

// components
import PatientItemsView from "@/components/patient/PatientItemsView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { getPatientItems, sendItemToCaregiver } from "@/services/api/patient";

const PatientPage = () => {
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingItem, setSendingItem] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        // Auto-clear success message after 3 seconds
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const loadItems = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getPatientItems();
            setItems(data);
        } catch (error) {
            console.error('Error loading items:', error);
            setError('Failed to load items');
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
            setError('');
            setSuccess('');
            await sendItemToCaregiver(item);
            setSuccess(`Successfully sent "${item.name}" to caregiver!`);
        } catch (error) {
            console.error('Error sending to caregiver:', error);
            setError('Failed to send item to caregiver');
        } finally {
            setSendingItem(null);
        }
    };

    const clearError = () => {
        setError('');
    };

    const clearSuccess = () => {
        setSuccess('');
    };

    if (location.pathname === '/patient') {
        return <Navigate to="/patient/items" replace />;
    }

    const isItemsPage = location.pathname === '/patient/items';

    if (isItemsPage) {
        return (
            <div>
                <div className="p-6 space-y-4">
                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="flex items-center justify-between">
                                <span>{error}</span>
                                <div className="flex gap-2">
                                    {error.includes('Failed to load items') && (
                                        <button 
                                            onClick={loadItems}
                                            className="underline hover:no-underline"
                                        >
                                            Try Again
                                        </button>
                                    )}
                                    <button 
                                        onClick={clearError}
                                        className="underline hover:no-underline"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <Alert variant="default" className="border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="flex items-center justify-between text-green-800">
                                <span>{success}</span>
                                <button 
                                    onClick={clearSuccess}
                                    className="underline hover:no-underline"
                                >
                                    Dismiss
                                </button>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <PatientItemsView
                    items={items}
                    onSendToCaregiver={handleSendToCaregiver}
                    onCreateItem={handleCreateItem}
                    loading={loading}
                    sendingItem={sendingItem}
                />
            </div>
        );
    }

    return <Navigate to="/patient/items" replace />;
};

export default PatientPage;