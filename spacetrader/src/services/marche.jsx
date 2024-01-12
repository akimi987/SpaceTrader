export function showMarketData() {
    const marketplaceSection = document.querySelector(".marketplace");
    if (marketplaceSection) {
      marketplaceSection.classList.remove("hidden");
    }
  }