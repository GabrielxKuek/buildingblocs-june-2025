// dependencies
import { useState } from "react";
import PropTypes from "prop-types";

// components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, Wand2, Save, X } from "lucide-react";
import Spinner from "@/components/system/Spinner";

const ManageItemsView = ({ items = [], onUpdateItem, onDeleteItem, onGenerateImage, loading = false }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({ name: '' });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setEditData({ name: item.name });
        setEditMode(false);
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
        if (!editMode) {
            setEditData({ name: selectedItem.name });
        }
    };

    const handleSaveChanges = async () => {
        if (!editData.name.trim()) {
            alert('Item name cannot be empty');
            return;
        }

        try {
            await onUpdateItem(selectedItem.id, editData);
            setSelectedItem({ ...selectedItem, ...editData });
            setEditMode(false);
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Failed to update item');
        }
    };

    const handleGenerateNewImage = async () => {
        setIsGenerating(true);
        try {
            const newImageUrl = await onGenerateImage(selectedItem.name);
            const updatedItem = { ...selectedItem, imageUrl: newImageUrl };
            await onUpdateItem(selectedItem.id, { imageUrl: newImageUrl });
            setSelectedItem(updatedItem);
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Failed to generate new image');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteItem = async () => {
        if (window.confirm(`Are you sure you want to delete "${selectedItem.name}"?`)) {
            try {
                await onDeleteItem(selectedItem.id);
                setSelectedItem(null);
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Failed to delete item');
            }
        }
    };

    const closeModal = () => {
        setSelectedItem(null);
        setEditMode(false);
    };

    if (loading) {
        return <Spinner message="Loading Items..." />;
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Manage Items</h2>
                <p className="text-muted-foreground">Click on any item to edit or manage</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => (
                    <Card 
                        key={item.id}
                        className="w-full hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
                        onClick={() => handleItemClick(item)}
                    >
                        <CardContent className="p-0">
                            <div className="aspect-square relative overflow-hidden rounded-t-lg">
                                {item.type === 'video' ? (
                                    <video 
                                        src={item.imageUrl} 
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                    />
                                ) : (
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-center line-clamp-2">
                                    {item.name}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Item Modal */}
            {selectedItem && (
                <Dialog open={!!selectedItem} onOpenChange={closeModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <span>Manage Item</span>
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
                            {/* Item Image */}
                            <div className="aspect-square relative overflow-hidden rounded-lg">
                                {selectedItem.type === 'video' ? (
                                    <video 
                                        src={selectedItem.imageUrl} 
                                        className="w-full h-full object-cover"
                                        controls
                                        muted
                                        loop
                                    />
                                ) : (
                                    <img 
                                        src={selectedItem.imageUrl} 
                                        alt={selectedItem.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Item Name - Edit Mode */}
                            {editMode ? (
                                <div className="space-y-2">
                                    <Label htmlFor="itemName">Item Name</Label>
                                    <Input
                                        id="itemName"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ name: e.target.value })}
                                        placeholder="Enter item name..."
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {editMode ? (
                                    // Edit Mode Buttons
                                    <div className="flex gap-2">
                                        <Button 
                                            onClick={handleSaveChanges}
                                            className="flex-1"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            onClick={handleEditToggle}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    // View Mode Buttons
                                    <>
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={handleEditToggle}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Name
                                            </Button>
                                            <Button 
                                                onClick={handleGenerateNewImage}
                                                disabled={isGenerating}
                                                className="flex-1"
                                            >
                                                <Wand2 className="h-4 w-4 mr-2" />
                                                {isGenerating ? 'Generating...' : 'New Image'}
                                            </Button>
                                        </div>
                                        
                                        <Button 
                                            onClick={handleDeleteItem}
                                            variant="destructive"
                                            className="w-full"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Item
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

ManageItemsView.propTypes = {
    items: PropTypes.array,
    onUpdateItem: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onGenerateImage: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default ManageItemsView;