export type TPlatformName = 'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'Tap' | 'mCash' | 'Main Wallet' | 'Flexiload';

export type TPlatformBalance = {
  platformName: TPlatformName;
  balance: number;
  lastUpdated: Date;
};
