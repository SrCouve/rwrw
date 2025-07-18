import { TOKEN_THRESHOLDS, canChatWithTokens, getAccessLevel } from '../features/constants/tokenThresholds';

// Utility to test different balances
export const simulateBalance = (amount: number) => {
  // Simulate different balance scenarios
  const scenarios = {
    0: "No tokens",
    1: "1 SOL - Few tokens",
    5: "5 SOL - Still insufficient",
    10: "10 SOL - Minimum required",
    50: "50 SOL - Good balance",
    100: "100 SOL - Very good balance"
  };

  console.log(`🔄 Simulating balance: ${amount} SOL`);
  console.log(`📊 Scenario: ${scenarios[amount as keyof typeof scenarios] || `${amount} SOL`}`);
  
  return amount;
};

// Test different balance scenarios
export const testBalanceScenarios = () => {
  const testCases = [0, 1, 5, 10, 25, 50, 100];
  
  console.log('🧪 Testing balance scenarios:');
  testCases.forEach(balance => {
    const accessLevel = getAccessLevel(balance);
    const canChat = canChatWithTokens(balance);
    
    console.log(`\n📊 Balance: ${balance} SOL`);
    console.log(`🎯 Access Level: ${accessLevel}`);
    console.log(`✅ Can Chat: ${canChat}`);
    console.log(`🔢 Threshold: ${TOKEN_THRESHOLDS.FULL_ACCESS} SOL required`);
  });
};

// Debug function to check current balance logic
export const debugBalance = (balance: number) => {
  console.log(`🔍 Debug Balance: ${balance} SOL`);
  console.log(`Can chat: ${canChatWithTokens(balance)}`);
  console.log(`Has tokens: ${balance > 0}`);
  console.log(`Access level: ${getAccessLevel(balance)}`);
  console.log(`Required for full access: ${TOKEN_THRESHOLDS.FULL_ACCESS} SOL`);
}; 