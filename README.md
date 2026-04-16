# 🌿 Ecowash Dieufé — Serveur Backend

## Structure du projet

```
ecowash/
├── server.js          ← Serveur Node.js (API + base de données)
├── package.json       ← Dépendances
├── ecowash.db         ← Base de données SQLite (créée automatiquement)
└── public/
    ├── index.html     ← Site web principal
    └── admin.html     ← Dashboard administrateur
```

---

## 🚀 Installation & Démarrage

### 1. Installer Node.js
Téléchargez Node.js sur https://nodejs.org (version 18 ou plus)

### 2. Installer les dépendances
```bash
cd ecowash
npm install
```

### 3. Démarrer le serveur
```bash
npm start
```

### 4. Accéder au site
- **Site web** → http://localhost:3000
- **Dashboard admin** → http://localhost:3000/admin.html

---

## 📡 API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/reservations | Créer une réservation |
| GET | /api/reservations | Lister toutes les réservations |
| GET | /api/reservations/:id | Détail d'une réservation |
| PATCH | /api/reservations/:id/statut | Changer le statut |
| DELETE | /api/reservations/:id | Supprimer une réservation |
| GET | /api/stats | Statistiques globales |

---

## 🗄️ Base de données

La base SQLite `ecowash.db` est créée automatiquement au premier démarrage.

**Table `reservations`**
- id, nom, telephone, formule, adresse, disponibilites
- statut (en_attente / confirmee / terminee / annulee)
- date_creation

---

## 🌐 Mise en ligne (optionnel)

Pour héberger en ligne, utilisez :
- **Railway** → https://railway.app (gratuit)
- **Render** → https://render.com (gratuit)
- **VPS** (DigitalOcean, OVH, etc.)
