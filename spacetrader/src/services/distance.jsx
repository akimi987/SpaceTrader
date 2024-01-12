export function DistanceDisplay({ x1, y1, x2, y2 }) {
    const calculateDistance = (x1, y1, x2, y2) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return Math.round(distance);
    };
  
    const distance = calculateDistance(x1, y1, x2, y2);
    return distance;
  }