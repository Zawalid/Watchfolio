#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
};

// Get version argument
const arg = process.argv[2];

if (!arg) {
  log.error('Missing version argument');
  console.log('Usage: pnpm release <patch|minor|major|X.Y.Z>');
  console.log('Examples:');
  console.log('  pnpm release patch    # 0.1.0 → 0.1.1');
  console.log('  pnpm release minor    # 0.1.0 → 0.2.0');
  console.log('  pnpm release major    # 0.1.0 → 1.0.0');
  console.log('  pnpm release 0.2.5    # Set specific version');
  process.exit(1);
}

// Helper to run commands
const run = (command, description) => {
  try {
    log.info(description);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    log.error(`Failed: ${description}`);
    process.exit(1);
  }
};

// Read current versions
const rootDir = path.join(__dirname, '..');
const packagePath = path.join(rootDir, 'package.json');
const tauriConfigPath = path.join(rootDir, 'src-tauri', 'tauri.conf.json');

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf8'));

const currentVersion = packageJson.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

let newVersion;

// Determine new version
if (arg === 'patch') {
  newVersion = `${major}.${minor}.${patch + 1}`;
} else if (arg === 'minor') {
  newVersion = `${major}.${minor + 1}.0`;
} else if (arg === 'major') {
  newVersion = `${major + 1}.0.0`;
} else if (/^\d+\.\d+\.\d+$/.test(arg)) {
  newVersion = arg;
} else {
  log.error('Invalid version format');
  console.log('Use: patch, minor, major, or X.Y.Z format (e.g., 0.2.5)');
  process.exit(1);
}

console.log('');
log.info(`Current version: ${currentVersion}`);
log.info(`New version: ${newVersion}`);
console.log('');

// Check for uncommitted changes
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    log.warning('You have uncommitted changes:');
    console.log(status);
    log.error('Please commit or stash your changes before releasing');
    process.exit(1);
  }
} catch (error) {
  log.error('Failed to check git status');
  process.exit(1);
}

// Prompt for confirmation
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`${colors.yellow}⚠ Proceed with release ${currentVersion} → ${newVersion}? (y/n): ${colors.reset}`, (answer) => {
  rl.close();

  if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    log.warning('Release cancelled');
    process.exit(0);
  }

  console.log('');
  performRelease();
});

function performRelease() {
  // Update package.json
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  log.success('Updated package.json');

  // Update tauri.conf.json
  tauriConfig.version = newVersion;
  fs.writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2) + '\n');
  log.success('Updated src-tauri/tauri.conf.json');

  console.log('');

  // Git operations
  run('git add package.json src-tauri/tauri.conf.json', 'Staging version changes');
  run(`git commit -m "chore: bump version to ${newVersion}"`, 'Creating commit');
  run(`git tag v${newVersion}`, `Creating tag v${newVersion}`);

  console.log('');
  log.success(`Release v${newVersion} prepared successfully!`);
  console.log('');
  log.warning('Ready to push! Run the following commands:');
  console.log('');
  console.log(`  ${colors.blue}git push${colors.reset}`);
  console.log(`  ${colors.blue}git push origin v${newVersion}${colors.reset}`);
  console.log('');
  log.info('Or push both at once:');
  console.log(`  ${colors.blue}git push && git push origin v${newVersion}${colors.reset}`);
  console.log('');
}
