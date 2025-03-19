document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost/api';
    
    const loadProducts = async () => {
        try {
            const response = await fetch(`${API_BASE}/getProduct.php`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const products = await response.json();
            renderProducts(products);
            
        } catch (error) {
            console.error('Fetch Error:', error);
            showMessage('Errore nel caricamento dei prodotti', 'error');
        }
    };

    const renderProducts = (products) => {
        const html = products.length > 0 
            ? products.map(product => `
                <div class="product-card">
                    <div class="image-container">
                        <img src="http://localhost${product.percorso_immagine}" 
                             alt="${product.nome}" 
                             class="product-image">
                    </div>
                    <div class="product-info">
                        <h3>${product.nome}</h3>
                        <p class="price">€${product.prezzo.toFixed(2)}</p>
                        <span class="category">${product.categoria}</span>
                    </div>
                </div>
              `).join('')
            : '<p class="empty">Nessun prodotto disponibile</p>';
        
        document.getElementById('productsList').innerHTML = html;
    };

    // Resto del codice...
});