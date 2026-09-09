const suites = {
  unit: ['Service Layer'],
  integration: ['Order + Payment + Tracking Flows'],
  e2e: ['Customer -> Merchant -> Captain -> Admin Journey'],
  performance: ['Startup time', 'API response time', 'Memory usage'],
  security: ['Authentication', 'Authorization', 'Data encryption', 'Session handling'],
};

const mode = process.argv[2] || '--full';

const run = (name, items) => {
  console.log(`\n[${name.toUpperCase()}]`);
  items.forEach((item, index) => {
    console.log(`${index + 1}. ${item}`);
  });
};

if (mode === '--performance') {
  run('performance', suites.performance);
} else if (mode === '--security') {
  run('security', suites.security);
} else if (mode === '--unit') {
  run('unit', suites.unit);
} else {
  run('unit', suites.unit);
  run('integration', suites.integration);
  run('e2e', suites.e2e);
  run('performance', suites.performance);
  run('security', suites.security);
}

console.log('\nTest suite checklist loaded successfully.');
