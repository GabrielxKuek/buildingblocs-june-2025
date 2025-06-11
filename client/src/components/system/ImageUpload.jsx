// dependencies
import { useState } from "react";
import PropTypes from "prop-types";

// components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, AlertCircle } from "lucide-react";

const ImageUpload = ({ 
    onImageChange, 
    disabled = false, 
    label = "Image", 
    maxSizeMB = 5,
    accept = "image/*",
    className = ""
}) => {
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');

    const validateFile = (file) => {
        if (!file.type.startsWith('image/')) {
            throw new Error('Please select a valid image file');
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            throw new Error(`File size must be less than ${maxSizeMB}MB`);
        }

        return true;
    };

    const handleFileChange = (file) => {
        if (!file) return;

        try {
            validateFile(file);
            
            // Clear any previous errors
            setError('');
            
            // create preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            
            // call parent callback
            if (onImageChange) {
                onImageChange(file, previewUrl);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInputChange = (e) => {
        const file = e.target.files[0];
        handleFileChange(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const clearImage = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setPreview(null);
        setError('');
        
        // clear file input
        const input = document.getElementById('image-upload-input');
        if (input) {
            input.value = '';
        }
        
        // call parent callback
        if (onImageChange) {
            onImageChange(null, null);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <Label>{label}</Label>}
            
            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            {preview ? (
                // preview mode
                <div className="relative">
                    <div className="aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-lg border">
                        <img 
                            src={preview} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={clearImage}
                        disabled={disabled}
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                // upload mode
                <div 
                    className={`
                        border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                        ${dragActive 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        id="image-upload-input"
                        type="file"
                        accept={accept}
                        onChange={handleInputChange}
                        disabled={disabled}
                        className="hidden"
                    />
                    <label 
                        htmlFor="image-upload-input" 
                        className={`cursor-pointer flex flex-col items-center gap-3 ${disabled ? 'cursor-not-allowed' : ''}`}
                    >
                        <div className="p-3 bg-muted rounded-full">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium">
                                {dragActive ? 'Drop image here' : 'Upload an image'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Click to browse or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG up to {maxSizeMB}MB
                            </p>
                        </div>
                    </label>
                </div>
            )}
        </div>
    );
};

ImageUpload.propTypes = {
    onImageChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    maxSizeMB: PropTypes.number,
    accept: PropTypes.string,
    className: PropTypes.string,
};

export default ImageUpload;