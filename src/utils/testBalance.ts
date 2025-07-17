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

// Function to test all scenarios
export const testAllScenarios = () => {
  console.log("🧪 Testing all Iva scenarios:");
  
  const testCases = [0, 1, 5, 10, 50, 100];
  
  testCases.forEach(balance => {
    console.log(`\n--- Balance: ${balance} SOL ---`);
    
    if (balance === 0) {
      console.log("❌ No access - Iva will refuse to talk");
    } else if (balance < 10) {
      console.log("⚠️ Limited access - Iva will mock the balance");
    } else {
      console.log("✅ Full access - Iva will talk normally");
    }
  });
};

// Debug function to check current balance logic
export const debugBalance = (balance: number) => {
  console.log(`🔍 Debug Balance: ${balance} SOL`);
  console.log(`Can chat: ${balance >= 10}`);
  console.log(`Has tokens: ${balance > 0}`);
  console.log(`Status: ${balance === 0 ? "No access" : balance < 10 ? "Limited access" : "Full access"}`);
}; 