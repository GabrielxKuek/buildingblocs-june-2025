// dependencies
import PropTypes from "prop-types";
import { useState } from "react";

// components
import ItemCard from "@/components/items/ItemCard";
import ItemModal from "@/components/items/ItemModal";
import Spinner from "@/components/system/Spinner";

const PatientItemsView = ({ items = [], onSendToCaregiver, loading = false }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const closeModal = () => {
        setSelectedItem(null);
    };

    const handleSendToCaretaker = (item) => {
        if (onSendToCaregiver) {
            onSendToCaregiver(item);
        }
        closeModal();
    };

    const handleSpeak = (itemName) => {
        console.log(`Speaking item name: ${itemName}`);
        const utterance = new SpeechSynthesisUtterance(itemName);
        speechSynthesis.speak(utterance);
        console.log('Speaking done!');
    };

    if (loading) {
        return <Spinner message="Loading Items..." />
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">My Items</h2>
                <p className="text-muted-foreground">Click on any item to interact</p>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No items yet</p>
                    <p className="text-muted-foreground">Upload more items using the button in the sidebar</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {items.map((item) => (
                        <ItemCard 
                            key={item.id} 
                            item={item} 
                            onClick={handleItemClick}
                        />
                    ))}
                </div>
            )}

            {selectedItem && (
                <ItemModal 
                    item={selectedItem}
                    onClose={closeModal}
                    onSendToCaretaker={handleSendToCaretaker}
                    onSpeak={handleSpeak}
                />
            )}
        </div>
    );
};

PatientItemsView.propTypes = {
    items: PropTypes.array,
    onSendToCaregiver: PropTypes.func.isRequired,
    loading: PropTypes.bool,
}

export default PatientItemsView;