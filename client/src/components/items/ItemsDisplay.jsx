import PropTypes from "prop-types";

import { useState } from "react";
import ItemCard from "./ItemCard";
import ItemModal from "./ItemModal";
import Spinner from "@/components/system/Spinner"

const ItemsDisplay = ({ items = [], onSendToCaregiver, loading = false }) => {
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => (
                    <ItemCard 
                        key={item.id} 
                        item={item} 
                        onClick={handleItemClick}
                    />
                ))}
            </div>

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

ItemsDisplay.propTypes = {
    items: PropTypes.array,
    onSendToCaregiver: PropTypes.func.isRequired,
    loading: PropTypes.bool,
}

export default ItemsDisplay;