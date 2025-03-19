document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost/api';
    const CURRENCY_API = 'https://api.frankfurter.app/latest?from=EUR';
    
    // Tassi di fallback aggiornati
    const FALLBACK_RATES = {
        USD: 1.08,
        GBP: 0.86,
        JPY: 169.50,
        EUR: 1,
        CHF: 0.95,
        AUD: 1.68,
        CAD: 1.47
    };

    let exchangeRates = {...FALLBACK_RATES};
    let selectedCurrency = 'EUR';
    let lastUpdate = Date.now();

    // Elementi DOM
    const currencySelect = document.getElementById('currencySelect');
    const productsList = document.getElementById('productsList');
    const searchInput = document.getElementById('searchInput');
    const form = document.getElementById('productForm');
    const fileInput = document.getElementById('immagine');

    // Funzioni di supporto
    const checkInternetConnection = async () => {
        try {
            await fetch('https://httpbin.org/get', { method: 'HEAD', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    };

    // Funzioni di conversione
    const convertPrice = (price) => {
        const rate = exchangeRates[selectedCurrency] || 1;
        return price * rate;
    };

    const formatCurrency = (amount, currency) => {
        const options = {
            style: 'currency',
            currency: currency,
            useGrouping: true
        };

        if(['JPY', 'KRW', 'IDR'].includes(currency)) {
            options.minimumFractionDigits = 0;
            options.maximumFractionDigits = 0;
        } else {
            options.minimumFractionDigits = 2;
            options.maximumFractionDigits = 2;
        }

        try {
            return new Intl.NumberFormat('it-IT', options).format(amount);
        } catch {
            return `${amount.toFixed(2)} ${currency}`;
        }
    };

    // Aggiorna tassi di cambio
    const updateExchangeRates = async () => {
        const isOnline = await checkInternetConnection();
        let errorMessage = '';
        
        try {
            if(isOnline) {
                const response = await fetch(CURRENCY_API);
                
                if(!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                
                if(!data.rates) throw new Error('Dati API non validi');
                
                exchangeRates = {...FALLBACK_RATES, ...data.rates};
                localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
                localStorage.setItem('lastRateUpdate', Date.now());
                lastUpdate = Date.now();
            } else {
                throw new Error('Offline: usando dati locali');
            }
        } catch (error) {
            errorMessage = error.message;
            const savedRates = localStorage.getItem('exchangeRates');
            
            if(savedRates) {
                try {
                    exchangeRates = JSON.parse(savedRates);
                } catch {
                    exchangeRates = {...FALLBACK_RATES};
                }
            }
            
            console.warn(`${errorMessage}. Tassi usati:`, exchangeRates);
        }
    };

    // Carica e mostra prodotti
    const loadProducts = async (searchTerm = '') => {
        try {
            const response = await fetch(`${API_BASE}/getProduct.php?search=${encodeURIComponent(searchTerm)}`);
            
            if(!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const products = await response.json();
            
            productsList.innerHTML = products.map(product => {
                const convertedPrice = convertPrice(product.prezzo);
                return `
                    <div class="product-card">
                        <img src="/assets/img/${product.percorso_immagine}" alt="${product.nome}" loading="lazy">
                        <div class="product-info">
                            <h3>${product.nome}</h3>
                            <div class="price-container">
                                <div class="converted-price">
                                    ${formatCurrency(convertedPrice, selectedCurrency)}
                                </div>
                                <div class="base-price">
                                    ${formatCurrency(product.prezzo, 'EUR')}
                                </div>
                            </div>
                            <div class="meta-info">
                                <span class="category">${product.categoria}</span>
                                <span class="stock">🛒 ${product.quantita} disponibili</span>
                                <span class="date">📅 ${product.data_aggiunta}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Info tassi di cambio
            const updateTime = new Date(lastUpdate).toLocaleTimeString();
            const currentRate = exchangeRates[selectedCurrency];
            
            let rateInfo = '';
            if(currentRate) {
                rateInfo = `1 EUR = ${currentRate.toLocaleString('it-IT', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 4
                })} ${selectedCurrency}`;
            } else {
                rateInfo = `Tasso ${selectedCurrency} non disponibile, usando valori predefiniti`;
            }

            productsList.insertAdjacentHTML('beforeend',
                `<div class="exchange-info">
                    <div>${rateInfo}</div>
                    <small>Aggiornato alle: ${updateTime}</small>
                </div>`
            );

        } catch (error) {
            console.error('Errore prodotti:', error);
            productsList.innerHTML = `
                <div class="error">
                    ❌ Errore nel caricamento prodotti<br>
                    <small>${error.message}</small>
                </div>
            `;
        }
    };

    // Gestori eventi
    const handleCurrencyChange = async (e) => {
        selectedCurrency = e.target.value;
        localStorage.setItem('selectedCurrency', selectedCurrency);
        
        if(Date.now() - lastUpdate > 3600000) { // 1 ora
            await updateExchangeRates();
        }
        loadProducts();
    };

    const handleSearch = (e) => {
        loadProducts(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        try {
            const response = await fetch(`${API_BASE}/addProduct.php`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if(data.success) {
                form.reset();
                document.getElementById('fileInfo').textContent = 'Formati supportati: JPG, PNG';
                loadProducts();
            } else {
                alert(`Errore: ${data.message || 'Inserimento fallito'}`);
            }
        } catch(error) {
            console.error('Errore invio:', error);
            alert('Errore di connessione durante l\'invio');
        }
    };

    // Inizializzazione
    const init = async () => {
        // Carica preferenze utente
        selectedCurrency = localStorage.getItem('selectedCurrency') || 'EUR';
        currencySelect.value = selectedCurrency;
        
        // Carica tassi
        try {
            const savedRates = localStorage.getItem('exchangeRates');
            if(savedRates) exchangeRates = JSON.parse(savedRates);
        } catch {
            exchangeRates = {...FALLBACK_RATES};
        }
        
        await updateExchangeRates();
        loadProducts();
    };

    // Assegna event listeners
    currencySelect.addEventListener('change', handleCurrencyChange);
    searchInput.addEventListener('input', handleSearch);
    form.addEventListener('submit', handleFormSubmit);
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        document.getElementById('fileInfo').textContent = file ? 
            `${file.name} (${(file.size/1024).toFixed(2)} KB)` : 
            'Nessun file selezionato';
    });

    // Avvia applicazione
    init();
});