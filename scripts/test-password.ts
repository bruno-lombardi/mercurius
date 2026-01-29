import bcrypt from "bcryptjs";

// Script para testar se a senha e hash estão corretos
const testPasswords = ["admin123", "admin", "Admin123"];
const hashFromEnv = process.env.ADMIN_PASSWORD_HASH;
const defaultHash = "$2b$10$Ev2c2PYgZrJ6qP6JJyhA9OBAOW5Nd2/WsWKmlYUrJL2KlUYN4ceda";

console.log("🔐 Testando validação de senha...\n");
console.log("Hash do .env.local:", hashFromEnv || "NÃO DEFINIDO");
console.log("Hash padrão do código:", defaultHash);
console.log("");

const hashToTest = hashFromEnv || defaultHash;

async function testAllPasswords() {
  console.log("Testando múltiplas senhas contra o hash:\n");
  
  for (const password of testPasswords) {
    const isValid = await bcrypt.compare(password, hashToTest);
    console.log(`  "${password}" → ${isValid ? "✅ VÁLIDA" : "❌ INVÁLIDA"}`);
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("Gerando novos hashes para referência:\n");
  
  for (const password of testPasswords) {
    const newHash = await bcrypt.hash(password, 10);
    console.log(`  Senha: "${password}"`);
    console.log(`  Hash:  ${newHash}\n`);
  }
}

testAllPasswords();
