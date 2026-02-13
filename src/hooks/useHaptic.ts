const supportsVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator;

export function useHaptic() {
  const hapticTap = () => {
    if (supportsVibration) navigator.vibrate(10);
  };

  const hapticSuccess = () => {
    if (supportsVibration) navigator.vibrate(50);
  };

  const hapticError = () => {
    if (supportsVibration) navigator.vibrate([100, 50, 100]);
  };

  const hapticPattern = (pattern: number[]) => {
    if (supportsVibration) navigator.vibrate(pattern);
  };

  return { hapticTap, hapticSuccess, hapticError, hapticPattern, supportsVibration };
}
