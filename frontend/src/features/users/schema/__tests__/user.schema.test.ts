import { userSchema } from '../user.schema';

describe('userSchema', () => {
  it('should validate valid username and email', () => {
    const validData = { username: 'testuser', email: 'test@example.com' };
    expect(() => userSchema.parse(validData)).not.toThrow();
  });

  it('should fail for empty username', () => {
    const invalidData = { username: '', email: 'test@example.com' };
    expect(() => userSchema.parse(invalidData)).toThrow('The username is required');
  });

  it('should fail for invalid email format', () => {
    const invalidData = { username: 'testuser', email: 'invalid-email' };
    expect(() => userSchema.parse(invalidData)).toThrow('Invalid email');
  });

  it('should fail for empty email', () => {
    const invalidData = { username: 'testuser', email: '' };
    expect(() => userSchema.parse(invalidData)).toThrow('The email is required');
  });

  it('should fail for non-string email', () => {
    const invalidData = { username: 'testuser', email: 123 };
    expect(() => userSchema.parse(invalidData)).toThrow('Email must be a string');
  });
});
