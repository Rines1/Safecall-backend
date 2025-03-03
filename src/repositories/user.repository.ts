import { db } from '../config/db';
import { users } from '../models/schema';
import { eq } from 'drizzle-orm';

type UserInput = {
  fullname: string;
  email: string;
  password: string;
};

export class UserRepository {
  async create(user: UserInput) {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async findById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
}