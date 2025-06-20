import { useState } from "react";
import PropTypes from "prop-types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Clock, Calendar, AlertCircle } from "lucide-react";
import Spinner from "@/components/system/Spinner";

const RequestsView = ({ requests = [], onApproveRequest, loading = false }) => {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [error, setError] = useState('');

    const handleRequestClick = (request) => {
        setSelectedRequest(request);
        setError('');
    };

    const handleApprove = async () => {
        try {
            setError('');
            await onApproveRequest(selectedRequest.id);
            setSelectedRequest(null);
        } catch (error) {
            console.error('Error approving request:', error);
            setError('Failed to approve request');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { variant: "secondary", icon: Clock, label: "Pending" },
            approved: { variant: "default", icon: Check, label: "Approved" }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPendingRequests = () => requests.filter(req => req.status === 'pending');
    const getCompletedRequests = () => requests.filter(req => req.status !== 'pending');

    const closeModal = () => {
        setSelectedRequest(null);
        setError('');
    };

    if (loading) {
        return <Spinner message="Loading Requests..." />;
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Patient Requests</h2>
                <p className="text-muted-foreground">Manage communication requests from patients</p>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Pending Requests ({getPendingRequests().length})
                </h3>
                
                {getPendingRequests().length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-muted-foreground">No pending requests</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="text-left p-4 font-medium">Item</th>
                                    <th className="text-left p-4 font-medium">Time</th>
                                    <th className="text-left p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getPendingRequests().map((request) => (
                                    <tr 
                                        key={request.id}
                                        className="border-t hover:bg-muted/20 cursor-pointer"
                                        onClick={() => handleRequestClick(request)}
                                    >
                                        <td className="p-4">
                                            <span className="font-medium">{request.item.name}</span>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {formatDate(request.createdAt)}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(request.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    Recent Activity ({getCompletedRequests().length})
                </h3>
                
                {getCompletedRequests().length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-muted-foreground">No completed requests</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="text-left p-4 font-medium">Item</th>
                                    <th className="text-left p-4 font-medium">Time</th>
                                    <th className="text-left p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCompletedRequests().slice(0, 10).map((request) => (
                                    <tr 
                                        key={request.id}
                                        className="border-t hover:bg-muted/20 cursor-pointer opacity-75"
                                        onClick={() => handleRequestClick(request)}
                                    >
                                        <td className="p-4">
                                            <span className="font-medium">{request.item.name}</span>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {formatDate(request.createdAt)}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(request.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Dialog open={!!selectedRequest} onOpenChange={closeModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                    </DialogHeader>
                    
                    {selectedRequest && (
                        <div className="space-y-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="text-center">
                                <div className="aspect-square w-32 mx-auto overflow-hidden rounded-lg border mb-4">
                                    {selectedRequest.item.type === 'video' ? (
                                        <video 
                                            src={selectedRequest.item.imageUrl} 
                                            className="w-full h-full object-cover"
                                            muted
                                            loop
                                        />
                                    ) : (
                                        <img 
                                            src={selectedRequest.item.imageUrl} 
                                            alt={selectedRequest.item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{selectedRequest.item.name}</h3>
                                {getStatusBadge(selectedRequest.status)}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{formatDate(selectedRequest.createdAt)}</p>
                                        <p className="text-sm text-muted-foreground">Request Time</p>
                                    </div>
                                </div>
                            </div>

                            {selectedRequest.status === 'pending' && (
                                <div className="flex gap-3">
                                    <Button 
                                        onClick={handleApprove}
                                        className="flex-1"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

RequestsView.propTypes = {
    requests: PropTypes.array,
    onApproveRequest: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default RequestsView