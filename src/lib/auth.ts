import type { NextAuthOptions, Session, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { verifyPassword, isValidEmail } from './utils';
import { JWT } from 'next-auth/jwt';
import crypto from 'crypto';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'CLIENTE' | 'VENDEDOR' | 'ADMIN';
      avatarUrl?: string | null;
    };
  }
  interface User {
    id: string;
    role: 'CLIENTE' | 'VENDEDOR' | 'ADMIN';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'CLIENTE' | 'VENDEDOR' | 'ADMIN';
  }
}

const SECRET = process.env.NEXTAUTH_SECRET || 'moda-center-dev-secret';

function b64url(buf: Buffer | Uint8Array | string) {
  if (typeof buf === 'string') buf = Buffer.from(buf, 'utf-8');
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function b64urlDecode(input: string) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;
  if (pad) input += '='.repeat(4 - pad);
  return Buffer.from(input, 'base64');
}

async function encodeJWT(params: { token: any; secret: string; maxAge: number }) {
  try {
    const { token, secret, maxAge } = params;
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      ...token,
      iat: now,
      exp: now + maxAge,
      jti: crypto.randomUUID(),
    };
    const headerB64 = b64url(JSON.stringify(header));
    const payloadB64 = b64url(JSON.stringify(payload));
    const data = `${headerB64}.${payloadB64}`;
    const sig = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest();
    return `${data}.${b64url(sig)}`;
  } catch (e) {
    console.error('[JWT_ENCODE_ERROR]', e);
    throw e;
  }
}

async function decodeJWT(params: { token: string; secret: string }) {
  try {
    const { token, secret } = params;
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;
    const data = `${headerB64}.${payloadB64}`;
    const expected = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest();
    const actual = b64urlDecode(sigB64);
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
      return null;
    }
    const payload = JSON.parse(b64urlDecode(payloadB64).toString('utf-8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch (e) {
    console.error('[JWT_DECODE_ERROR]', e);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
    secret: SECRET,
    encode: encodeJWT,
    decode: decodeJWT,
  },
  secret: SECRET,
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/cadastro',
    error: '/auth/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Informe e-mail e senha');
          }
          if (!isValidEmail(credentials.email)) {
            throw new Error('E-mail inválido');
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          });

          if (!user) {
            throw new Error('E-mail ou senha incorretos');
          }

          const valid = await verifyPassword(credentials.password, user.passwordHash);
          if (!valid) {
            throw new Error('E-mail ou senha incorretos');
          }

          if (user.dataRequestDelete) {
            throw new Error('Conta em processo de exclusão.');
          }

          try {
            await prisma.auditLog.create({
              data: {
                userId: user.id,
                action: 'LOGIN',
                entity: 'User',
                entityId: user.id,
              },
            });
          } catch {}

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.avatarUrl,
          } as any;
        } catch (err) {
          console.error('[AUTH_ERROR]', err);
          throw err;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      try {
        if (trigger === 'update' && session?.name) {
          token.name = session.name;
          token.picture = session.avatarUrl;
        }
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
      } catch (e) {
        console.error('[JWT_CALLBACK_ERROR]', e);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user && token) {
          session.user.id = token.id;
          session.user.role = token.role;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.avatarUrl = token.picture || null;
        }
        return session;
      } catch (e) {
        console.error('[SESSION_CALLBACK_ERROR]', e);
        return session;
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      } catch {
        return baseUrl;
      }
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: token.id,
              action: 'LOGOUT',
              entity: 'User',
              entityId: token.id,
            },
          });
        } catch {}
      }
    },
  },
};
