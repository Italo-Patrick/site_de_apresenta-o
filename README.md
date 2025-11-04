                  ┌──────────────────────────┐
                  │        GitHub/Netlify    │
                  │  Production branch: main │
                  └───────────▲──────────────┘
                              │  (deploy auto)
                              │  push em main
     (preview fixo)           │
 https://dev--...netlify.app  │              https://...netlify.app (produção)
            ▲                 │
            │                 │
     ┌──────┴──────┐     ┌────┴────┐
     │   branch    │     │  branch │
     │     dev     │     │   main  │
     └──────┬──────┘     └────┬────┘
            │  edita/testa         │  estável
            │                      │
            │  commits + push      │
            │  (deploy dev auto)   │
            │                      │
            └─────── merge ───────►│
                        (quando ok)
