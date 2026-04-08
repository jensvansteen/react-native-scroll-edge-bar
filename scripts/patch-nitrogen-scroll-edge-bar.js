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

let source = fs.readFileSync(file, 'utf8');

const target = `- (void)invalidate\n{\n  [[self scrollEdgeBarContainerView] prepareForFabricUnmount];\n  [super invalidate];\n}`;
const patch = `${target}\n\n- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView\n                            index:(NSInteger)index\n{\n  [[self scrollEdgeBarContainerView] prepareForFabricUnmount];\n  [super unmountChildComponentView:childComponentView index:index];\n}`;

if (
  source.includes(
    '- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView'
  )
) {
  console.log('Nitrogen patch already applied.');
  process.exit(0);
}

if (!source.includes(target)) {
  console.error('Could not find invalidate block to patch.');
  process.exit(1);
}

source = source.replace(target, patch);
fs.writeFileSync(file, source);
console.log('Applied ScrollEdgeBar Nitrogen patch.');
