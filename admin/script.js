// Sidebar Toggle
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
}

// --- RENDER ADMIN TABLE ---
function renderAdminProductTable() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return; // Might be on dashboard page

    // ProductManager is now globally available from ../js/products-data.js
    const products = ProductManager.getAllProducts();
    tbody.innerHTML = ''; // Clear existing

    products.forEach(product => {
        const tr = document.createElement('tr');
        
        // Status Badge Logic
        let statusBadge = '';
        if (product.status === 'In Stock' || product.status === 'Active') statusBadge = '<span class="badge badge-success">Active</span>';
        else if (product.status === 'Out of Stock') statusBadge = '<span class="badge badge-danger">Out of Stock</span>';
        else statusBadge = '<span class="badge badge-warning">' + product.status + '</span>';

        // Image path handling: if it's a local filename, it needs ../ because admin is in a subfolder
        let imgPath = product.image;
        if (imgPath && !imgPath.startsWith('http') && !imgPath.startsWith('data:') && !imgPath.startsWith('../')) {
            imgPath = '../' + imgPath; 
        }

        tr.innerHTML = `
            <td data-label="Product">
                <div class="product-cell">
                    <div class="product-image" style="background: white; border: 1px solid #eee; display: flex; align-items: center; justify-content: center;">
                        <img src="${imgPath}" alt="" style="max-width:100%; max-height:100%; object-fit:contain;">
                    </div>
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <p>${product.sku}</p>
                    </div>
                </div>
            </td>
            <td data-label="Category">${product.category}</td>
            <td data-label="SKU">${product.sku}</td>
            <td data-label="Price">${product.price}</td>
            <td data-label="Status">${statusBadge}</td>
            <td data-label="Actions">
                <div class="action-btns">
                    <button class="btn btn-icon btn-secondary" title="Edit" onclick="alert('Edit feature coming soon')">✏️</button>
                    <button class="btn btn-icon btn-danger" title="Delete" onclick="deleteProduct('${product.id}')">🗑️</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteProduct(id) {
    if(confirm('Are you sure you want to delete this product?')) {
        ProductManager.deleteProduct(id);
        renderAdminProductTable();
    }
}


// --- MODAL FUNCTIONS ---
function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if(modal) modal.classList.add('active');
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if(modal) {
        modal.classList.remove('active');
        document.getElementById('addProductForm').reset();
        document.getElementById('tagContainer').innerHTML = '<input type="text" class="tag-input" placeholder="Type and press Enter..." id="tagInput">';
        setupTagInput(); // Re-bind listener
    }
}

function openEditProductModal() {
    const modal = document.getElementById('editProductModal');
    if(modal) modal.classList.add('active');
}

function closeEditProductModal() {
    const modal = document.getElementById('editProductModal');
    if(modal) modal.classList.remove('active');
}

// --- FORM HANDLING ---
function submitProduct() {
    // Gather form data
    const form = document.getElementById('addProductForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    const data = {};
    
    // Simple ID generation
    data.id = 'prod-' + Date.now(); 
    
    // Map fields (Manual mapping for better control)
    data.name = inputs[0].value;
    data.sku = inputs[1].value;
    data.category = inputs[2].value;
    data.price = inputs[3].value;
    data.status = inputs[4].value;
    data.manufacturer = inputs[5].value;
    data.description = inputs[6].value;
    data.detailedDescription = inputs[7].value;

    // Get Tags
    const tags = [];
    document.querySelectorAll('#tagContainer .tag').forEach(tagSpan => {
        tags.push(tagSpan.innerText.replace('×', '').trim());
    });
    data.features = tags;

    // Specs (Mock specs for now since UI doesn't have spec fields)
    data.specs = {
        "Manufacturer": data.manufacturer,
        "SKU": data.sku
    };

    // Image (Mock - use placeholder if none selected)
    // In a real app, you'd upload this. Here we just set a default or try to get file name.
    const fileInput = document.getElementById('imageInput');
    if (fileInput.files.length > 0) {
        // We can't actually upload, so we fake the path to one of the existing images for demo purposes
        // or just use the filename if it was in the same folder
        data.image = fileInput.files[0].name; 
    } else {
        data.image = "images/Product 1.jpeg"; // Default fallback
    }

    if (!data.name || !data.sku) {
        alert("Please fill in required fields.");
        return;
    }

    // Save
    ProductManager.addProduct(data);
    
    alert('Product added successfully!');
    closeAddProductModal();
    renderAdminProductTable(); // Refresh table
}


// --- INITIALIZATION ---
function setupTagInput() {
    const tagInput = document.getElementById('tagInput');
    const tagContainer = document.getElementById('tagContainer');

    if (tagInput && tagContainer) {
        // Remove old listeners to avoid duplicates if re-initializing
        const newInput = tagInput.cloneNode(true);
        tagInput.parentNode.replaceChild(newInput, tagInput);

        newInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = this.value.trim();
                if (value) {
                    const tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.innerHTML = `${value} <span class="remove-tag">×</span>`;
                    
                    tag.querySelector('.remove-tag').addEventListener('click', function() {
                        this.parentElement.remove();
                    });

                    tagContainer.insertBefore(tag, this);
                    this.value = '';
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupTagInput();
    renderAdminProductTable();

    // Close modal on outside click
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            // Check which modal and close it
            if(event.target.id === 'addProductModal') closeAddProductModal();
            if(event.target.id === 'editProductModal') closeEditProductModal();
        }
    }
});

