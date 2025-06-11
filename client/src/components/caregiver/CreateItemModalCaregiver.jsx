import { useState } from 'react';
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image as ImageIcon, Video, Wand2 } from "lucide-react"
import ProgressModal from "@/components/system/ProgressModal";

const CreateItemModalCaregiver = ({ show, onClose, onCreateItem }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'image' // 'image' or 'video'
    });
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(null);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('Please enter an item name');
            return;
        }

        setLoading(true);
        setProgress({ message: 'Initializing...', percentage: 0 });
        
        try {
            const itemData = {
                name: formData.name,
                type: formData.type,
                id: Date.now()
            };

            await onCreateItem(itemData, setProgress);
            
            // Reset form
            setFormData({
                name: '',
                type: 'image'
            });
            
            // Close modal after a brief delay to show completion
            setTimeout(() => {
                onClose();
                setProgress(null);
            }, 1500);
            
        } catch (error) {
            console.error('Error creating item:', error);
            alert(error.message || 'Failed to create item');
            setProgress(null);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                name: '',
                type: 'image'
            });
            setProgress(null);
            onClose();
        }
    };

    const handleCancel = () => {
        setLoading(false);
        setProgress(null);
        handleClose();
    };

    const getButtonText = () => {
        if (loading) {
            return formData.type === 'video' ? 'Generating Video...' : 'Generating Image...';
        }
        return formData.type === 'video' ? 'Generate Video' : 'Generate Image';
    };

    const getButtonIcon = () => {
        if (loading) {
            return <Wand2 className="h-4 w-4 animate-spin" />;
        }
        return formData.type === 'video' ? <Video className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />;
    };

    const getEstimatedTime = () => {
        return formData.type === 'video' 
            ? '2-5 minutes using Stable Diffusion'
            : '30-60 seconds using Gemini AI';
    };

    return (
        <>
            <Dialog open={show && !loading} onOpenChange={handleClose}>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Create New Item</DialogTitle>
                    </DialogHeader>

                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Item Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Item Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter item name (e.g., 'coffee', 'water', 'help')..."
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    disabled={loading}
                                    className="w-full"
                                    autoFocus
                                />
                            </div>

                            {/* Media Type Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="type">Media Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => handleInputChange('type', value)}
                                    disabled={loading}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select media type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="image">
                                            <div className="flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4 text-green-500" />
                                                <span>Image (Gemini AI)</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="video">
                                            <div className="flex items-center gap-2">
                                                <Video className="h-4 w-4 text-blue-500" />
                                                <span>Video (Stable Diffusion)</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Description */}
                            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                {formData.type === 'video' ? (
                                    <div className="flex items-start gap-2">
                                        <Video className="h-4 w-4 mt-0.5 text-blue-500" />
                                        <div>
                                            <p className="font-medium">AI Video Generation</p>
                                            <p>Creates a short video using Stable Diffusion. Estimated time: {getEstimatedTime()}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-2">
                                        <ImageIcon className="h-4 w-4 mt-0.5 text-green-500" />
                                        <div>
                                            <p className="font-medium">AI Image Generation</p>
                                            <p>Creates a clear image using Google Gemini AI. Estimated time: {getEstimatedTime()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={loading || !formData.name.trim()}
                                    className="flex-1"
                                >
                                    {getButtonIcon()}
                                    <span className="ml-2">{getButtonText()}</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Progress Modal */}
            <ProgressModal
                show={loading}
                progress={progress}
                allowCancel={true}
                onCancel={handleCancel}
            />
        </>
    );
};

CreateItemModalCaregiver.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreateItem: PropTypes.func.isRequired,
}

export default CreateItemModalCaregiver;