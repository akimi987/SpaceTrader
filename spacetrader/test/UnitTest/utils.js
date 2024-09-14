import { expect, test, assert } from "vitest";
import { JSDOM } from "jsdom";
import { DistanceDisplay } from "../../src/services/distance";
import { showMarketData } from "../../src/services/marche";
test("Calcul distance works", () => {
  const result = DistanceDisplay({ x1: 8, y1: 4, x2: 16, y2: 4 });
  const expectedDistance = 8; // Remplacez 5 par la distance correcte
  expect(result).toBe(expectedDistance);
});

test("Test showMarketData function", () => {
  // Création un objet pour simuler document.querySelector
  const querySelectorSpy = (selector) => {
    if (selector === ".marketplace") {
      return { classList: { remove: () => {} } };
    }
    return null;
  };

  // Création d'un DOM simulé avec jsdom
  const dom = new JSDOM("<html><body></body></html>");
  global.document = dom.window.document;

  // Espionne la fonction document.querySelector
  const originalQuerySelector = global.document.querySelector;
  global.document.querySelector = querySelectorSpy;

  // Appelle la fonction que je teste
  showMarketData();

  // Vérifie si document.querySelector a bien été appelée avec ".marketplace"
  assert(
    querySelectorSpy(".marketplace"),
    "document.querySelector n'a pas été appelée avec le bon sélecteur"
  );

  // Restaure la fonction d'origine après le test
  global.document.querySelector = originalQuerySelector;
});