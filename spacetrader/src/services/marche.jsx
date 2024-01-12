export function showMarketData() {
    const marketplaceSection = document.querySelector(".custom-marketplace");
    if (marketplaceSection) {
      marketplaceSection.classList.remove("hidden");
    }
  }