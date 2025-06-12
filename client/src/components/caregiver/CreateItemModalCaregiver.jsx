import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageIcon, Video, Check, AlertCircle } from "lucide-react"
import FloatingProgressCard from "@/components/system/FloatingProgressCard";
import { fetchAllImages } from "@/services/api/caregiver";
import TopProgressBar from "@/components/system/TopProgressBar";

const CreateItemModalCaregiver = ({ 
    show, 
    onClose, 
    onCreateItem 
}) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'image',
        selectedImageId: null,
        progressType: 'floating' // 'floating' or 'top'
    });
    
    // Progress states
    const [progressState, setProgressState] = useState({
        visible: false,
        progress: 0,
        stage: 'start',
        minimized: false
    });
    
    const [availableImages, setAvailableImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [error, setError] = useState('');

    // Fetch available images when modal opens and video is selected
    useEffect(() => {
        if (show && formData.type === 'video') {
            fetchAvailableImages();
        }
    }, [show, formData.type]);

    const fetchAvailableImages = async () => {
        try {
            setLoadingImages(true);
            setError('');
            
            // Use the updated API config
            const images = await fetchAllImages();
            setAvailableImages(images);
            
        } catch (error) {
            console.error('Error fetching images:', error);
            setError('Failed to load available images. Please try again.');
            setAvailableImages([]);
        } finally {
            setLoadingImages(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (field === 'type' && value !== 'video') {
            setFormData(prev => ({
                ...prev,
                selectedImageId: null
            }));
        }
        
        if (error) setError('');
    };

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            selectedImageId: imageId
        }));
        setError('');
    };

    const getSelectedImage = () => {
        return availableImages.find(img => img.media_id === formData.selectedImageId);
    };

    // Progress callback for AI generation
    const handleProgress = (progressData) => {
        setProgressState(prev => ({
            ...prev,
            progress: progressData.percentage || 0,
            stage: progressData.stage || 'start'
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setError('Please enter an item name');
            return;
        }

        if (formData.type === 'video' && !formData.selectedImageId) {
            setError('Please select an image to use for video generation');
            return;
        }

        // Start progress tracking
        setProgressState({
            visible: true,
            progress: 0,
            stage: 'start',
            minimized: false
        });
        
        setError('');
        
        // Close the modal to allow non-blocking progress
        onClose();
        
        try {
            const selectedImage = getSelectedImage();
            const itemData = {
                name: formData.name,
                type: formData.type,
                id: Date.now(),
                imageUrl: formData.type === 'video' ? selectedImage?.media_url : null
            };

            // Pass progress callback to the creation function
            await onCreateItem(itemData, handleProgress);
            
            // Reset form
            setFormData({
                name: '',
                type: 'image',
                selectedImageId: null,
                progressType: 'floating'
            });
            
        } catch (error) {
            console.error('Error creating item:', error);
            setError(error.message || 'Failed to create item');
            // Show error in a notification or alert
            alert(`Error: ${error.message || 'Failed to create item'}`);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            type: 'image',
            selectedImageId: null,
            progressType: 'floating'
        });
        setError('');
        onClose();
    };

    const handleProgressClose = () => {
        setProgressState(prev => ({ ...prev, visible: false }));
    };

    const handleProgressMinimize = () => {
        setProgressState(prev => ({ ...prev, minimized: !prev.minimized }));
    };

    const getEstimatedTime = () => {
        return formData.type === 'video' 
            ? '2-5 minutes using Stable Diffusion'
            : '30-60 seconds using Gemini AI';
    };

    return (
        <>
            <Dialog open={show} onOpenChange={handleClose}>
                <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Create New Item</DialogTitle>
                    </DialogHeader>

                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Error Alert */}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Item Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Item Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter item name (e.g., 'coffee', 'water', 'help')..."
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
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

                            {/* Progress Type Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="progressType">Progress Display</Label>
                                <Select
                                    value={formData.progressType}
                                    onValueChange={(value) => handleInputChange('progressType', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select progress type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="floating">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <span>Floating Card (Bottom Right)</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="top">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-1 bg-green-500 rounded"></div>
                                                <span>Top Progress Bar</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Image Selection for Video Generation */}
                            {formData.type === 'video' && (
                                <div className="space-y-3">
                                    <Label>Select Base Image for Video</Label>
                                    
                                    {loadingImages ? (
                                        <div className="flex items-center justify-center p-8">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                            <span className="ml-2">Loading available images...</span>
                                        </div>
                                    ) : availableImages.length === 0 ? (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                No images available. Please generate some images first before creating videos.
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                                            {availableImages.map((image) => (
                                                <div
                                                    key={image.media_id}
                                                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                                        formData.selectedImageId === image.media_id
                                                            ? 'border-primary shadow-lg scale-105'
                                                            : 'border-muted hover:border-muted-foreground'
                                                    }`}
                                                    onClick={() => handleImageSelect(image.media_id)}
                                                >
                                                    <div className="aspect-square">
                                                        <img
                                                            src={image.media_url}
                                                            alt={image.media_name || 'Generated image'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    
                                                    {formData.selectedImageId === image.media_id && (
                                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                            <div className="bg-primary rounded-full p-1">
                                                                <Check className="h-4 w-4 text-primary-foreground" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                                                        {image.media_name || image.prompt || 'Untitled'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {formData.selectedImageId && (
                                        <div className="text-sm text-muted-foreground">
                                            Selected: {getSelectedImage()?.media_name || getSelectedImage()?.prompt || 'Image'}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                {formData.type === 'video' ? (
                                    <div className="flex items-start gap-2">
                                        <Video className="h-4 w-4 mt-0.5 text-blue-500" />
                                        <div>
                                            <p className="font-medium">AI Video Generation</p>
                                            <p>Creates a short video using the selected image as base. Estimated time: {getEstimatedTime()}</p>
                                            <p className="text-xs mt-1">✨ You can continue using the site while generation happens in the background!</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-2">
                                        <ImageIcon className="h-4 w-4 mt-0.5 text-green-500" />
                                        <div>
                                            <p className="font-medium">AI Image Generation</p>
                                            <p>Creates a clear image using Google Gemini AI. Estimated time: {getEstimatedTime()}</p>
                                            <p className="text-xs mt-1">✨ You can continue using the site while generation happens in the background!</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={
                                        !formData.name.trim() || 
                                        (formData.type === 'video' && !formData.selectedImageId)
                                    }
                                    className="flex-1"
                                >
                                    {formData.type === 'video' ? (
                                        <>
                                            <Video className="h-4 w-4 mr-2" />
                                            Generate Video
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="h-4 w-4 mr-2" />
                                            Generate Image
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Non-blocking Progress Components */}
            {formData.progressType === 'floating' ? (
                <FloatingProgressCard
                    isVisible={progressState.visible}
                    type={formData.type}
                    progress={progressState.progress}
                    stage={progressState.stage}
                    itemName={formData.name}
                    onClose={handleProgressClose}
                    onMinimize={handleProgressMinimize}
                    isMinimized={progressState.minimized}
                />
            ) : (
                <TopProgressBar
                    isVisible={progressState.visible}
                    type={formData.type}
                    progress={progressState.progress}
                    stage={progressState.stage}
                    itemName={formData.name}
                    onClose={handleProgressClose}
                />
            )}
        </>
    );
};

export default CreateItemModalCaregiver; 