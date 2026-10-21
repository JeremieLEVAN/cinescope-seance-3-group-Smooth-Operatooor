- Chaque champ et le groupe de choix doivent être nommés :
Utilisation de `<fieldset>` et `<legend>` pour regrouper et nommer les boutons radio "Type de place". Pour les champs texte, les `<label>` ont été correctement reliés avec `htmlFor`

- L'erreur doit préciser le problème et rester liée au champ :
Ajout de l'attribut `aria-invalid={!!errors.champ}` pour signaler sémantiquement l'erreur. Utilisation de `aria-describedby` pour lier simultanément l'ID du texte d'aide et l'ID du message d'erreur au champ

- Le résumé doit aider à rejoindre la correction sans perdre la saisie :
Création d'un bloc récapitulatif `<div className="error-summary" ref={summaryRef} tabIndex={-1}>` contenant des liens d'ancrage (`<a href="#id">`) pointant directement vers les champs en erreur

- Les tests doivent vérifier le parcours avec des requêtes proches de l'usage :
Remplacement des chaînes de caractères strictes par des regex dans `__tests__/Socle.test.tsx` pour s'affranchir des différences de typo et rendre les requêtes `getByRole` plus robuste