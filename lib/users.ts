import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import type { User, CreateUserInput } from '@/types/user';

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    const user = await db
      .collection('users')
      .findOne({ username, active: true });

    if (!user) {
      return null;
    }

    return {
      ...user,
      _id: user._id.toString(),
    } as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    const user = await db
      .collection('users')
      .findOne({ email, active: true });

    if (!user) {
      return null;
    }

    return {
      ...user,
      _id: user._id.toString(),
    } as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function createUser(input: CreateUserInput): Promise<User | null> {
  try {
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    // Verifica se usuário já existe
    const existingUser = await db
      .collection('users')
      .findOne({ 
        $or: [
          { username: input.username },
          { email: input.email }
        ]
      });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = {
      username: input.username,
      email: input.email,
      name: input.name,
      passwordHash,
      role: input.role || 'user',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(user);

    return {
      ...user,
      _id: result.insertedId.toString(),
    } as User;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const result = await db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            passwordHash,
            updatedAt: new Date()
          }
        }
      );

    return result.matchedCount > 0;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
}

export async function deactivateUser(userId: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    const result = await db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            active: false,
            updatedAt: new Date()
          }
        }
      );

    return result.matchedCount > 0;
  } catch (error) {
    console.error('Error deactivating user:', error);
    return false;
  }
}
