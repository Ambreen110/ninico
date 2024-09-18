document.getElementById('file-input').addEventListener('change', handleFile);

const cart = [];

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);

        populateProducts(json);
    };

    reader.readAsArrayBuffer(file);
}

function populateProducts(products) {
    const productList = document.getElementById('product-list');
    const productTemplate = document.getElementById('product-template').cloneNode(true);

    productTemplate.style.display = "block";

    products.forEach(product => {
        const productElement = productTemplate.cloneNode(true);

        productElement.querySelector('.product-name').textContent = product['SKU Name'];
        productElement.querySelector('.product-brand').textContent = product['Brand Name'];
        productElement.querySelector('.product-price').textContent = product['Sale'].toFixed(2);

        productElement.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            addToCart(product);
        });

        productList.appendChild(productElement);
    });
}

function addToCart(product) {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cart.push(product);

    const cartItem = document.createElement('li');
    cartItem.textContent = `${product['SKU Name']} - $${product['Sale'].toFixed(2)}`;
    cartItems.appendChild(cartItem);

    const total = cart.reduce((sum, item) => sum + item['Sale'], 0);
    cartTotal.textContent = total.toFixed(2);
}
