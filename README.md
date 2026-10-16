# Italia Facile

Assistente al trasferimento: React, TypeScript e Vite; backend Supabase
(PostgreSQL, autenticazione, Storage e Realtime). Nessun servizio Lovable
è necessario per eseguire l'app.

## Avvio locale

Richiede Node.js 22 o successivo e Docker attivo. Su questo Mac Docker è
fornito da Colima: `colima start --cpu 4 --memory 6`.

```sh
npm ci
npm run local:setup
npm run dev
```

Il primo setup scarica le immagini Docker e applica le migrazioni SQL.
Non importa dati, utenti o file dal vecchio servizio.

- App: http://127.0.0.1:8080
- Email di sviluppo: http://127.0.0.1:54324
- API: http://127.0.0.1:54321
- PostgreSQL: porta 54322 (credenziali in `npm run local:status`)

`local:setup` genera `.env.local` con URL e chiave pubblica del backend locale.
Non inserire chiavi amministrative nelle variabili `VITE_*`.
Le registrazioni email locali non richiedono conferma. Il recupero password
invia le email alla casella di sviluppo locale.

`npm run local:stop` ferma i container conservando i dati.
`npm run db:reset` **cancella i dati locali** e riapplica migrazioni e seed.
Non usare lo stack CLI di sviluppo come server pubblico di produzione.

## Primo amministratore

Registrati nell'app locale, poi assegna il ruolo amministratore al tuo
indirizzo con:

```sh
npm run local:admin -- tuo-indirizzo@example.test
```

Il comando opera solo sul container PostgreSQL locale `supabase_db_italiafacile`.
Per una console SQL locale puoi usare:

```sh
docker exec -it supabase_db_italiafacile psql -U postgres -d postgres
```

Studio e il runtime Edge Functions sono disabilitati per ridurre il download
iniziale; l'app non richiede questi servizi. Per usare Studio, imposta
`[studio].enabled = true` in `supabase/config.toml`, poi ferma e riavvia lo stack.
Il pannello sarà disponibile su http://127.0.0.1:54323 dopo il download dell'immagine.

Il seed include contenuti dimostrativi per provare il percorso, da sostituire
prima della pubblicazione. Nessun account amministratore viene creato automaticamente.

## Contenuti recuperati dal progetto precedente

Il database locale contiene i corridoi, i passi, le guide e i contributi della
community recuperabili tramite le API pubbliche del backend precedente.
L'illustrazione collegata al codice fiscale è servita dal frontend in
`public/images/journey/codice-fiscale.png`, senza dipendenze dal vecchio storage.

La copia dei contenuti e dei quattro file immagine si trova in
`backups/legacy-content/`, esclusa da Git perché può contenere testo degli utenti.
Conserva questa cartella separatamente per trasferire i contenuti su un altro computer.
`manifest.json` contiene conteggi e hash dei file; `restore.sql` permette di
reimportare il contenuto dopo un reset locale:

```sh
npm run content:restore
```

Il ripristino aggiorna le righe presenti nello snapshot, senza cancellare i nuovi
contenuti locali. Il ripristino risolve i corridoi per slug e i passi per corridoio e ordine,
adattando gli identificativi al database di destinazione per preservare i collegamenti. Non usare direttamente questo SQL
su un cloud già popolato senza verificare eventuali conflitti degli identificativi.

Gli account originali, le credenziali, le sessioni, i profili, i ruoli e i progressi
personali non sono stati copiati. I contributi storici sono associati ad autori
anonimi tecnici senza email, password o identità di login, bloccati all'accesso.
Eventuali bozze e dati privati nascosti dalle policy del vecchio database non sono
inclusi nello snapshot pubblico.

## Google login

Il login usa direttamente Supabase Auth. In locale è disabilitato per default:
usa email e password. Per abilitarlo configura un client OAuth Google e il
provider `[auth.external.google]` in `supabase/config.toml`, leggendo il segreto
da una variabile d'ambiente. Il callback locale è
`http://127.0.0.1:54321/auth/v1/callback`.
Dopo aver configurato il provider, imposta `VITE_GOOGLE_AUTH_ENABLED=true`
nel frontend e riavvia Vite (o ricompila in cloud) per mostrare il pulsante.
In cloud configura il provider e i redirect nel progetto Supabase di destinazione.

## Passaggio al cloud

Lo schema e le policy sono in `supabase/migrations/`.
Crea un progetto Supabase di tua proprietà, quindi:

```sh
npx supabase login
npx supabase link --project-ref IL_TUO_PROJECT_REF
npx supabase db push
```

Questi comandi modificano il progetto remoto selezionato: controlla il riferimento.
Il seed dimostrativo locale non viene pubblicato da `db push`.
Configura autenticazione, URL del sito, redirect, SMTP e provider OAuth sul
backend remoto. Imposta `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`
nell'ambiente di build del frontend, poi esegui `npm run build` e pubblica `dist/`
su un hosting statico con fallback delle route a `index.html`.
Le variabili Vite vengono incorporate durante la build.

È possibile anche ospitare Supabase autonomamente con il suo stack Docker di
produzione; database, Auth, Storage e Realtime devono essere migrati insieme.
I soli file SQL non sostituiscono questi servizi.

## Verifiche

```sh
npm run build
npm test
npm run test:local # richiede backend locale attivo
npm run lint
```
