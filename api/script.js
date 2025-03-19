document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const productsList = document.getElementById('productsList');
    const imagePreview = document.getElementById('imagePreview');

    // Preview immagine
    document.getElementById('immagine').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    // Gestione submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch('api/addProduct.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                showMessage('Prodotto aggiunto con successo!', 'success');
                form.reset();
                imagePreview.style.display = 'none';
                loadProducts();
            } else {
                showMessage(data.message, 'error');
            }
        } catch (error) {
            showMessage('Errore di connessione', 'error');
        }
    });

    // Mostra messaggi
    const showMessage = (message, type) => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${type}`;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);

        setTimeout(() => alertDiv.remove(), 3000);
    };

    // Carica prodotti
    const loadProducts = async () => {
        try {
            const response = await fetch('api/getProduct.php');
            const products = await response.json();
            
            productsList.innerHTML = products.map(product => `
                <div class="product-card">
                    <div class="image-container">
                        <img src="${product.percorso_immagine}" alt="${product.nome}" class="product-image">
                    </div>
                    <div class="product-info">
                        <h3>${product.nome}</h3>
                        <p class="price">€${product.prezzo.toFixed(2)}</p>
                        <span class="category">${product.categoria}</span>
                    </div>
                </div>
            `).join('') || '<p class="empty">Nessun prodotto disponibile</p>';
            
        } catch (error) {
            productsList.innerHTML = '<p class="error">Errore nel caricamento dei prodotti</p>';
        }
    };

    loadProducts();
});