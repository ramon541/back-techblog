/**
 * Authentication Domain Types
 *
 * This file contains all TypeScript interfaces and types related to authentication operations.
 * It defines the data contracts used across authentication layers (service, controller, middleware).
 */

interface LoginCredentials extends Pick<User, 'email' | 'password'> {}
