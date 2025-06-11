import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import ModalOverlay from '@/components/system/ModalOverlay';

const CreateItemModal = ({ show, onClose, onCreateItem }) => {
    const location = useLocation();
    const isPatientPage = location.pathname.startsWith('/patient');
    
    const [formData, setFormData] = useState({
        name: '',
        imageFile: null,
        imagePreview: null
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }

            // Validate file size (e.g., 5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            
            setFormData(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: previewUrl
            }));
        }
    };

    const clearImage = () => {
        if (formData.imagePreview) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        setFormData(prev => ({
            ...prev,
            imageFile: null,
            imagePreview: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('Please enter an item name');
            return;
        }

        if (isPatientPage && !formData.imageFile) {
            alert('Please upload an image');
            return;
        }

        setLoading(true);
        
        try {
            const itemData = {
                name: formData.name,
                id: Date.now() // Simple ID generation
            };

            // For patient pages, include the image file
            if (isPatientPage) {
                itemData.imageFile = formData.imageFile;
            }

            await onCreateItem(itemData);
            
            // Reset form
            if (formData.imagePreview) {
                URL.revokeObjectURL(formData.imagePreview);
            }
            setFormData({
                name: '',
                imageFile: null,
                imagePreview: null
            });
            
            onClose();
        } catch (error) {
            console.error('Error creating item:', error);
            alert('Failed to create item');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            if (formData.imagePreview) {
                URL.revokeObjectURL(formData.imagePreview);
            }
            setFormData({
                name: '',
                imageFile: null,
                imagePreview: null
            });
            onClose();
        }
    };

    const getModalTitle = () => {
        return isPatientPage ? "Upload New Item" : "Create New Item";
    };

    const getSubmitButtonText = () => {
        if (loading) {
            return isPatientPage ? 'Uploading...' : 'Creating...';
        }
        return isPatientPage ? 'Upload Item' : 'Create Item';
    };

    return (
        <ModalOverlay show={show} onClose={handleClose}>
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold">{getModalTitle()}</CardTitle>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleClose}
                            disabled={loading}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Item Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Item Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter item name..."
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                disabled={loading}
                                className="w-full"
                                autoFocus={!isPatientPage}
                            />
                        </div>

                        {/* Image Upload - Only for Patient Pages */}
                        {isPatientPage && (
                            <div className="space-y-2">
                                <Label>Item Image</Label>
                                
                                {/* Image Preview */}
                                {formData.imagePreview ? (
                                    <div className="relative">
                                        <div className="aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-lg border">
                                            <img 
                                                src={formData.imagePreview} 
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={clearImage}
                                            disabled={loading}
                                            className="absolute top-2 right-2 h-8 w-8 p-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    /* Upload Area */
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={loading}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label 
                                            htmlFor="image-upload" 
                                            className="cursor-pointer flex flex-col items-center gap-3"
                                        >
                                            <div className="p-3 bg-muted rounded-full">
                                                <Upload className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Upload an image</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Click to browse or drag and drop
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    PNG, JPG up to 5MB
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                )}
                            </div>
                        )}

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
                                disabled={loading || !formData.name.trim() || (isPatientPage && !formData.imageFile)}
                                className="flex-1"
                            >
                                {isPatientPage && <ImageIcon className="h-4 w-4 mr-2" />}
                                {getSubmitButtonText()}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </ModalOverlay>
    );
};

CreateItemModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreateItem: PropTypes.func.isRequired,
}

export default CreateItemModal;