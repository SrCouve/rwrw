// Token threshold constants for consistency across the application
export const TOKEN_THRESHOLDS = {
  // Minimum tokens required for full chat access
  FULL_ACCESS: 10, // CURRENT: 10 SOL for testing | PRODUCTION: Change to 10000 for $IVA tokens
  
  // No tokens threshold (exactly 0)
  NO_ACCESS: 0,
  
  // Any positive amount but less than full access
  LIMITED_ACCESS: 1,
} as const;

// 🚀 FOR PRODUCTION WITH $IVA CONTRACT:
// Just change line 4 to: FULL_ACCESS: 10000,
// This will automatically update the entire system!

// Helper functions for token validation
export const canChatWithTokens = (balance: number): boolean => {
  return balance >= TOKEN_THRESHOLDS.FULL_ACCESS;
};

export const hasLimitedAccess = (balance: number): boolean => {
  return balance > TOKEN_THRESHOLDS.NO_ACCESS && balance < TOKEN_THRESHOLDS.FULL_ACCESS;
};

export const hasNoAccess = (balance: number): boolean => {
  return balance === TOKEN_THRESHOLDS.NO_ACCESS;
};

export const getAccessLevel = (balance: number): 'none' | 'limited' | 'full' => {
  if (hasNoAccess(balance)) return 'none';
  if (hasLimitedAccess(balance)) return 'limited';
  return 'full';
};

// For logging/debugging purposes
export const debugTokenAccess = (balance: number): void => {
  console.log(`🔍 Token Balance: ${balance}`);
  console.log(`🎯 Access Level: ${getAccessLevel(balance)}`);
  console.log(`✅ Can Chat: ${canChatWithTokens(balance)}`);
}; 