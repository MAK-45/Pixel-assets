# grill-me + grilling (copie intégrée)

Ces deux skills sont copiés de **https://github.com/mattpocock/skills** (Matt Pocock, licence MIT, voir `LICENSE`) :

- `.claude/skills/grill-me/` ← `skills/productivity/grill-me/` : point d'entrée, invoqué **uniquement** par
  l'utilisateur avec `/grill-me` (`disable-model-invocation: true`) ; il délègue au skill `grilling`.
- `.claude/skills/grilling/` ← `skills/productivity/grilling/` : la dépendance qui mène l'interview
  (questions par « rounds », arbre de décisions, réponse recommandée pour chaque question). Claude peut
  aussi le charger seul quand l'utilisateur demande de se faire « cuisiner » / « grill » sur une idée.

- Commit d'origine : `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d` (2026-10-31)
- Fichiers exclus : `agents/openai.yaml` (configuration Codex, inutile pour Claude Code)
- Aucune modification des `SKILL.md`.

Mettre à jour : recopier les deux `SKILL.md` depuis le dépôt d'origine et noter le nouveau commit ici.
