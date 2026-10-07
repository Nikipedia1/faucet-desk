# Faucet Desk

Dashboard personale per tracciare i guadagni da faucet, PTC e offerwall crypto.  
Dati salvati in locale (browser) + sincronizzazione cloud opzionale via Cloudflare KV.

**Demo live:** dopo il deploy sarà disponibile su `https://tuo-progetto.pages.dev`

## Caratteristiche

- Obiettivo giornaliero in USDT con barra di progresso
- Lista siti con timer di cooldown automatico
- Registrazione claim (importo + minuti impiegati)
- Classifica per USDT/ora (basata sui tuoi dati reali)
- Registro ultimi 7 giorni + storico claim
- Catalogo faucet precaricato (FireFaucet, FaucetCrypto, FreeBitcoin, ecc.)
- Sincronizzazione multi-dispositivo con codice segreto
- Backup/Import JSON
- Tema chiaro/scuro automatico
- Completamente offline-first (funziona anche senza cloud)

## Deploy su Cloudflare Pages (consigliato)

### 1. Crea il progetto su Cloudflare

1. Vai su [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Seleziona il repository `faucet-desk`
3. Impostazioni di build:
   - **Framework preset:** None
   - **Build command:** *(lascia vuoto)*
   - **Build output directory:** `/` (root)
4. Clicca **Save and Deploy**

### 2. Configura il KV Namespace

1. Nella dashboard Cloudflare → **Workers & Pages** → **KV** → **Create a namespace**
   - Nome: `FAUCET_KV` (o qualsiasi nome)
2. Torna al progetto Pages → **Settings** → **Functions** → **KV namespace bindings**
3. Aggiungi binding:
   - **Variable name:** `FAUCET_KV`
   - **KV namespace:** seleziona quello creato
4. **Redeploy** il progetto (Deployments → ⋯ → Retry deployment)

### 3. Usa la sincronizzazione

1. Apri il sito deployato
2. Vai su **Impostazioni** → **Sincronizzazione cloud**
3. Inserisci un codice lungo (≥ 12 caratteri, es. una passphrase)
4. Clicca **Attiva sincronizzazione**

Lo stesso codice su un altro dispositivo sincronizza i dati.

> ⚠️ Chi conosce il codice può leggere/modificare i tuoi dati. Usane uno forte e non condividerlo.

## Struttura del progetto

```
faucet-desk/
├── index.html              # Frontend completo (SPA vanilla JS)
├── functions/
│   └── api/
│       └── state.js        # Cloudflare Pages Function (API /api/state)
└── README.md
```

## Sviluppo locale (opzionale)

```bash
# Installa Wrangler
npm install -g wrangler

# Crea un KV locale
wrangler kv:namespace create FAUCET_KV

# Avvia Pages in locale (con Functions)
npx wrangler pages dev . --kv=FAUCET_KV
```

Poi apri http://localhost:8788

## Sicurezza

- Il codice di sincronizzazione viene hasato con SHA-256 lato server (`faucetdesk:` + codice)
- Nessun account, nessuna email, nessun tracking
- I dati restano privati finché il codice non viene condiviso
- Limite dimensione payload: 200 KB

## Licenza

MIT — fai quello che vuoi.
