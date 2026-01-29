import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// Script para criar usuário admin inicial
async function createAdminUser() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db('mercurius');
    const usersCollection = db.collection('users');

    // Verifica se já existe um usuário admin
    const existingAdmin = await usersCollection.findOne({ 
      username: 'admin',
      role: 'admin' 
    });

    if (existingAdmin) {
      console.log('\n⚠️  Usuário admin já existe!');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      console.log('Nome:', existingAdmin.name);
      console.log('\nSe precisar redefinir a senha, use o script change-password.ts');
      return;
    }

    // Cria índices únicos
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('✓ Índices criados');

    // Senha padrão ou da variável de ambiente
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    const adminUser = {
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@mercurius.com',
      name: 'Administrador',
      passwordHash,
      role: 'admin' as const,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(adminUser);
    console.log('\n✓ Usuário admin criado com sucesso!');
    console.log('\n📋 Credenciais:');
    console.log('  Username:', adminUser.username);
    console.log('  Email:', adminUser.email);
    console.log('  Senha:', password);
    console.log('  ID:', result.insertedId);
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    console.log('\n🔐 Para alterar a senha via .env.local:');
    console.log('  ADMIN_PASSWORD=suanovaSenha');
    console.log('  npm run setup-admin');

  } catch (error) {
    console.error('\n❌ Erro ao criar usuário admin:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✓ Conexão fechada');
  }
}

createAdminUser();
