import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ProgressModal = ({ show, progress, allowCancel, onCancel }) => {
    return (
        <Dialog open={show}>
            <DialogContent className="w-full max-w-md" showCloseButton={false}>
                <DialogTitle className="text-lg font-semibold text-center">
                    {progress?.message || 'Processing...'}
                </DialogTitle>
                
                <div className="space-y-4 mt-4">
                    {progress && (
                        <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress.percentage || 0}%` }}
                                />
                            </div>
                            
                            <p className="text-sm text-center text-muted-foreground">
                                {progress.percentage || 0}% complete
                            </p>
                            
                            {progress.message && progress.message !== (progress?.message || 'Processing...') && (
                                <p className="text-sm text-center text-muted-foreground">
                                    {progress.message}
                                </p>
                            )}
                        </div>
                    )}
                    
                    {/* Cancel button */}
                    {allowCancel && onCancel && (
                        <Button 
                            variant="outline" 
                            onClick={onCancel}
                            className="w-full mt-4"
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProgressModal;