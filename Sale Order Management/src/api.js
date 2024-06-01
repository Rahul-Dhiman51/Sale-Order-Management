const customersData = [{
    id: 10,
    customer: 11909,
    customer_profile: {
        id: 11909,
        name: "Shyam",
        color: [255, 127, 80],
        email: "shyam@example.com",
        pincode: "Delhi",
        location_name: "New Delhi, Delhi, India",
        type: "B",
        profile_pic: null,
        gst: ""
    }
},
{
    id: 11,
    customer: 11910,
    customer_profile: {
        id: 11910,
        name: "Sita",
        color: [0, 255, 0],
        email: "sita@example.com",
        pincode: "Bangalore",
        location_name: "Bangalore, Karnataka, India",
        type: "A",
        profile_pic: null,
        gst: ""
    }
}];

const saleOrdersData = [
    {
        "id": 1,
        "customer_id": 11909,
        "items": [
            {
                "sku_id": 246,
                "price": 100,
                "quantity": 12
            }
        ],
        "total_price": 1200,
        "paid": false,
        "invoice_no": "Invoice - 1212121",
        "invoice_date": "2024-05-07",
        "lastModified": "2024-05-07 (10:00 PM)"
    },
    {
        "id": 2,
        "customer_id": 11909,
        "items": [
            {
                "sku_id": 247,
                "price": 210,
                "quantity": 5
            }
        ],
        "total_price": 1050,
        "paid": true,
        "invoice_no": "Invoice - 1212122",
        "invoice_date": "2024-05-07",
        "lastModified": "2024-05-07 (10:00 AM)"
    }
];

const productsData = [
    {
        "id": 209,
        "display_id": 8,
        "owner": 1079,
        "name": "New Product",
        "category": "The god of War",
        "characteristics": "New Product Characteristics",
        "features": " ",
        "brand": "New Product Brand",
        "sku": [
            {
                "id": 248,
                "selling_price": 54,
                "max_retail_price": 44,
                "amount": 33,
                "unit": "kg",
                "quantity_in_inventory": 0,
                "product": 209
            },
            {
                "id": 247,
                "selling_price": 32,
                "max_retail_price": 32,
                "amount": 33,
                "unit": "kg",
                "quantity_in_inventory": 0,
                "product": 209
            },
            {
                "id": 246,
                "selling_price": 23,
                "max_retail_price": 21,
                "amount": 22,
                "unit": "kg",
                "quantity_in_inventory": 1,
                "product": 209
            }
        ],
        "updated_on": "2024-05-31T10:00:00Z",
        "adding_date": "2024-05-30T10:00:00Z"
    },
    {
        "id": 210,
        "display_id": 9,
        "owner": 1080,
        "name": "New Product 2",
        "category": "The god of War",
        "characteristics": "New Product 2 Characteristics",
        "features": "Feature A, Feature B",
        "brand": "New Product Brand 2",
        "sku": [
            {
                "id": 249,
                "selling_price": 60,
                "max_retail_price": 50,
                "amount": 40,
                "unit": "kg",
                "quantity_in_inventory": 5,
                "product": 210
            },
            {
                "id": 250,
                "selling_price": 35,
                "max_retail_price": 30,
                "amount": 25,
                "unit": "kg",
                "quantity_in_inventory": 10,
                "product": 210
            },
            {
                "id": 251,
                "selling_price": 20,
                "max_retail_price": 18,
                "amount": 15,
                "unit": "kg",
                "quantity_in_inventory": 8,
                "product": 210
            }
        ],
        "updated_on": "2024-06-01T08:00:00Z",
        "adding_date": "2024-05-29T08:00:00Z"
    },
    {
        "id": 211,
        "display_id": 10,
        "owner": 1081,
        "name": "New Product 3",
        "category": "The god of War",
        "characteristics": "New Product 3 Characteristics",
        "features": "Feature X, Feature Y",
        "brand": "New Product Brand 3",
        "sku": [
            {
                "id": 252,
                "selling_price": 75,
                "max_retail_price": 70,
                "amount": 50,
                "unit": "kg",
                "quantity_in_inventory": 3,
                "product": 211
            },
            {
                "id": 253,
                "selling_price": 40,
                "max_retail_price": 35,
                "amount": 30,
                "unit": "kg",
                "quantity_in_inventory": 6,
                "product": 211
            },
            {
                "id": 254,
                "selling_price": 25,
                "max_retail_price": 22,
                "amount": 20,
                "unit": "kg",
                "quantity_in_inventory": 7,
                "product": 211
            }
        ],
        "updated_on": "2024-06-02T09:00:00Z",
        "adding_date": "2024-05-28T09:00:00Z"
    }
];

export const fetchSaleOrders = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            saleOrdersData.forEach(order => {
                const customer = customersData.find(cust => cust.customer === order.customer_id);
                if (customer) {
                    order.customer_profile = customer.customer_profile;
                }
            });
            resolve(saleOrdersData);
        }, 100);
    });
};

export const fetchCustomersByEmail = async (email) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const customer = customersData.find(cust => cust.customer_profile.email === email);
            resolve(customer);
        }, 300);
    });
};

const generateNewInvoiceNo = () => {
    const lastInvoiceNo = saleOrdersData[saleOrdersData.length - 1].invoice_no;
    const lastInvoiceNumber = parseInt(lastInvoiceNo.split(' - ')[1]);
    const newInvoiceNumber = lastInvoiceNumber + 1;
    return `Invoice - ${newInvoiceNumber}`;
};

const totalAmount = (items) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

function getCurrentFormattedDate() {
    // Get the current date and time as an ISO string
    const isoDate = new Date().toISOString();

    // Create a new Date object from the ISO string
    const date = new Date(isoDate);

    // Extract the date part (YYYY-MM-DD)
    const datePart = date.toISOString().split('T')[0];

    // Extract the time part and convert to 12-hour format
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };
    const timePart = date.toLocaleTimeString('en-US', timeOptions);

    // Combine date and time parts in the desired format
    const formattedDate = `${datePart} (${timePart})`;

    return formattedDate;
}

export const createSaleOrder = async (newOrder) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const customer = customersData.find(cust => cust.customer === newOrder.customer_id);
            const newSaleOrder = {
                ...newOrder,
                id: saleOrdersData.length + 1,
                invoice_no: generateNewInvoiceNo(),
                total_price: totalAmount(newOrder.items),
                lastModified: getCurrentFormattedDate(),
                customer_profile: customer.customer_profile, // Add customer_profile here
            };
            saleOrdersData.push(newSaleOrder);
            resolve(newSaleOrder);
        }, 500);
    });
};

export const updateSaleOrder = async (updatedOrder) => {
    console.log("updatedOrder", updatedOrder);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = saleOrdersData.findIndex(order => order.id === updatedOrder.id);
            if (index !== -1) {
                const customer = customersData.find(cust => cust.customer === updatedOrder.customer_id);
                console.group("customer", customer);
                saleOrdersData[index] = {
                    ...saleOrdersData[index],
                    ...updatedOrder,
                    total_price: totalAmount(updatedOrder.items),
                    lastModified: getCurrentFormattedDate(),
                    customer_profile: customer.customer_profile, // Add customer_profile here
                };
                resolve(saleOrdersData[index]);
            } else {
                reject(new Error("Sale order not found"));
            }
        }, 500);
    });
};

export const fetchProducts = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(productsData);
        }, 500);
    });
};

export const fetchCustomers = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(customersData);
        }, 500);
    });
};