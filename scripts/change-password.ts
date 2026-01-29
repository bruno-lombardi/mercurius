import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// Script para alterar senha de usuário
async function changePassword() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }

  const username = process.argv[2];
  const newPassword = process.argv[3];

  if (!username || !newPassword) {
    console.log('❌ Uso incorreto!');
    console.log('\nUso correto:');
    console.log('  npm run change-password <username> <nova-senha>');
    console.log('\nExemplo:');
    console.log('  npm run change-password admin minhaNovasenha123');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db('mercurius');
    const usersCollection = db.collection('users');

    // Busca o usuário
    const user = await usersCollection.findOne({ username });

    if (!user) {
      console.log(`\n❌ Usuário "${username}" não encontrado!`);
      process.exit(1);
    }

    // Gera novo hash
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha
    await usersCollection.updateOne(
      { username },
      { 
        $set: { 
          passwordHash,
          updatedAt: new Date()
        }
      }
    );

    console.log('\n✓ Senha alterada com sucesso!');
    console.log('\n📋 Informações:');
    console.log('  Username:', username);
    console.log('  Nova senha:', newPassword);
    console.log('\n⚠️  Guarde essa senha em local seguro!');

  } catch (error) {
    console.error('\n❌ Erro ao alterar senha:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✓ Conexão fechada');
  }
}

changePassword();
