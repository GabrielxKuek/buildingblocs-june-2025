import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image as ImageIcon, Video, Wand2, Loader2 } from "lucide-react"

const CreateItemModalCaregiver = ({ 
    show, 
    onClose, 
    onCreateItem 
}) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'image'
    });
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    console.log('CreateItemModalCaregiver render:', { show, loading, formData });

    const handleInputChange = (field, value) => {
        console.log('Input changed:', field, value);
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);
        
        if (!formData.name.trim()) {
            console.log('No name provided');
            alert('Please enter an item name');
            return;
        }

        console.log('Setting loading to true');
        setLoading(true);
        
        // Set loading message based on type
        const message = formData.type === 'video' 
            ? 'Generating video with Stable Diffusion... This may take 2-5 minutes.'
            : 'Generating image with Gemini AI... Please wait 30-60 seconds.';
        
        console.log('Setting loading message:', message);
        setLoadingMessage(message);
        
        try {
            const itemData = {
                name: formData.name.trim(),
                type: formData.type,
                id: Date.now()
            };

            console.log('Calling onCreateItem with:', itemData);
            
            if (!onCreateItem) {
                throw new Error('onCreateItem function not provided');
            }

            await onCreateItem(itemData);
            
            console.log('Item created successfully');
            
            // Reset form
            setFormData({
                name: '',
                type: 'image'
            });
            
            console.log('Closing modal');
            onClose();
            
        } catch (error) {
            console.error('Error creating item:', error);
            alert(error.message || 'Failed to create item');
        } finally {
            console.log('Setting loading to false');
            setLoading(false);
            setLoadingMessage('');
        }
    };

    const handleClose = () => {
        console.log('Close button clicked, loading:', loading);
        if (!loading) {
            setFormData({
                name: '',
                type: 'image'
            });
            onClose();
        }
    };

    const getButtonText = () => {
        if (loading) {
            return formData.type === 'video' ? 'Generating Video...' : 'Generating Image...';
        }
        return formData.type === 'video' ? 'Generate Video' : 'Generate Image';
    };

    const getButtonIcon = () => {
        if (loading) {
            return <Loader2 className="h-4 w-4 animate-spin" />;
        }
        return formData.type === 'video' ? <Video className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />;
    };

    const getEstimatedTime = () => {
        return formData.type === 'video' 
            ? '2-5 minutes using Stable Diffusion'
            : '30-60 seconds using Gemini AI';
    };

    return (
        <Dialog open={show} onOpenChange={handleClose}>
            <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md z-50 bg-background border shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create New Item</DialogTitle>
                </DialogHeader>

                {/* Debug Info */}
                <div className="text-xs text-gray-500 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    Debug: show={show ? 'true' : 'false'}, loading={loading ? 'true' : 'false'}, onCreateItem={onCreateItem ? 'provided' : 'missing'}
                </div>

                <div className="relative min-h-[400px]">
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

                        {/* Test Loading Button */}
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => {
                                console.log('Test loading button clicked');
                                setLoading(!loading);
                                setLoadingMessage(loading ? '' : 'Test loading message');
                            }}
                            className="w-full mb-2"
                        >
                            Test Loading State (Current: {loading ? 'ON' : 'OFF'})
                        </Button>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? 'Please Wait...' : 'Cancel'}
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

                    {/* Perfectly Centered Loading State Overlay */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/95 dark:bg-background/95 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
                            <div className="text-center p-8 bg-white dark:bg-card rounded-xl shadow-2xl border max-w-sm w-full mx-4">
                                {/* Icon with Custom Spinner */}
                                <div className="relative mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                                    {formData.type === 'video' ? (
                                        <Video className="h-12 w-12 text-blue-500" />
                                    ) : (
                                        <ImageIcon className="h-12 w-12 text-green-500" />
                                    )}
                                    {/* Custom spinning border */}
                                    <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                </div>
                                
                                {/* Title */}
                                <h3 className="text-lg font-semibold mb-2">
                                    {formData.type === 'video' ? 'Generating Video' : 'Generating Image'}
                                </h3>
                                
                                {/* Message */}
                                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                    {loadingMessage}
                                </p>
                                
                                {/* Progress Bar */}
                                <div className="w-full bg-muted rounded-full h-2 mb-4">
                                    <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-1000 ease-in-out" 
                                        style={{ 
                                            width: '60%',
                                            animation: 'pulse 2s infinite'
                                        }} 
                                    />
                                </div>
                                
                                {/* Service Info */}
                                <p className="text-xs text-muted-foreground">
                                    Powered by {formData.type === 'video' ? 'Stable Diffusion' : 'Google Gemini AI'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateItemModalCaregiver;