import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
afterEach(cleanup);
describe("Socle conservé de la séance 2", () => {
  it("ouvre une modale nommée et focalise son titre", () => {
    render(<App />); fireEvent.click(screen.getByRole("button", {name:/Réserver Après l.aube/i}));
    expect(screen.getByRole("heading", {name:/Réserver Après l.aube/i})).toHaveFocus();
  });
  it("ferme et revient au film choisi", () => {
    render(<App />); const opener=screen.getByRole("button", { name:/Réserver Orbite 9/i}); fireEvent.click(opener);
    fireEvent.click(screen.getByRole("button", { name:/Revenir aux films/i})); expect(opener).toHaveFocus();
  });

  it("Après correction : envoyer vide, vérifier aria-invalid et la description du champ email.", async () => {
    const user = userEvent.setup();
    render(<App />);
    
    await user.click(screen.getByRole("button", { name: /Réserver Après l.aube/i }));
    await user.click(screen.getByRole("button", { name: /Confirmer la réservation/i }));

    const email = screen.getByRole("textbox", { name: /adresse électronique/i });
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email.getAttribute("aria-describedby")).toMatch(/help/);
    expect(email.getAttribute("aria-describedby")).toMatch(/error/);
  });

  it("Après correction : vérifier que le résumé d'erreurs reçoit le focus.", async () => {
    const user = userEvent.setup();
    render(<App />);
    
    await user.click(screen.getByRole("button", { name: /Réserver Après l.aube/i }));
    await user.click(screen.getByRole("button", { name: /Confirmer la réservation/i }));

    const summary = screen.getByRole("heading", { level: 3, name: /erreur/i }).parentElement;
    expect(summary).toHaveFocus();
  });
});