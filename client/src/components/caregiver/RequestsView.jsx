// dependencies
import { useState } from "react";
import PropTypes from "prop-types";

// components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X, Clock, User, MessageSquare, Calendar } from "lucide-react";
import Spinner from "@/components/system/Spinner";

const RequestsView = ({ requests = [], onApproveRequest, onRejectRequest, loading = false }) => {
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleRequestClick = (request) => {
        setSelectedRequest(request);
    };

    const handleApprove = async () => {
        try {
            await onApproveRequest(selectedRequest.id);
            setSelectedRequest(null);
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve request');
        }
    };

    const handleReject = async () => {
        try {
            await onRejectRequest(selectedRequest.id);
            setSelectedRequest(null);
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Failed to reject request');
        }
    };

    const closeModal = () => {
        setSelectedRequest(null);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { variant: "secondary", icon: Clock, label: "Pending" },
            approved: { variant: "default", icon: Check, label: "Approved" },
            rejected: { variant: "destructive", icon: X, label: "Rejected" }
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

    if (loading) {
        return <Spinner message="Loading Requests..." />;
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Patient Requests</h2>
                <p className="text-muted-foreground">Manage communication requests from patients</p>
            </div>

            {/* Pending Requests Section */}
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {getPendingRequests().map((request) => (
                            <Card 
                                key={request.id}
                                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500"
                                onClick={() => handleRequestClick(request)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-semibold">{request.item.name}</h4>
                                        {getStatusBadge(request.status)}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            {request.patientName}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(request.createdAt)}
                                        </div>
                                        {request.message && (
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <MessageSquare className="h-4 w-4 mt-0.5" />
                                                <p className="line-clamp-2">{request.message}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Completed Requests Section */}
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {getCompletedRequests().slice(0, 6).map((request) => (
                            <Card 
                                key={request.id}
                                className="cursor-pointer hover:shadow-md transition-all duration-200 opacity-75"
                                onClick={() => handleRequestClick(request)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-semibold">{request.item.name}</h4>
                                        {getStatusBadge(request.status)}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            {request.patientName}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(request.createdAt)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Request Detail Modal */}
            {selectedRequest && (
                <Dialog open={!!selectedRequest} onOpenChange={closeModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <span>Request Details</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={closeModal}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* Request Item */}
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

                            {/* Request Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{selectedRequest.patientName}</p>
                                        <p className="text-sm text-muted-foreground">Patient</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{formatDate(selectedRequest.createdAt)}</p>
                                        <p className="text-sm text-muted-foreground">Request Time</p>
                                    </div>
                                </div>

                                {selectedRequest.message && (
                                    <div className="flex items-start gap-3">
                                        <MessageSquare className="h-5 w-5 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="font-medium mb-1">Message</p>
                                            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                                                {selectedRequest.message}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            {selectedRequest.status === 'pending' && (
                                <div className="flex gap-3">
                                    <Button 
                                        onClick={handleApprove}
                                        className="flex-1"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button 
                                        onClick={handleReject}
                                        variant="destructive"
                                        className="flex-1"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

RequestsView.propTypes = {
    requests: PropTypes.array,
    onApproveRequest: PropTypes.func.isRequired,
    onRejectRequest: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default RequestsView;