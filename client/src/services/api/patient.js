const DUMMY_ITEMS = [
    {
        id: 1,
        name: "Coffee",
        imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
        type: "image"
    },
    {
        id: 2,
        name: "Water",
        imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
        type: "image"
    },
    {
        id: 3,
        name: "Medicine",
        imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
        type: "image"
    },
    {
        id: 4,
        name: "Food",
        imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
        type: "image"
    },
    {
        id: 5,
        name: "Help",
        imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
        type: "image"
    },
    {
        id: 6,
        name: "Bathroom",
        imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
        type: "image"
    }
];

export const getPatientItems = async () => {
    // simulate api call
    await new Promise(resolve => setTimeout(resolve, 500));
    return DUMMY_ITEMS;
};

export const sendItemToCaregiver = async (item) => {
    // simulate api call
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Sending to caregiver:', item.name);
    return { success: true };
};