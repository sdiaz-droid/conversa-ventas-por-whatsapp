# Conversa · Ventas por WhatsApp — página web

Copia estática de la página de producto de Pxsol para editarla en equipo y verla en Vercel.

- `index.html`: la página entera (texto, imágenes, estilos propios de la página).
- `producto/assets/`: fotos, logos e íconos.
- `_next/static/` y `dc/site.css`: estilos y fuentes del sitio de Pxsol. No hace falta tocarlos.

**Cómo se trabaja:** editás `index.html` en una rama, abrís un pull request y Vercel genera una
preview para verlo. Al mergear a `main` se publica en https://conversa-ventas-por-whatsapp.vercel.app

Lo que se apruebe acá después se porta al sitio real (Nexus, PR #9581).
