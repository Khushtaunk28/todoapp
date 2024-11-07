import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export function AddItemForm({ onNewItem }) {
    const [newItem, setNewItem] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [itemCount, setItemCount] = useState(0); // Track number of items

    const submitNewItem = (e) => {
        e.preventDefault();

        // If the item count is already 5, show the alert and do not proceed
        if (itemCount >= 5) {
            window.alert("You cannot add more than 5 items.");
            return;
        }

        setSubmitting(true);

        const options = {
            method: 'POST',
            body: JSON.stringify({ name: newItem }),
            headers: { 'Content-Type': 'application/json' },
        };

        fetch('/api/items', options)
            .then((r) => r.json())
            .then((item) => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
                setItemCount((prevCount) => prevCount + 1); // Increment item count
            });
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    type="text"
                    placeholder="What's on your mind?"
                    aria-label="New item"
                    disabled={itemCount >= 5} // Disable input if limit reached
                />
                <Button
                    type="submit"
                    variant="success"
                    disabled={!newItem.length || itemCount >= 5} // Disable button if limit reached
                    className={submitting ? 'disabled' : ''}
                >
                    {submitting ? 'Adding...' : 'Add Item'}
                </Button>
            </InputGroup>
            {itemCount >= 5 && (
                <p style={{ color: 'red' }}>You cannot add more than 5 items.</p> // Message when limit is reached
            )}
        </Form>
    );
}

AddItemForm.propTypes = {
    onNewItem: PropTypes.func,
};
