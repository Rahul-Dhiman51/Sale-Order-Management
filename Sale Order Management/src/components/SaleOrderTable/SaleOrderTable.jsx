import { useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, IconButton } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

const SaleOrderTable = ({ orders, onEditClick, readOnly }) => {
    console.log("orders", orders)
    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>Customer Name</Th>
                    <Th>Price (₹)</Th>
                    <Th>Last Modified</Th>
                    <Th>Edit/View</Th>
                </Tr>
            </Thead>
            <Tbody>
                {orders.map(order => (
                    <Tr key={order.id}>
                        <Td>{order.id}</Td>
                        <Td>{order.customer_profile?.name ?? 'Unknown'}</Td>
                        <Td>₹ {order.total_price}</Td>
                        <Td>{order.lastModified}</Td>
                        <Td>
                            <IconButton
                                icon={<EditIcon />}
                                onClick={() => onEditClick(order)}
                                isDisabled={readOnly}
                            />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default SaleOrderTable;
