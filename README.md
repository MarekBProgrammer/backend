# Backend IdoSell - Synchronizacja Zamówień

Backend do pobierania zamówień z API IdoSell, przechowywania w MongoDB i udostępniania przez REST API.

## 🚀 Jak uruchomić

### 1. Zainstaluj zależności

```bash
npm install
```

### 2. Utwórz plik `.env`

```bash
cp .env.example .env
```

Uzupełnij `API_KEY` i `MONGODB_URI`

### 3. Uruchom serwer

```bash
npm start
```

Serwer powinien się uruchomić na `http://localhost:3000`

## 📡 API Endpoints

### Pobierz wszystkie zamówienia (CSV)

```bash
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/orders?minWorth=100&maxWorth=500
```

### Pobierz konkretne zamówienie (CSV)

```bash
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/order/12345
```

### Pobierz wszystkie zamówienia (JSON)

```bash
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/
```

## ⚙️ Struktura projektu

```
server/
├── authorization.js   - Middleware do autoryzacji API
├── connect.js         - Połączenie z MongoDB + fetch API
├── database.js        - Logika synchronizacji zamówień
├── filter.js          - Transformacja danych
├── server.js          - Express endpoints
└── package.json       - Zależności
```

## 🛠️ Stack techniczny

- **Node.js** - Runtime
- **Express.js** - Framework
- **MongoDB** - Baza danych
- **API Key** - Autoryzacja

## ⭐ Funkcjonalności

- ✅ Pobiera zamówienia z API IdoSell
- ✅ Synchronizuje co 2 minuty
- ✅ Przechowuje w MongoDB
- ✅ Zwraca CSV lub JSON
- ✅ Filtruje po cenie
- ✅ Wymaga API Key

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Sprawdź `MONGODB_URI` w `.env`
- Upewnij się że MongoDB jest dostępne
- Sprawdź firewall/VPN

### API zwraca 401 Unauthorized
- Dodaj header: `x-api-key: YOUR_API_KEY`
- Sprawdź czy klucz w `.env` jest poprawny

### "Cannot find module"
- Uruchom: `npm install`
