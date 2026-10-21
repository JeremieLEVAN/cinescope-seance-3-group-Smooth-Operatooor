import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Film } from "../films";
import { readReservation, type Errors, type Reservation } from "../reservation";

type BookingDialogProps = {
  film: Film;
  onConfirm: (film: Film, reservation: Reservation) => void;
  onClose: () => void;
};

export default function BookingDialog({ film, onConfirm, onClose }: BookingDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const confirmedRef = useRef(false);
  const prefix = useId();
  const id = (part: string) => `${prefix}-${part}`;
  const [errors, setErrors] = useState<Errors>({});
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    confirmedRef.current = false;
    if (!dialog.open) dialog.showModal();
    titleRef.current?.focus();
  }, [film.id]);

  useEffect(() => {
    if (attempt > 0 && Object.keys(errors).length > 0) {
      summaryRef.current?.focus();
    }
  }, [attempt, errors]);

  const closeBooking = () => dialogRef.current?.close();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!film.available || confirmedRef.current) return;
    const result = readReservation(event.currentTarget);
    setErrors(result.errors);
    setAttempt(a => a + 1);
    if (Object.keys(result.errors).length > 0) return;
    confirmedRef.current = true;
    onConfirm(film, result.values);
    closeBooking();
  };

  return (
    <dialog ref={dialogRef} aria-labelledby={id("title")} onClose={onClose}>
      <div className="dialog-heading">
        <h2 id={id("title")} ref={titleRef} tabIndex={-1}>Réserver {film.title}</h2>
        <button type="button" className="close" aria-label="Fermer la réservation" onClick={closeBooking}>×</button>
      </div>
      <p>{film.genre} · Séance de {film.time}</p>
      <p className={"availability " + (film.available ? "available" : "unavailable")}>
        {film.available ? "Places disponibles" : "Séance complète"}
      </p>
      {film.available ? (
        <>
          <p>Une place par réservation. Tous les champs du formulaire sont obligatoires.</p>
          <p className="demo-note">Démonstration : aucun billet réel ni envoi de courriel.</p>

          {Object.keys(errors).length > 0 && (
            <div className="error-summary" ref={summaryRef} tabIndex={-1}>
              <h3>{Object.keys(errors).length} erreur(s) empêche(nt) la réservation</h3>
              <ul>
                {errors.tariff && <li><a href={`#${id("tariff-standard")}`}>{errors.tariff}</a></li>}
                {errors.name && <li><a href={`#${id("name")}`}>{errors.name}</a></li>}
                {errors.email && <li><a href={`#${id("email")}`}>{errors.email}</a></li>}
              </ul>
            </div>
          )}

          <form noValidate onSubmit={submit}>
            <fieldset className="form-group">
              <legend className="field-label">Type de place</legend>
              <p className="field-help" id={id("tariff-help")}>Choisissez un type de place pour ce billet.</p>
              {errors.tariff && <p className="field-error" id={id("tariff-error")}>{errors.tariff}</p>}
              <div className="radio-options">
                <label><input id={id("tariff-standard")} name="tariff" type="radio" value="standard" aria-invalid={!!errors.tariff} aria-describedby={errors.tariff ? `${id("tariff-help")} ${id("tariff-error")}` : id("tariff-help")} /> Standard</label>
                <label><input id={id("tariff-student")} name="tariff" type="radio" value="student" aria-invalid={!!errors.tariff} aria-describedby={errors.tariff ? `${id("tariff-help")} ${id("tariff-error")}` : id("tariff-help")} /> Étudiant</label>
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor={id("name")} className="field-label">Nom de réservation</label>
              <p className="field-help" id={id("name-help")}>Indiquez le nom de la personne qui réserve.</p>
              {errors.name && <p className="field-error" id={id("name-error")}>{errors.name}</p>}
              <input id={id("name")} name="name" placeholder="Votre nom" className={errors.name ? "invalid" : undefined} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id("name-help")} ${id("name-error")}` : id("name-help")}/>
            </div>
            <div className="field">
              <label htmlFor={id("email")} className="field-label">Adresse électronique</label>
              <p className="field-help" id={id("email-help")}>Format attendu : nom@exemple.fr.</p>
              {errors.email && <p className="field-error" id={id("email-error")}>{errors.email}</p>}
              <input id={id("email")} name="email" type="email" placeholder="Votre adresse" className={errors.email ? "invalid" : undefined} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id("email-help")} ${id("email-error")}` : id("email-help")}/>
            </div>
            <div className="dialog-actions">
              <button className="dialog-action" type="submit">Confirmer la réservation</button>
              <button className="dialog-action dialog-secondary" type="button" onClick={closeBooking}>Revenir aux films</button>
            </div>
          </form>
        </>
      ) : (
        <>
          <p>Cette séance est complète : aucune réservation ne peut être confirmée.</p>
          <button className="dialog-action" type="button" onClick={closeBooking}>Revenir aux films</button>
        </>
      )}
    </dialog>
  );
}
