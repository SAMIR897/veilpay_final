const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("Current __dirname:", __dirname);

const FRONTEND_IDL_DIR = path.join(__dirname, '../frontend/src/idl');
const TARGET_IDL_DIR = path.join(__dirname, '../target/idl');
const PROGRAM_KEYPAIR_PATH = path.join(__dirname, '../target/deploy/veilpay-keypair.json');
const ANCHOR_TOML_PATH = path.join(__dirname, '../Anchor.toml');
const FRONTEND_CONFIG_PATH = path.join(__dirname, '../frontend/src/idl/deployment.json');

// Ensure frontend IDL directory exists
if (!fs.existsSync(FRONTEND_IDL_DIR)) {
    fs.mkdirSync(FRONTEND_IDL_DIR, { recursive: true });
}

console.log("🚀 Starting deployment process...");

// 1. Build the program to generate keypair if it doesn't exist
try {
    console.log("🛠️  Building Anchor program...");
    execSync('anchor build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} catch (error) {
    console.error("❌ Build failed.");
    process.exit(1);
}

// 2. Get Program ID
let programId;
try {
    // Check if keypair exists (it should after build)
    if (fs.existsSync(PROGRAM_KEYPAIR_PATH)) {
        console.log("🔑 Reading Program ID from keypair...");
        const keypair = JSON.parse(fs.readFileSync(PROGRAM_KEYPAIR_PATH, 'utf-8'));
        // Decode bytes to verify? No, easier to use `solana address`
        // Actually, we can just run a command to get the address from the keyfile
        programId = execSync(`solana-keygen pubkey ${PROGRAM_KEYPAIR_PATH}`).toString().trim();
    } else {
        console.error("❌ Keypair not found after build. Something went wrong.");
        process.exit(1);
    }
} catch (error) {
    console.error("❌ Failed to get Program ID:", error.message);
    process.exit(1);
}

console.log(`✅  Program ID detected: ${programId}`);

// 3. Update Anchor.toml with new Program ID
// This is critical because `anchor deploy` uses the ID in Anchor.toml
try {
    let anchorToml = fs.readFileSync(ANCHOR_TOML_PATH, 'utf-8');
    // Regex to find the current program ID assignment
    const regex = /veilpay\s*=\s*"[A-Za-z0-9]+"/g;

    if (anchorToml.match(regex)) {
        const newContent = anchorToml.replace(regex, `veilpay = "${programId}"`);
        fs.writeFileSync(ANCHOR_TOML_PATH, newContent);
        console.log("📄 Updated Anchor.toml with new Program ID");
    } else {
        console.warn("⚠️ Could not find program ID in Anchor.toml to update. Please check manually.");
    }
} catch (error) {
    console.error("❌ Failed to update Anchor.toml:", error.message);
}

// 4. Re-build (optional but strict) and Deploy
try {
    // Re-syncing the ID ensures the binary matches the ID in Anchor.toml if it changed
    console.log("🔄 Syncing keys (anchor build)...");
    execSync('anchor build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

    console.log("🚀 Deploying to Devnet...");
    // Using provider.cluster from Anchor.toml (devnet)
    execSync('anchor deploy', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} catch (error) {
    console.error("❌ Deploy failed.");
    process.exit(1);
}

// 5. Update Frontend Configuration
try {
    // Copy IDL
    const idlSrc = path.join(TARGET_IDL_DIR, 'veilpay.json');
    const idlDest = path.join(FRONTEND_IDL_DIR, 'veilpay.json');

    if (fs.existsSync(idlSrc)) {
        fs.copyFileSync(idlSrc, idlDest);
        console.log("📂 Copied IDL to frontend.");
    } else {
        console.warn("⚠️  IDL file not found in target. Skipping copy.");
    }

    // Write Deployment Config
    const configContent = JSON.stringify({ programId: programId }, null, 2);
    fs.writeFileSync(FRONTEND_CONFIG_PATH, configContent);
    console.log(`💾 Saved frontend config to ${FRONTEND_CONFIG_PATH}`);

} catch (error) {
    console.error("❌ Failed to update frontend config:", error.message);
    process.exit(1);
}

console.log("\n✨ Deployment Complete! ✨");
console.log("The frontend is now linked to the deployed program.");
console.log(`Program ID: ${programId}`);
