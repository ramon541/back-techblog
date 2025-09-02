// src/utils/password.ts
/**
 * Password Utilities
 *
 * This file contains all password-related operations including hashing,
 * validation, and comparison using bcrypt library.
 * Provides a centralized and secure way to handle password operations.
 */

import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

const DEFAULT_SALT_ROUNDS = env.BCRYPT_SALT_ROUNDS;

// =============================================================================
// PASSWORD OPERATIONS
// =============================================================================

/**
 * Hash a plain text password using bcrypt
 * @param plainPassword - The plain text password to hash
 * @param saltRounds - Optional custom salt rounds
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(
    plainPassword: string,
    saltRounds: number = DEFAULT_SALT_ROUNDS
): Promise<string> {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        throw new Error(`Failed to hash password: ${error}`);
    }
}

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export async function comparePassword(
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw new Error(`Failed to compare password: ${error}`);
    }
}
