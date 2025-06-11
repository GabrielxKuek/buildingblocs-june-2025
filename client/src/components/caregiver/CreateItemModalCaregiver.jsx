import { useState } from 'react';
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CreateItemModalCaregiver = ({ show, onClose, onCreateItem }) => {
    const [formData, setFormData] = useState({
        name: ''
    });
    const [loading, setLoading] = useState(false);

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
        
        try {
            const itemData = {
                name: formData.name,
                id: Date.now() // Simple ID generation
            };

            await onCreateItem(itemData);
            
            // Reset form
            setFormData({
                name: ''
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
            setFormData({
                name: ''
            });
            onClose();
        }
    };

    return (
        <Dialog open={show} onOpenChange={handleClose}>
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
                                placeholder="Enter item name..."
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                disabled={loading}
                                className="w-full"
                                autoFocus
                            />
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
                                {loading ? 'Creating...' : 'Create Item'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

CreateItemModalCaregiver.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreateItem: PropTypes.func.isRequired,
}

export default CreateItemModalCaregiver;