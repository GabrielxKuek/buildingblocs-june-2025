import { useState } from 'react';
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Upload, Image as ImageIcon, AlertCircle } from "lucide-react"

const CreateItemModalPatient = ({ show, onClose, onCreateItem }) => {
    const [formData, setFormData] = useState({
        name: '',
        imageFile: null,
        imagePreview: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (error) setError('');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            setError('');

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
            setError('Please enter an item name');
            return;
        }

        if (!formData.imageFile) {
            setError('Please upload an image');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const itemData = {
                name: formData.name,
                id: formData.id,
                imageFile: formData.imageFile
            };

            await onCreateItem(itemData);
            
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
            setError('Failed to create item');
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
            setError('');
            onClose();
        }
    };

    return (
        <Dialog open={show} onOpenChange={handleClose}>
            <DialogContent className="w-full max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Upload New Item</DialogTitle>
                </DialogHeader>

                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

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
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Item Image</Label>
                            
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
                                disabled={loading || !formData.name.trim() || !formData.imageFile}
                                className="flex-1"
                            >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                {loading ? 'Uploading...' : 'Upload Item'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

CreateItemModalPatient.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreateItem: PropTypes.func.isRequired,
}

export default CreateItemModalPatient;