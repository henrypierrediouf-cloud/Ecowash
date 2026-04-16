const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./ecowash.db', (err) => {
  if (err) { console.error('Erreur DB:', err.message); }
  else { console.log('✅ Base de données connectée'); }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    telephone TEXT NOT NULL,
    formule TEXT NOT NULL,
    adresse TEXT,
    disponibilites TEXT,
    statut TEXT DEFAULT 'en_attente',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('✅ Tables prêtes');
});

// POST réservation
app.post('/api/reservations', (req, res) => {
  const { nom, telephone, formule, adresse, disponibilites } = req.body;
  if (!nom || !telephone || !formule) {
    return res.status(400).json({ success: false, message: 'Champs obligatoires manquants.' });
  }
  db.run(
    `INSERT INTO reservations (nom, telephone, formule, adresse, disponibilites) VALUES (?,?,?,?,?)`,
    [nom, telephone, formule, adresse||'', disponibilites||''],
    function(err) {
      if (err) return res.status(500).json({ success: false, message: 'Erreur serveur.' });
      console.log(`📥 Nouvelle réservation #${this.lastID} — ${nom} (${telephone}) — ${formule}`);
      res.status(201).json({ success: true, message: 'Réservation enregistrée !', id: this.lastID });
    }
  );
});

// GET toutes les réservations
app.get('/api/reservations', (req, res) => {
  db.all('SELECT * FROM reservations ORDER BY date_creation DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, total: rows.length, reservations: rows });
  });
});

// PATCH statut
app.patch('/api/reservations/:id/statut', (req, res) => {
  const { statut } = req.body;
  db.run('UPDATE reservations SET statut=? WHERE id=?', [statut, req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: `Statut mis à jour : ${statut}` });
  });
});

// DELETE
app.delete('/api/reservations/:id', (req, res) => {
  db.run('DELETE FROM reservations WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Supprimé.' });
  });
});

// STATS
app.get('/api/stats', (req, res) => {
  db.all(`SELECT
    COUNT(*) as total,
    SUM(CASE WHEN statut='en_attente' THEN 1 ELSE 0 END) as en_attente,
    SUM(CASE WHEN statut='confirmee' THEN 1 ELSE 0 END) as confirmees,
    SUM(CASE WHEN statut='terminee' THEN 1 ELSE 0 END) as terminees,
    SUM(CASE WHEN statut='annulee' THEN 1 ELSE 0 END) as annulees
    FROM reservations`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, stats: rows[0] });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Ecowash Dieufé — Serveur sur http://localhost:${PORT}`);
  console.log(`📊 Dashboard admin  → http://localhost:${PORT}/admin.html`);
  console.log(`🌍 Site web         → http://localhost:${PORT}`);
  console.log(`📞 Contact : Cheikh Faye — 77 654 18 32`);
});
