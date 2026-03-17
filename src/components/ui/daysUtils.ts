export function daysUntil(dateStr: string): number | null {
    if (!dateStr) return null;
  
    const target = new Date(dateStr);
    if (Number.isNaN(target.getTime())) return null;
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
  
    const diffMs = target.getTime() - today.getTime();
  
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }