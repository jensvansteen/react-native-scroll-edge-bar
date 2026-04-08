const fs = require('fs');
const path = require('path');

const file = path.join(
  __dirname,
  '..',
  'nitrogen',
  'generated',
  'ios',
  'c++',
  'views',
  'HybridRNScrollEdgeBarComponent.mm'
);

if (!fs.existsSync(file)) {
  console.error(`Missing generated file: ${file}`);
  process.exit(1);
}

const source = fs.readFileSync(file, 'utf8');
const checks = [
  '+ (BOOL)shouldBeRecycled {',
  'return NO;',
  '- (void)invalidate',
  'prepareForFabricUnmount',
  '- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView',
  '[super unmountChildComponentView:childComponentView index:index];',
];

const missing = checks.filter((needle) => !source.includes(needle));

if (missing.length > 0) {
  console.error('Nitrogen patch verification failed. Missing markers:');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log('Nitrogen patch verification passed.');
