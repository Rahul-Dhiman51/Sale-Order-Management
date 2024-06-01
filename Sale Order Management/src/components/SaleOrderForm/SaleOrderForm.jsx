import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
    Box,
    Flex,
    Text,
    Badge,
    Checkbox,
    useColorMode,
    useColorModeValue
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchCustomers } from '../../api';
import Select from 'react-select';

const SaleOrderForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: { items: [], invoice_date: null, products: [], customer_id: null, total_price: '', invoice_no: '' },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const { data: products = [], isLoading: isLoadingProducts, isError: isErrorProducts } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

    const { data: customers = [], isLoading: isLoadingCustomers, isError: isErrorCustomers } = useQuery({
        queryKey: ['customers'],
        queryFn: fetchCustomers,
    });

    const productOptions = products.map((product) => ({
        label: product.name,
        value: product.id,
    }));

    const customerOptions = customers.map((customer) => ({
        label: `${customer.customer_profile.name} (${customer.customer_profile.id})`,
        value: customer.customer_profile.id,
    }));

    const [selectedProducts, setSelectedProducts] = useState([]);

    const { colorMode } = useColorMode();
    const backgroundColor = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('black', 'white');
    const placeholderColor = useColorModeValue('gray.400', 'gray.500');

    useEffect(() => {
        if (initialData && products.length > 0 && customers.length > 0) {
            const initialSelectedProducts = products.filter(product =>
                product.sku.some(sku => initialData.items.some(item => item.sku_id === sku.id))
            );
            setSelectedProducts(initialSelectedProducts);

            reset({
                customer_id: initialData.customer_profile.id, // Use customer id here
                invoice_date: new Date(initialData.invoice_date),
                products: initialSelectedProducts.map(product => ({
                    label: product.name,
                    value: product.id
                })),
                items: initialData.items.map(item => ({
                    sku_id: item.sku_id,
                    price: item.price,
                    quantity: item.quantity,
                })),
                total_price: initialData.total_price,
                invoice_no: initialData.invoice_no,
            });
        }
    }, [initialData, products, customers, reset]);


    const onProductChange = (selectedOptions) => {
        const selectedProducts = selectedOptions.map(option =>
            products.find(product => product.id === option.value)
        );
        setSelectedProducts(selectedProducts);

        // Clear existing items and append new items based on selected products
        remove();
        selectedProducts.forEach(product => {
            product.sku.forEach(sku => {
                append({ sku_id: sku.id, price: sku.selling_price, quantity: 0 });
            });
        });
    };

    const onSubmitHandler = (data) => {
        // console.log("Data", data);
        const filteredItems = data.items.filter(item => item.quantity && item.price);

        const transformedData = {
            id: initialData?.id,
            customer_id: data.customer_id,
            items: filteredItems.map(item => ({
                sku_id: item.sku_id,
                price: item.price,
                quantity: parseInt(item.quantity, 10),
            })),
            paid: data.paid,
            invoice_date: data.invoice_date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
        };

        console.log(transformedData);

        onSubmit(transformedData);

        reset();
    };


    if (isLoadingProducts || isLoadingCustomers) {
        return <div>Loading...</div>;
    }

    if (isErrorProducts || isErrorCustomers) {
        return <div>Error loading data.</div>;
    }

    return (
        <Modal isOpen={isOpen} size={"xl"} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {initialData ? 'Edit Sale Order' : 'Create Sale Order'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmitHandler)}>
                        <FormControl>
                            <FormLabel>Customer</FormLabel>
                            <Controller
                                name="customer_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={customerOptions}
                                        onChange={(option) => {
                                            field.onChange(option.value);
                                        }}
                                        value={customerOptions.find(option => option.value === field.value)}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                backgroundColor,
                                                color: textColor,
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                backgroundColor: "white",
                                            }),
                                            singleValue: (provided) => ({
                                                ...provided,
                                                color: textColor,
                                            }),
                                            placeholder: (provided) => ({
                                                ...provided,
                                                color: placeholderColor,
                                            }),
                                            option: (provided, state) => ({
                                                ...provided,
                                                backgroundColor: backgroundColor,
                                                color: "black",
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Select Products</FormLabel>
                            <Controller
                                name="products"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={productOptions}
                                        isMulti={true}
                                        onChange={(options) => {
                                            field.onChange(options);
                                            onProductChange(options);
                                        }}
                                        value={field.value}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                backgroundColor,
                                                color: textColor,
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                backgroundColor: "white",
                                            }),
                                            multiValue: (provided) => ({
                                                ...provided,
                                                backgroundColor,
                                            }),
                                            multiValueLabel: (provided) => ({
                                                ...provided,
                                                color: textColor,
                                            }),
                                            placeholder: (provided) => ({
                                                ...provided,
                                                color: placeholderColor,
                                            }),
                                            option: (provided, state) => ({
                                                ...provided,
                                                backgroundColor: state.isSelected ? backgroundColor : state.isFocused ? backgroundColor : backgroundColor,
                                                color: "black",
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                        {fields.map((item, index) => {
                            const product = products.find(product => product.sku.some(sku => sku.id === item.sku_id));
                            const sku = product.sku.find(sku => sku.id === item.sku_id);
                            return (
                                <Box key={item.id} p={4} borderWidth="1px" borderRadius="md" mb={4}>
                                    <Flex justifyContent="space-between">
                                        <Text>SKU {sku.id} ({sku.amount} {sku.unit})</Text>
                                        <Text>Rate: ₹ {sku.selling_price}</Text>
                                    </Flex>
                                    <Flex mt={2}>
                                        <Box flex="1" mr={2}>
                                            <Text>Selling Rate</Text>
                                            <Controller
                                                name={`items[${index}].price`}
                                                control={control}
                                                defaultValue={sku.selling_price}
                                                render={({ field }) => <Input {...field} />}
                                            />
                                        </Box>
                                        <Box flex="1">
                                            <Text>Total Items</Text>
                                            <Controller
                                                name={`items[${index}].quantity`}
                                                control={control}
                                                defaultValue={0}
                                                render={({ field }) => <Input {...field} />}
                                            />
                                        </Box>
                                    </Flex>
                                    <Badge mt={2} colorScheme="green">
                                        {sku.quantity_in_inventory} Item(s) Remaining
                                    </Badge>
                                </Box>
                            );
                        })}
                        <FormControl mt={4}>
                            <FormLabel>Paid</FormLabel>
                            <Controller
                                name="paid"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox {...field} isChecked={field.value} />
                                )}
                            />
                        </FormControl>
                        {/* <FormControl mt={4}>
                            <FormLabel>Price (₹)</FormLabel>
                            <Controller
                                name="total_price"
                                control={control}
                                render={({ field }) => (
                                    <Input type="number" {...field} />
                                )}
                            />
                        </FormControl> */}
                        {initialData && (
                            <FormControl mt={4} >
                                <FormLabel>Invoice No</FormLabel>
                                <Controller
                                    name="invoice_no"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} />
                                    )}
                                />
                            </FormControl>
                        )}
                        <FormControl mt={4}>
                            <FormLabel>Invoice Date</FormLabel>
                            <Controller
                                control={control}
                                name="invoice_date"
                                render={({ field }) => (
                                    <Box
                                        sx={{
                                            '.react-datepicker-wrapper': {
                                                width: '70%',
                                            },
                                            '.react-datepicker__input-container': {
                                                width: '70%',
                                            },
                                            '.react-datepicker-ignore-onclickoutside': {
                                                width: '70%',
                                            },
                                            input: {
                                                width: '70%',
                                                borderColor: 'inherit',
                                                padding: '0.5rem',
                                                borderRadius: '0.25rem',
                                                height: '2.5rem',
                                                backgroundColor: backgroundColor,
                                            },
                                        }}
                                    >
                                        <DatePicker
                                            {...field}
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            customInput={<Input autoComplete="off" />}
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </Box>
                                )}
                            />
                        </FormControl>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} type="submit">
                                Save
                            </Button>
                            <Button variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SaleOrderForm;
