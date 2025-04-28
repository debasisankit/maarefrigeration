document.addEventListener('DOMContentLoaded', function() {
    const itemList = document.getElementById('itemList');
    const addItemBtn = document.getElementById('addItemBtn');
    const newItemDescriptionInput = document.getElementById('newItemDescription');
    const newItemPriceInput = document.getElementById('newItemPrice');
    const goToBillingBtn = document.getElementById('goToBilling');

    let items = JSON.parse(localStorage.getItem('billingItems')) || [];

    function renderItems() {
        itemList.innerHTML = '';
        items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.description} - ₹${item.price.toFixed(2)}</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            itemList.appendChild(listItem);
        });
    }

    renderItems();

   addItemBtn.addEventListener('click', function() {
    const description = newItemDescriptionInput.value.trim();
    const price = parseFloat(newItemPriceInput.value);

    if (description && !isNaN(price)) {
        items.push({ description, price });
        localStorage.setItem('billingItems', JSON.stringify(items));
        newItemDescriptionInput.value = '';
                newItemPriceInput.value = '';
                renderItems();
            }
        });

    itemList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const indexToDelete = parseInt(event.target.dataset.index);
            items.splice(indexToDelete, 1);
            localStorage.setItem('billingItems', JSON.stringify(items));
            renderItems();
        }
    });

    goToBillingBtn.addEventListener('click', function() {
        window.location.href = 'billing.html';
    });
});