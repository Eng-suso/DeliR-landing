# Palette del sito

Di seguito la palette consolidata e riferimenti ai file dove sono usati i colori.

## Variabili principali (da src/index.css)
- **--color-brand-navy**: `#0B1021` — colore brand scuro. (vedi [src/index.css](src/index.css#L1-L20))
- **--color-brand-blue**: `#2563EB` — brand blue primario. (vedi [src/index.css](src/index.css#L1-L20))
- **--color-brand-light**: `#F8FAFC` — light background token. (vedi [src/index.css](src/index.css#L1-L20))
- **--color-brand-border**: `#E2E8F0` — bordo/neutral chiaro. (vedi [src/index.css](src/index.css#L1-L20))

## Colori espliciti trovati
- `#FAFAF8` — body / background (usato come `bg-[#FAFAF8]`).
- `rgba(15,23,42,0.04)` — grid pattern overlay (vedi [src/index.css](src/index.css#L31-L32)).
- `#FFFFFF` — bianco puro (gradienti e stroke). (vedi [src/components/DarkAnimatedBackground.tsx](src/components/DarkAnimatedBackground.tsx#L10-L19))
- `#3B82F6` — blu acceso (gradient wash). (vedi [src/components/PremiumBackground.tsx](src/components/PremiumBackground.tsx#L9-L18))
- `#93C5FD` — azzurro chiaro (gradient stop). (vedi [src/components/PremiumBackground.tsx](src/components/PremiumBackground.tsx#L9-L18))
- `#2563EB` — brand blue (ripetuto). (vedi [src/components/PremiumBackground.tsx](src/components/PremiumBackground.tsx#L9-L18))
- `#60A5FA` — blu chiaro (stroke/linee). (vedi [src/components/PremiumBackground.tsx](src/components/PremiumBackground.tsx#L9-L18))
- `#1D4ED8` — blu scuro (accent/linee). (vedi [src/components/PremiumBackground.tsx](src/components/PremiumBackground.tsx#L9-L18))
- `#BFDBFE` — azzurro molto chiaro (gradient stop). (vedi [src/components/PremiumBackground.tsx](src/components/PremiumBackground.tsx#L9-L18))
- `#FFFBF0` — fondo/alert leggero (usato per warning card). (vedi [src/components/Hero.tsx](src/components/Hero.tsx#L287-L303))
- `rgb(0,0,0,0.1)` — shadow blur (box-shadow). (vedi [src/components/Hero.tsx](src/components/Hero.tsx#L56-L66))
- `#E2E8F0` / `#e2e8f0` — pattern dot color (radial-gradient). (vedi [src/index.css](src/index.css#L1-L20))
- `#64748B` — stroke / frecce (SVG arrow color). (vedi [src/components/Hero.tsx](src/components/Hero.tsx#L150-L170))

## Tailwind tokens utilizzati (nomi)
- `blue-500`, `blue-600`, `blue-100` — CTA e sfondi (es. `bg-blue-500`).
- `slate-900` ... `slate-50` — neutri per testo, sfondi e bordi.
- `amber-300`, `amber-500`, `amber-600` — warning/alert.
- `green-600`, `green-50` — badge success.

> Nota: i valori hex esatti dei token Tailwind (es. `blue-500`) dipendono dalla configurazione Tailwind; posso mappare ogni token al corrispondente valore hex se vuoi.

---

Se vuoi, posso:
- Aggiungere swatch visivi inline nel file `palette.md`.
- Esportare un `:root` CSS con tutte le variabili consolidate.
- Risolvere i token Tailwind in hex esatti.

Dimmi quale preferisci.# Palette del sito

## Variabili CSS principali
- `--color-brand-navy`: #0B1021 — colore brand scuro.
- `--color-brand-blue`: #2563EB — brand blue primario.
- `--color-brand-light`: #F8FAFC — token background chiaro.
- `--color-brand-border`: #E2E8F0 — bordo / neutral chiaro.

Riferimento variabili: [src/index.css](src/index.css#L1-L20)

## Altri colori usati (deduplicati)
- #FAFAF8 — body / background (usato come `bg-[#FAFAF8]`).
- rgba(15,23,42,0.04) — pattern grid overlay.
- #FFFFFF — bianco (gradienti, stroke, elementi UI).
- #3B82F6 — blu acceso (gradient wash).
- #93C5FD — azzurro chiaro (gradient stop).
- #60A5FA — blu chiaro (stroke/linee).
- #1D4ED8 — blu scuro (accent/linee).
- #BFDBFE — azzurro molto chiaro (gradient stop).
- #FFFBF0 — fondo/alert leggero (warning card).
- #64748B — stroke / frecce SVG.
- #E2E8F0 — pattern dot (radial-gradient).
- rgb(0,0,0,0.1) — shadow (box-shadow opacity).

Esempi di origine (gradienti / SVG):
- [src/components/PremiumBackground.tsx](src/components/PremiumBackground.tsx#L9-L18)
- [src/components/DarkAnimatedBackground.tsx](src/components/DarkAnimatedBackground.tsx#L10-L19)
- [src/components/Hero.tsx](src/components/Hero.tsx#L1-L20)

## Token Tailwind rilevabili
Nel codice sono usate classi Tailwind che mappano a palette di Tailwind (valori non hardcoded nel repo):
- `blue-500`, `blue-600`, `blue-100`
- `slate-900` → `slate-50` (serie completa usata per testo/bordi/background)
- `amber-300`, `amber-500`, `amber-600`
- `green-600`, `green-50`

Se vuoi, posso risolvere questi token nei corrispondenti hex leggendo la config di Tailwind o usando la palette predefinita.

## Variabili CSS suggerite (blocchetto `:root` pronto all'uso)
```css
:root {
  --brand-navy: #0B1021;
  --brand-blue: #2563EB;
  --brand-light: #F8FAFC;
  --brand-border: #E2E8F0;
  --bg-default: #FAFAF8;
  --accent-1: #3B82F6;
  --accent-2: #1D4ED8;
  --accent-3: #60A5FA;
  --warning-bg: #FFFBF0;
  --muted: #64748B;
}
```

---

Se vuoi, genero anche una versione visuale con swatch (immagine o HTML) o sostituisco le classi inline con variabili CSS.
