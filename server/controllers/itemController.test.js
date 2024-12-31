const itemController = require('./itemController');

test('getItem should return the correct item', () => {
	const item = itemController.getItem(1);
	expect(item).toEqual({ id: 1, name: 'Item 1' });
});

test('createItem should add a new item', () => {
	const newItem = { name: 'New Item' };
	const createdItem = itemController.createItem(newItem);
	expect(createdItem).toHaveProperty('id');
	expect(createdItem.name).toBe(newItem.name);
});

test('updateItem should modify the existing item', () => {
	const updatedItem = itemController.updateItem(1, { name: 'Updated Item' });
	expect(updatedItem.name).toBe('Updated Item');
});

test('deleteItem should remove the item', () => {
	const result = itemController.deleteItem(1);
	expect(result).toBe(true);
	const item = itemController.getItem(1);
	expect(item).toBeUndefined();
});