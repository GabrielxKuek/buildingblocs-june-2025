import PropTypes from "prop-types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2, Image as ImageIcon, Video, Zap } from "lucide-react";

const ProgressModal = ({ 
    show, 
    onClose, 
    title = "Processing...", 
    progress = null,
    allowCancel = false,
    onCancel = null 
}) => {
    const handleClose = () => {
        if (allowCancel && onClose) {
            onClose();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else if (onClose) {
            onClose();
        }
    };

    const getOperationIcon = () => {
        if (!progress?.operationType) return <Loader2 className="h-12 w-12 animate-spin text-primary" />;
        
        switch (progress.operationType) {
            case 'image':
                return <ImageIcon className="h-12 w-12 text-green-500 animate-pulse" />;
            case 'video':
                return <Video className="h-12 w-12 text-blue-500 animate-pulse" />;
            default:
                return <Loader2 className="h-12 w-12 animate-spin text-primary" />;
        }
    };

    const getOperationTitle = () => {
        if (!progress?.operationType) return title;
        
        switch (progress.operationType) {
            case 'image':
                return 'Generating Image with Gemini AI';
            case 'video':
                return 'Generating Video with Stable Diffusion';
            default:
                return title;
        }
    };

    const getEstimatedTime = () => {
        if (!progress?.operationType || !progress?.stage) return null;
        
        const estimates = {
            image: {
                start: '30-60 seconds',
                processing: '20-40 seconds remaining',
                uploading: 'Almost done...',
                complete: 'Complete!'
            },
            video: {
                start: '2-5 minutes',
                processing: '1-3 minutes remaining',
                uploading: 'Finalizing...',
                complete: 'Complete!'
            }
        };
        
        return estimates[progress.operationType]?.[progress.stage];
    };

    if (!show) return null;

    return (
        <Dialog open={show} onOpenChange={handleClose}>
            <DialogContent 
                className="w-full max-w-md" 
                showCloseButton={false}
            >
                <div className="flex flex-col items-center gap-6 py-4">
                    {/* Header */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">{getOperationTitle()}</h3>
                        {progress?.operationType && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {progress.operationType === 'image' ? 'Using Google Gemini AI' : 'Using Stable Diffusion'}
                            </p>
                        )}
                    </div>

                    {/* Progress Animation */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            {getOperationIcon()}
                            {progress?.percentage && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium bg-background rounded px-1">
                                        {Math.round(progress.percentage)}%
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Progress Message */}
                        {progress?.message && (
                            <div className="text-center">
                                <p className="text-sm font-medium mb-1">
                                    {progress.message}
                                </p>
                                {getEstimatedTime() && (
                                    <p className="text-xs text-muted-foreground">
                                        {getEstimatedTime()}
                                    </p>
                                )}
                            </div>
                        )}
                        
                        {/* Progress Bar */}
                        {progress?.percentage !== null && (
                            <div className="w-full max-w-xs">
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${Math.min(100, Math.max(0, progress.percentage || 0))}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Service-specific info */}
                        {progress?.operationType === 'video' && progress?.stage === 'processing' && (
                            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Zap className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800">High-Quality Video Generation</span>
                                </div>
                                <p className="text-xs text-blue-600">
                                    Please be patient - creating high-quality videos takes time
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Cancel Button */}
                    {allowCancel && progress?.stage !== 'complete' && (
                        <Button 
                            variant="outline" 
                            onClick={handleCancel}
                            className="mt-2"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

ProgressModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    title: PropTypes.string,
    progress: PropTypes.shape({
        message: PropTypes.string,
        percentage: PropTypes.number,
        timestamp: PropTypes.string,
        stage: PropTypes.string,
        operationType: PropTypes.string
    }),
    allowCancel: PropTypes.bool,
    onCancel: PropTypes.func
};

export default ProgressModal;