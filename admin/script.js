// Sidebar Toggle
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
}

// Close sidebar on mobile when clicking outside (overlay)
// This is handled by the onclick attribute on the overlay div in HTML, 
// which calls toggleSidebar(), but let's ensure the overlay logic is robust.
// (The HTML <div class="sidebar-overlay" onclick="toggleSidebar()"></div> is sufficient)


// Modal Functions
function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if(modal) modal.classList.add('active');
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if(modal) modal.classList.remove('active');
}

function openEditProductModal() {
    const modal = document.getElementById('editProductModal');
    if(modal) modal.classList.add('active');
}

function closeEditProductModal() {
    const modal = document.getElementById('editProductModal');
    if(modal) modal.classList.remove('active');
}

function submitProduct() {
    alert('Product added successfully! (Demo)');
    closeAddProductModal();
}

function updateProduct() {
    alert('Product updated successfully! (Demo)');
    closeEditProductModal();
}

// Tag Input Logic
document.addEventListener('DOMContentLoaded', function() {
    const tagInput = document.getElementById('tagInput');
    const tagContainer = document.getElementById('tagContainer');

    if (tagInput && tagContainer) {
        tagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = this.value.trim();
                if (value) {
                    const tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.innerHTML = `${value} <span class="remove-tag">×</span>`;
                    
                    // Add click event for the remove button
                    tag.querySelector('.remove-tag').addEventListener('click', function() {
                        this.parentElement.remove();
                    });

                    tagContainer.insertBefore(tag, this);
                    this.value = '';
                }
            }
        });
    }

    // Close modal on outside click
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    }
});