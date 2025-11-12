// Simple integration test script
async function testIntegration() {
  console.log('Testing Stock Tracker Application Integration...');
  
  try {
    // Test backend connectivity
    const response = await fetch('http://localhost:3000/funds');
    if (!response.ok) {
      throw new Error(`Backend not responding: ${response.status}`);
    }
    
    const funds = await response.json();
    console.log(`✓ Backend is running. Found ${funds.length} funds.`);
    
    // Test database connectivity
    const dbResponse = await fetch('http://localhost:3000/stocks');
    if (!dbResponse.ok) {
      throw new Error(`Database not responding: ${dbResponse.status}`);
    }
    
    const stocks = await dbResponse.json();
    console.log(`✓ Database is connected. Found ${stocks.length} stocks.`);
    
    console.log('✓ Integration test passed!');
    console.log('\nYou can now start the frontend with: npm run dev');
    
  } catch (error) {
    console.error('✗ Integration test failed:', error.message);
    console.log('\nPlease ensure:');
    console.log('1. The database is running (docker-compose up -d)');
    console.log('2. The backend server is running (npm run start)');
  }
}

testIntegration();