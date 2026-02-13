import { useState, useEffect } from 'react';

export type PerformanceTier = 'high' | 'medium' | 'low';

interface DeviceCapability {
  tier: PerformanceTier;
  deviceMemory: number;
  hardwareConcurrency: number;
  saveData: boolean;
  effectiveType: string;
  isLowPower: boolean;
}

function detectTier(): DeviceCapability {
  const nav = navigator as any;

  const deviceMemory = nav.deviceMemory ?? 8;
  const hardwareConcurrency = nav.hardwareConcurrency ?? 4;
  const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
  const saveData = connection?.saveData ?? false;
  const effectiveType = connection?.effectiveType ?? '4g';

  const isSlowConnection = ['slow-2g', '2g'].includes(effectiveType);
  const isLowMemory = deviceMemory <= 2;
  const isLowCores = hardwareConcurrency <= 2;

  let tier: PerformanceTier = 'high';

  if (saveData || isSlowConnection || (isLowMemory && isLowCores)) {
    tier = 'low';
  } else if (isLowMemory || isLowCores || effectiveType === '3g') {
    tier = 'medium';
  }

  return {
    tier,
    deviceMemory,
    hardwareConcurrency,
    saveData,
    effectiveType,
    isLowPower: tier === 'low',
  };
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>(detectTier);

  useEffect(() => {
    const nav = navigator as any;
    const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;

    if (connection) {
      const handleChange = () => setCapability(detectTier());
      connection.addEventListener('change', handleChange);
      return () => connection.removeEventListener('change', handleChange);
    }
  }, []);

  return capability;
}

export function getPerformanceTier(): PerformanceTier {
  return detectTier().tier;
}
