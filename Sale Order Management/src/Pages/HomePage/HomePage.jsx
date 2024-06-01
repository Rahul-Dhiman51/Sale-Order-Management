import { useState } from 'react';
import { Box, Button, Tabs, TabList, TabPanels, Tab, TabPanel, useDisclosure } from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSaleOrders, createSaleOrder, updateSaleOrder } from '../../api';
import SaleOrderForm from '../../components/SaleOrderForm/SaleOrderForm';
import SaleOrderTable from '../../components/SaleOrderTable/SaleOrderTable';

const HomePage = () => {
    const queryClient = useQueryClient();

    const { data: orders = [], isLoading, isError } = useQuery({
        queryKey: ['saleOrders'],
        queryFn: fetchSaleOrders,
    });
    // console.log(orders)

    const createMutation = useMutation({
        mutationFn: createSaleOrder,
        onSuccess: () => {
            queryClient.invalidateQueries(['saleOrders']);
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateSaleOrder,
        onSuccess: () => {
            queryClient.invalidateQueries(['saleOrders']);
        }
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleEditClick = (order) => {
        setSelectedOrder(order);
        onEditOpen();
    };

    const handleSaveOrder = (updatedOrder) => {
        updateMutation.mutate(updatedOrder);
        onEditClose();
    };

    const handleCreateOrder = (newOrder) => {
        createMutation.mutate(newOrder);
        onClose();
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading data</div>;

    return (
        <Box p={5}>
            <Button onClick={onOpen} mb={4} colorScheme="teal">+ Sale Order</Button>
            <Tabs>
                <TabList>
                    <Tab>Active Sale Orders</Tab>
                    <Tab>Completed Sale Orders</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <SaleOrderTable orders={orders.filter(order => !order.paid)} onEditClick={handleEditClick} />
                    </TabPanel>
                    <TabPanel>
                        <SaleOrderTable orders={orders.filter(order => order.paid)} onEditClick={handleEditClick} readOnly />
                    </TabPanel>
                </TabPanels>
            </Tabs>

            {/* Create Sale Order Modal */}
            <SaleOrderForm isOpen={isOpen} onClose={onClose} onSubmit={handleCreateOrder} />

            {/* Edit Sale Order Modal */}
            {selectedOrder && (
                <SaleOrderForm
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    onSubmit={handleSaveOrder}
                    initialData={selectedOrder}
                />
            )}
        </Box>
    );
};

export default HomePage;
