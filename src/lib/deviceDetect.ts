export type PerformanceTier = 'high' | 'medium' | 'low';

export function getPerformanceTier(): PerformanceTier {
  const nav = navigator as any;
  const deviceMemory = nav.deviceMemory ?? 8;
  const hardwareConcurrency = nav.hardwareConcurrency ?? 4;
  const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
  const saveData = connection?.saveData ?? false;
  const effectiveType = connection?.effectiveType ?? '4g';

  if (saveData || ['slow-2g', '2g'].includes(effectiveType) || (deviceMemory <= 2 && hardwareConcurrency <= 2)) {
    return 'low';
  }
  if (deviceMemory <= 2 || hardwareConcurrency <= 2 || effectiveType === '3g') {
    return 'medium';
  }
  return 'high';
}

export function getParticleCount(base: number, tier: PerformanceTier): number {
  switch (tier) {
    case 'low': return Math.floor(base * 0.2);
    case 'medium': return Math.floor(base * 0.5);
    case 'high': return base;
  }
}

export function shouldEnableParallax(tier: PerformanceTier, prefersReduced: boolean): boolean {
  return tier !== 'low' && !prefersReduced;
}
