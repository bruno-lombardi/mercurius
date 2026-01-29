import bcrypt from "bcryptjs";

// Script para gerar hash de senha
const password = process.argv[2] || "admin123";

bcrypt.hash(password, 10).then((hash) => {
  console.log("\n🔐 Hash gerado para a senha:", password);
  console.log("\nAdicione esta linha no seu .env.local:");
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log("\n");
});
