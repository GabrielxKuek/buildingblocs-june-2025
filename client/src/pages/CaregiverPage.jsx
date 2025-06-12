// dependencies
import { useState, useEffect, useCallback } from "react";
import { useLocation, Navigate } from "react-router-dom";

// components
import ManageItemsView from "@/components/caregiver/ManageItemsView";
import RequestsView from "@/components/caregiver/RequestsView";

// api
import { getPatientItems } from "@/services/api/patient";
import { 
    getCaregiverRequests, 
    approveRequest, 
    rejectRequest,
    createCaregiverItem,
    createCaregiverVideo,
    updateCaregiverItem,
    deleteCaregiverItem,
    generateImageForItem 
} from "@/services/api/caregiver";

const CaregiverPage = ({ setCreateItemHandler }) => {
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load data when component mounts
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const [itemsData, requestsData] = await Promise.all([
                    getPatientItems(),
                    getCaregiverRequests()
                ]);
                setItems(itemsData);
                setRequests(requestsData);
            } catch (error) {
                console.error("Error loading initial data:", error);
                alert("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Create item handler (wrapped in useCallback to preserve identity)
    const handleCreateItem = useCallback(async (itemData, onProgress = null) => {
        try {
            let newItem;

            if (itemData.type === "video") {
                newItem = await createCaregiverVideo(itemData, onProgress);
                console.log('Item Data:', itemData);
            } else {
                newItem = await createCaregiverItem(itemData, onProgress);
            }

            setItems(prev => [...prev, newItem]);
            return newItem;
        } catch (error) {
            console.error("Error creating item:", error);
            throw error;
        }
    }, []);

    // Register item handler with App
    useEffect(() => {
        if (setCreateItemHandler) {
            setCreateItemHandler(() => handleCreateItem);
        }

        return () => {
            if (setCreateItemHandler) {
                setCreateItemHandler(null);
            }
        };
    }, [setCreateItemHandler, handleCreateItem]);

    const handleUpdateItem = async (itemId, updateData) => {
        try {
            await updateCaregiverItem(itemId, updateData);
            setItems(prev => 
                prev.map(item => item.id === itemId ? { ...item, ...updateData } : item)
            );
        } catch (error) {
            console.error("Error updating item:", error);
            throw error;
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await deleteCaregiverItem(itemId);
            setItems(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Error deleting item:", error);
            throw error;
        }
    };

    const handleGenerateImage = async (itemName) => {
        try {
            return await generateImageForItem(itemName);
        } catch (error) {
            console.error("Error generating image:", error);
            throw error;
        }
    };

    const handleApproveRequest = async (requestId) => {
        try {
            await approveRequest(requestId);
            setRequests(prev => 
                prev.map(req => req.id === requestId ? { ...req, status: "approved" } : req)
            );
        } catch (error) {
            console.error("Error approving request:", error);
            throw error;
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await rejectRequest(requestId);
            setRequests(prev => 
                prev.map(req => req.id === requestId ? { ...req, status: "rejected" } : req)
            );
        } catch (error) {
            console.error("Error rejecting request:", error);
            throw error;
        }
    };

    // Navigation logic
    if (location.pathname === "/caregiver") {
        return <Navigate to="/caregiver/manage" replace />;
    }

    if (location.pathname === "/caregiver/manage") {
        return (
            <ManageItemsView
                items={items}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onGenerateImage={handleGenerateImage}
                loading={loading}
            />
        );
    }

    if (location.pathname === "/caregiver/requests") {
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
