document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost/api';
    const form = document.getElementById('productForm');
    const fileInput = document.getElementById('immagine');
    const fileInfo = document.getElementById('fileInfo');
    const searchInput = document.getElementById('searchInput');
    const productsList = document.getElementById('productsList');

    // Gestione upload file
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileInfo.textContent = `${file.name} (${(file.size/1024).toFixed(2)} KB)`;
        }
    });

    // Caricamento prodotti
    const loadProducts = async (searchTerm = '') => {
        try {
            const response = await fetch(`${API_BASE}/getProduct.php?search=${encodeURIComponent(searchTerm)}`);
            const products = await response.json();
            
            productsList.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="/assets/img/${product.percorso_immagine}" alt="${product.nome}">
                    <div class="product-info">
                        <h3>${product.nome}</h3>
                        <div class="product-price">€${parseFloat(product.prezzo).toFixed(2)}</div>
                        <div class="product-category">${product.categoria}</div>
                        <p class="product-description">${product.descrizione}</p>
                        <div class="product-stock">Disponibili: ${product.quantita}</div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Errore nel caricamento prodotti:', error);
            productsList.innerHTML = '<div class="error-message">Errore nel caricamento dei prodotti</div>';
        }
    };

    // Ricerca in tempo reale
    searchInput.addEventListener('input', (e) => {
        loadProducts(e.target.value);
    });

    // Submit form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        try {
            const response = await fetch(`${API_BASE}/addProduct.php`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                form.reset();
                fileInfo.textContent = 'Formati supportati: JPG, PNG';
                loadProducts();
            }
        } catch (error) {
            console.error('Errore nell\'invio:', error);
        }
    });

    // Caricamento iniziale
    loadProducts();
});