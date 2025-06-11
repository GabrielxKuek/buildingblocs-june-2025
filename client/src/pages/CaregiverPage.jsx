// dependencies
import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";

// components
import ManageItemsView from "@/components/caregiver/ManageItemsView";
import RequestsView from "@/components/caregiver/RequestsView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// api
import { getPatientItems } from "@/services/api/patient";
import { 
    getCaregiverRequests, 
    approveRequest, 
    rejectRequest,
    createCaregiverItem,
    updateCaregiverItem,
    deleteCaregiverItem,
    generateImageForItem 
} from "@/services/api/caregiver";

const CaregiverPage = () => {
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError('');
            const [itemsData, requestsData] = await Promise.all([
                getPatientItems(),
                getCaregiverRequests()
            ]);
            setItems(itemsData);
            setRequests(requestsData);
        } catch (error) {
            console.error('Error loading initial data:', error);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateItem = async (itemData) => {
        try {
            const newItem = await createCaregiverItem(itemData);
            setItems(prev => [...prev, newItem]);
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    };

    const handleUpdateItem = async (itemId, updateData) => {
        try {
            await updateCaregiverItem(itemId, updateData);
            setItems(prev => prev.map(item => 
                item.id === itemId ? { ...item, ...updateData } : item
            ));
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await deleteCaregiverItem(itemId);
            setItems(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    };

    const handleGenerateImage = async (itemName) => {
        try {
            const newImageUrl = await generateImageForItem(itemName);
            return newImageUrl;
        } catch (error) {
            console.error('Error generating image:', error);
            throw error;
        }
    };

    const handleApproveRequest = async (requestId) => {
        try {
            await approveRequest(requestId);
            setRequests(prev => prev.map(request => 
                request.id === requestId 
                    ? { ...request, status: 'approved' }
                    : request
            ));
        } catch (error) {
            console.error('Error approving request:', error);
            throw error;
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await rejectRequest(requestId);
            setRequests(prev => prev.map(request => 
                request.id === requestId 
                    ? { ...request, status: 'rejected' }
                    : request
            ));
        } catch (error) {
            console.error('Error rejecting request:', error);
            throw error;
        }
    };

    const clearError = () => {
        setError('');
    };

    if (location.pathname === '/caregiver') {
        return <Navigate to="/caregiver/manage" replace />;
    }

    const isManagePage = location.pathname === '/caregiver/manage';
    const isRequestsPage = location.pathname === '/caregiver/requests';

    // Show error at the page level if initial data loading failed
    if (error && !loading) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                        <span>{error}</span>
                        <button 
                            onClick={loadInitialData}
                            className="ml-4 underline hover:no-underline"
                        >
                            Try Again
                        </button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isManagePage) {
        return (
            <ManageItemsView
                items={items}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onGenerateImage={handleGenerateImage}
                onCreateItem={handleCreateItem}
                loading={loading}
            />
        );
    }

    if (isRequestsPage) {
        return (
            <RequestsView
                requests={requests}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
                loading={loading}
            />
        );
    }

    return <Navigate to="/caregiver/manage" replace />;
};

export default CaregiverPage;