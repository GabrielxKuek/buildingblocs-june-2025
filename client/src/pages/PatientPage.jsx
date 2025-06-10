import { useState, useEffect } from 'react';
import ItemsDisplay from "@/components/items/ItemsDisplay"
import { getPatientItems, sendItemToCaregiver } from "@/services/api/patient"

const PatientPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        setLoading(true);
        const data = await getPatientItems();
        setItems(data);
        setLoading(false);
    };

    const handleSendToCaregiver = async (item) => {
        await sendItemToCaregiver(item);
    };

    return (
        <>
            <ItemsDisplay 
                items={items} 
                onSendToCaregiver={handleSendToCaregiver}
                loading={loading}
            />
        </>
    );
};

export default PatientPage;