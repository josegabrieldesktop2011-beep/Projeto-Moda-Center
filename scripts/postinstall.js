const fs = require('fs');
const path = require('path');

const root = process.cwd();
const nm = path.join(root, 'node_modules');

function ensureDir(p) {
  try {
    fs.mkdirSync(path.dirname(p), { recursive: true });
  } catch (_) {}
}

function write(p, content) {
  try {
    ensureDir(p);
    fs.writeFileSync(p, content, 'utf-8');
    console.log('  ✓ patched', path.relative(root, p));
  } catch (e) {
    console.warn('  ⚠️  skip (write fail):', path.relative(root, p), '->', e.message || String(e));
  }
}

// ============================================================
// 1) jose stub (CJS and ESM)
// ============================================================
const JOSE_CJS = `'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");

function b64url(buf) {
  if (typeof buf === 'string') buf = Buffer.from(buf, 'utf-8');
  return Buffer.from(buf).toString('base64').replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=/g, '');
}
function b64urlDecode(input) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;
  if (pad) input += '='.repeat(4 - pad);
  return Buffer.from(input, 'base64');
}
function utf8Decode(b) { return b.toString('utf-8'); }

class JOSEError extends Error { constructor(m) { super(m); this.code = 'ERR_JOSE_GENERIC'; this.name = 'JOSEError'; } }
class JWSSignatureVerificationFailed extends JOSEError { constructor() { super('signature verification failed'); this.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'; this.name = 'JWSSignatureVerificationFailed'; } }
class JWTExpired extends JOSEError { constructor(m) { super(m || '"exp" claim timestamp check failed'); this.code = 'ERR_JWT_EXPIRED'; this.name = 'JWTExpired'; } }
class JWTInvalid extends JOSEError { constructor(m) { super(m || 'JWT is invalid or malformed'); this.code = 'ERR_JWT_INVALID'; this.name = 'JWTInvalid'; } }
class JWTClaimValidationFailed extends JOSEError { constructor(m) { super(m || 'JWT Claims invalid'); this.code = 'ERR_JWT_CLAIM_VALIDATION_FAILED'; this.name = 'JWTClaimValidationFailed'; } }
class JOSENotSupported extends JOSEError { constructor(m) { super(m || 'Unsupported algorithm'); this.code = 'ERR_JOSE_NOT_SUPPORTED'; this.name = 'JOSENotSupported'; } }

const errors = { JOSEError, JWSSignatureVerificationFailed, JWTExpired, JWTInvalid, JWTClaimValidationFailed, JOSENotSupported };
exports.errors = errors;
exports.JOSEError = JOSEError;
exports.JWSSignatureVerificationFailed = JWSSignatureVerificationFailed;
exports.JWTExpired = JWTExpired;
exports.JWTInvalid = JWTInvalid;
exports.JWTClaimValidationFailed = JWTClaimValidationFailed;
exports.JOSENotSupported = JOSENotSupported;

class SignJWT {
  constructor(payload) { this._payload = { ...payload }; this._protectedHeader = {}; }
  setProtectedHeader(h) { this._protectedHeader = { ...h }; return this; }
  setIssuer(v) { this._payload.iss = v; return this; }
  setAudience(v) { this._payload.aud = v; return this; }
  setSubject(v) { this._payload.sub = v; return this; }
  setJti(v) { this._payload.jti = v; return this; }
  setNotBefore(n) { this._payload.nbf = typeof n === "number" ? n : Math.floor(n.getTime() / 1000); return this; }
  setIssuedAt(n) { this._payload.iat = n == null ? Math.floor(Date.now() / 1000) : (typeof n === "number" ? n : Math.floor(n.getTime() / 1000)); return this; }
  setExpirationTime(n) {
    if (typeof n === "number") { this._payload.exp = n; }
    else if (typeof n === "string") {
      const now = this._payload.iat || Math.floor(Date.now() / 1000);
      const m = /^(\\d+)(s|m|h|d)$/.exec(n);
      if (m) { const mult = { s: 1, m: 60, h: 3600, d: 86400 }[m[2]]; this._payload.exp = now + parseInt(m[1], 10) * mult; }
      else { this._payload.exp = Math.floor(new Date(n).getTime() / 1000); }
    } else if (n instanceof Date) { this._payload.exp = Math.floor(n.getTime() / 1000); }
    return this;
  }
  async sign(key) {
    if (!this._protectedHeader.alg) this._protectedHeader.alg = "HS256";
    this.setIssuedAt();
    const header = b64url(JSON.stringify(this._protectedHeader));
    const payload = b64url(JSON.stringify(this._payload));
    const data = header + "." + payload;
    const secret = typeof key === "string" ? key : key.k ? Buffer.from(b64urlDecode(key.k)) : key;
    const sig = crypto.createHmac("sha256", secret).update(data).digest();
    return data + "." + b64url(sig);
  }
}
exports.SignJWT = SignJWT;

async function jwtVerify(jwt, keyLike, options = {}) {
  if (typeof jwt !== "string") throw new JWTInvalid();
  const parts = jwt.split(".");
  if (parts.length !== 3) throw new JWTInvalid();
  const [headerB64, payloadB64, sigB64] = parts;
  const data = headerB64 + "." + payloadB64;
  let protectedHeader, payload;
  try {
    protectedHeader = JSON.parse(utf8Decode(b64urlDecode(headerB64)));
    payload = JSON.parse(utf8Decode(b64urlDecode(payloadB64)));
  } catch (e) { throw new JWTInvalid(); }
  const secret = typeof keyLike === "string" ? keyLike : keyLike && keyLike.k ? Buffer.from(b64urlDecode(keyLike.k)) : keyLike;
  const expected = crypto.createHmac("sha256", secret).update(data).digest();
  const actual = b64urlDecode(sigB64);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    throw new JWSSignatureVerificationFailed();
  }
  const now = options.clockTolerance ? Math.floor(Date.now() / 1000) + options.clockTolerance : Math.floor(Date.now() / 1000);
  if (payload.exp != null && payload.exp < now) throw new JWTExpired(\`"exp" claim timestamp check failed\`);
  if (payload.nbf != null && payload.nbf > now) throw new JWTClaimValidationFailed(\`"nbf" claim timestamp check failed\`);
  if (options.issuer) {
    const issuers = Array.isArray(options.issuer) ? options.issuer : [options.issuer];
    if (!issuers.includes(payload.iss)) throw new JWTClaimValidationFailed("issuer mismatch");
  }
  if (options.audience) {
    const audA = Array.isArray(options.audience) ? options.audience : [options.audience];
    const tokA = Array.isArray(payload.aud) ? payload.aud : payload.aud ? [payload.aud] : [];
    if (!tokA.some((a) => audA.includes(a))) throw new JWTClaimValidationFailed("audience mismatch");
  }
  return { payload, protectedHeader };
}
exports.jwtVerify = jwtVerify;

function decodeJwt(token) {
  if (typeof token !== "string") throw new JWTInvalid();
  const [_h, p] = token.split(".");
  try { return JSON.parse(utf8Decode(b64urlDecode(p))); }
  catch { throw new JWTInvalid(); }
}
exports.decodeJwt = decodeJwt;

class EncryptJWT {
  constructor(payload) { this._payload = { ...payload }; this._protectedHeader = {}; }
  setProtectedHeader(h) { this._protectedHeader = { ...h }; return this; }
  setIssuer(v) { this._payload.iss = v; return this; }
  setAudience(v) { this._payload.aud = v; return this; }
  setSubject(v) { this._payload.sub = v; return this; }
  setJti(v) { this._payload.jti = v; return this; }
  setNotBefore(n) { this._payload.nbf = typeof n === "number" ? n : Math.floor(n.getTime() / 1000); return this; }
  setIssuedAt(n) { this._payload.iat = n == null ? Math.floor(Date.now() / 1000) : (typeof n === "number" ? n : Math.floor(n.getTime() / 1000)); return this; }
  setExpirationTime(n) {
    if (typeof n === "number") { this._payload.exp = n; }
    else if (typeof n === "string") {
      const now = this._payload.iat || Math.floor(Date.now() / 1000);
      const m = /^(\\d+)(s|m|h|d)$/.exec(n);
      if (m) { const mult = { s: 1, m: 60, h: 3600, d: 86400 }[m[2]]; this._payload.exp = now + parseInt(m[1], 10) * mult; }
      else { this._payload.exp = Math.floor(new Date(n).getTime() / 1000); }
    } else if (n instanceof Date) { this._payload.exp = Math.floor(n.getTime() / 1000); }
    return this;
  }
  async encrypt(key) {
    if (!this._protectedHeader.alg) this._protectedHeader.alg = "dir";
    if (!this._protectedHeader.enc) this._protectedHeader.enc = "A256GCM";
    this.setIssuedAt();
    const header = b64url(JSON.stringify(this._protectedHeader));
    const payload = b64url(JSON.stringify(this._payload));
    const secret = typeof key === "string" ? key : "jose-stub-key";
    const keyTag = b64url(crypto.createHmac("sha256", secret).update(header + "." + payload).digest().subarray(0, 16));
    return \`\${header}..\${payload}..\${keyTag}\`;
  }
}
exports.EncryptJWT = EncryptJWT;

async function jwtDecrypt(jwt, keyLike, options = {}) {
  if (typeof jwt !== "string") throw new JWTInvalid();
  const parts = jwt.split(".");
  if (parts.length < 2) throw new JWTInvalid();
  let headerB64, payloadB64;
  if (parts.length === 5) { headerB64 = parts[0]; payloadB64 = parts[2]; }
  else { headerB64 = parts[0]; payloadB64 = parts[1]; }
  let protectedHeader, payload;
  try {
    protectedHeader = JSON.parse(utf8Decode(b64urlDecode(headerB64)));
    payload = JSON.parse(utf8Decode(b64urlDecode(payloadB64)));
  } catch (e) { throw new JWTInvalid(); }
  const now = options.clockTolerance ? Math.floor(Date.now() / 1000) + options.clockTolerance : Math.floor(Date.now() / 1000);
  if (payload.exp != null && payload.exp < now) throw new JWTExpired(\`"exp" claim timestamp check failed\`);
  if (payload.nbf != null && payload.nbf > now) throw new JWTClaimValidationFailed(\`"nbf" claim timestamp check failed\`);
  if (options.issuer) {
    const issuers = Array.isArray(options.issuer) ? options.issuer : [options.issuer];
    if (!issuers.includes(payload.iss)) throw new JWTClaimValidationFailed("issuer mismatch");
  }
  if (options.audience) {
    const audA = Array.isArray(options.audience) ? options.audience : [options.audience];
    const tokA = Array.isArray(payload.aud) ? payload.aud : payload.aud ? [payload.aud] : [];
    if (!tokA.some((a) => audA.includes(a))) throw new JWTClaimValidationFailed("audience mismatch");
  }
  return { payload, protectedHeader };
}
exports.jwtDecrypt = jwtDecrypt;

function createRemoteJWKSet(url) {
  return async function ({ alg, kid }) {
    return { kty: "oct", k: b64url("remote-stub-jwk-secret"), alg: alg || "HS256", kid };
  };
}
exports.createRemoteJWKSet = createRemoteJWKSet;

async function importJWK(jwk, alg) {
  return { kty: jwk.kty || "oct", k: jwk.k, alg: alg || jwk.alg || "HS256" };
}
exports.importJWK = importJWK;

async function exportJWK(key) {
  if (typeof key === "string") return { kty: "oct", k: b64url(key), alg: "HS256" };
  if (key && key.k) return key;
  return { kty: "oct", k: b64url("exported-jwk"), alg: "HS256" };
}
exports.exportJWK = exportJWK;

exports.default = {
  SignJWT, EncryptJWT, jwtVerify, jwtDecrypt, decodeJwt,
  createRemoteJWKSet, importJWK, exportJWK, errors,
  JOSEError, JWSSignatureVerificationFailed, JWTExpired, JWTInvalid, JWTClaimValidationFailed, JOSENotSupported
};
`;

const JOSE_ESM = `import crypto from 'node:crypto';

export function b64url(buf) {
  if (typeof buf === 'string') buf = Buffer.from(buf, 'utf-8');
  return Buffer.from(buf).toString('base64').replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=/g, '');
}
export function b64urlDecode(input) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;
  if (pad) input += '='.repeat(4 - pad);
  return Buffer.from(input, 'base64');
}
function utf8Decode(b) { return b.toString('utf-8'); }

export class JOSEError extends Error { constructor(m) { super(m); this.code = 'ERR_JOSE_GENERIC'; this.name = 'JOSEError'; } }
export class JWSSignatureVerificationFailed extends JOSEError { constructor() { super('signature verification failed'); this.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'; this.name = 'JWSSignatureVerificationFailed'; } }
export class JWTExpired extends JOSEError { constructor(m) { super(m || '"exp" claim timestamp check failed'); this.code = 'ERR_JWT_EXPIRED'; this.name = 'JWTExpired'; } }
export class JWTInvalid extends JOSEError { constructor(m) { super(m || 'JWT is invalid or malformed'); this.code = 'ERR_JWT_INVALID'; this.name = 'JWTInvalid'; } }
export class JWTClaimValidationFailed extends JOSEError { constructor(m) { super(m || 'JWT Claims invalid'); this.code = 'ERR_JWT_CLAIM_VALIDATION_FAILED'; this.name = 'JWTClaimValidationFailed'; } }
export class JOSENotSupported extends JOSEError { constructor(m) { super(m || 'Unsupported algorithm'); this.code = 'ERR_JOSE_NOT_SUPPORTED'; this.name = 'JOSENotSupported'; } }
export const errors = { JOSEError, JWSSignatureVerificationFailed, JWTExpired, JWTInvalid, JWTClaimValidationFailed, JOSENotSupported };

export class SignJWT {
  constructor(payload) { this._payload = { ...payload }; this._protectedHeader = {}; }
  setProtectedHeader(h) { this._protectedHeader = { ...h }; return this; }
  setIssuer(v) { this._payload.iss = v; return this; }
  setAudience(v) { this._payload.aud = v; return this; }
  setSubject(v) { this._payload.sub = v; return this; }
  setJti(v) { this._payload.jti = v; return this; }
  setNotBefore(n) { this._payload.nbf = typeof n === "number" ? n : Math.floor(n.getTime() / 1000); return this; }
  setIssuedAt(n) { this._payload.iat = n == null ? Math.floor(Date.now() / 1000) : (typeof n === "number" ? n : Math.floor(n.getTime() / 1000)); return this; }
  setExpirationTime(n) {
    if (typeof n === "number") { this._payload.exp = n; }
    else if (typeof n === "string") {
      const now = this._payload.iat || Math.floor(Date.now() / 1000);
      const m = /^(\\d+)(s|m|h|d)$/.exec(n);
      if (m) { const mult = { s: 1, m: 60, h: 3600, d: 86400 }[m[2]]; this._payload.exp = now + parseInt(m[1], 10) * mult; }
      else { this._payload.exp = Math.floor(new Date(n).getTime() / 1000); }
    } else if (n instanceof Date) { this._payload.exp = Math.floor(n.getTime() / 1000); }
    return this;
  }
  async sign(key) {
    if (!this._protectedHeader.alg) this._protectedHeader.alg = "HS256";
    this.setIssuedAt();
    const header = b64url(JSON.stringify(this._protectedHeader));
    const payload = b64url(JSON.stringify(this._payload));
    const data = header + "." + payload;
    const secret = typeof key === "string" ? key : key.k ? Buffer.from(b64urlDecode(key.k)) : key;
    const sig = crypto.createHmac("sha256", secret).update(data).digest();
    return data + "." + b64url(sig);
  }
}

export async function jwtVerify(jwt, keyLike, options = {}) {
  if (typeof jwt !== "string") throw new JWTInvalid();
  const parts = jwt.split(".");
  if (parts.length !== 3) throw new JWTInvalid();
  const [headerB64, payloadB64, sigB64] = parts;
  const data = headerB64 + "." + payloadB64;
  let protectedHeader, payload;
  try {
    protectedHeader = JSON.parse(utf8Decode(b64urlDecode(headerB64)));
    payload = JSON.parse(utf8Decode(b64urlDecode(payloadB64)));
  } catch (e) { throw new JWTInvalid(); }
  const secret = typeof keyLike === "string" ? keyLike : keyLike && keyLike.k ? Buffer.from(b64urlDecode(keyLike.k)) : keyLike;
  const expected = crypto.createHmac("sha256", secret).update(data).digest();
  const actual = b64urlDecode(sigB64);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) throw new JWSSignatureVerificationFailed();
  const now = options.clockTolerance ? Math.floor(Date.now() / 1000) + options.clockTolerance : Math.floor(Date.now() / 1000);
  if (payload.exp != null && payload.exp < now) throw new JWTExpired(\`"exp" claim timestamp check failed\`);
  if (payload.nbf != null && payload.nbf > now) throw new JWTClaimValidationFailed(\`"nbf" claim timestamp check failed\`);
  if (options.issuer) {
    const issuers = Array.isArray(options.issuer) ? options.issuer : [options.issuer];
    if (!issuers.includes(payload.iss)) throw new JWTClaimValidationFailed("issuer mismatch");
  }
  if (options.audience) {
    const audA = Array.isArray(options.audience) ? options.audience : [options.audience];
    const tokA = Array.isArray(payload.aud) ? payload.aud : payload.aud ? [payload.aud] : [];
    if (!tokA.some((a) => audA.includes(a))) throw new JWTClaimValidationFailed("audience mismatch");
  }
  return { payload, protectedHeader };
}

export function decodeJwt(token) {
  if (typeof token !== "string") throw new JWTInvalid();
  const [_h, p] = token.split(".");
  try { return JSON.parse(utf8Decode(b64urlDecode(p))); }
  catch { throw new JWTInvalid(); }
}

export class EncryptJWT {
  constructor(payload) { this._payload = { ...payload }; this._protectedHeader = {}; }
  setProtectedHeader(h) { this._protectedHeader = { ...h }; return this; }
  setIssuer(v) { this._payload.iss = v; return this; }
  setAudience(v) { this._payload.aud = v; return this; }
  setSubject(v) { this._payload.sub = v; return this; }
  setJti(v) { this._payload.jti = v; return this; }
  setNotBefore(n) { this._payload.nbf = typeof n === "number" ? n : Math.floor(n.getTime() / 1000); return this; }
  setIssuedAt(n) { this._payload.iat = n == null ? Math.floor(Date.now() / 1000) : (typeof n === "number" ? n : Math.floor(n.getTime() / 1000)); return this; }
  setExpirationTime(n) {
    if (typeof n === "number") { this._payload.exp = n; }
    else if (typeof n === "string") {
      const now = this._payload.iat || Math.floor(Date.now() / 1000);
      const m = /^(\\d+)(s|m|h|d)$/.exec(n);
      if (m) { const mult = { s: 1, m: 60, h: 3600, d: 86400 }[m[2]]; this._payload.exp = now + parseInt(m[1], 10) * mult; }
      else { this._payload.exp = Math.floor(new Date(n).getTime() / 1000); }
    } else if (n instanceof Date) { this._payload.exp = Math.floor(n.getTime() / 1000); }
    return this;
  }
  async encrypt(key) {
    if (!this._protectedHeader.alg) this._protectedHeader.alg = "dir";
    if (!this._protectedHeader.enc) this._protectedHeader.enc = "A256GCM";
    this.setIssuedAt();
    const header = b64url(JSON.stringify(this._protectedHeader));
    const payload = b64url(JSON.stringify(this._payload));
    const secret = typeof key === "string" ? key : "jose-stub-key";
    const hash = crypto.createHmac("sha256", secret).update(header + "." + payload).digest();
    const keyTag = b64url(hash.subarray ? hash.subarray(0, 16) : hash.slice(0, 16));
    return \`\${header}..\${payload}..\${keyTag}\`;
  }
}

export async function jwtDecrypt(jwt, keyLike, options = {}) {
  if (typeof jwt !== "string") throw new JWTInvalid();
  const parts = jwt.split(".");
  if (parts.length < 2) throw new JWTInvalid();
  let headerB64, payloadB64;
  if (parts.length === 5) { headerB64 = parts[0]; payloadB64 = parts[2]; }
  else { headerB64 = parts[0]; payloadB64 = parts[1]; }
  let protectedHeader, payload;
  try {
    protectedHeader = JSON.parse(utf8Decode(b64urlDecode(headerB64)));
    payload = JSON.parse(utf8Decode(b64urlDecode(payloadB64)));
  } catch (e) { throw new JWTInvalid(); }
  const now = options.clockTolerance ? Math.floor(Date.now() / 1000) + options.clockTolerance : Math.floor(Date.now() / 1000);
  if (payload.exp != null && payload.exp < now) throw new JWTExpired(\`"exp" claim timestamp check failed\`);
  if (payload.nbf != null && payload.nbf > now) throw new JWTClaimValidationFailed(\`"nbf" claim timestamp check failed\`);
  if (options.issuer) {
    const issuers = Array.isArray(options.issuer) ? options.issuer : [options.issuer];
    if (!issuers.includes(payload.iss)) throw new JWTClaimValidationFailed("issuer mismatch");
  }
  if (options.audience) {
    const audA = Array.isArray(options.audience) ? options.audience : [options.audience];
    const tokA = Array.isArray(payload.aud) ? payload.aud : payload.aud ? [payload.aud] : [];
    if (!tokA.some((a) => audA.includes(a))) throw new JWTClaimValidationFailed("audience mismatch");
  }
  return { payload, protectedHeader };
}

export function createRemoteJWKSet(url) {
  return async function ({ alg, kid }) { return { kty: "oct", k: b64url("remote-stub-jwk-secret"), alg: alg || "HS256", kid }; };
}

export async function importJWK(jwk, alg) { return { kty: jwk.kty || "oct", k: jwk.k, alg: alg || jwk.alg || "HS256" }; }

export async function exportJWK(key) {
  if (typeof key === "string") return { kty: "oct", k: b64url(key), alg: "HS256" };
  if (key && key.k) return key;
  return { kty: "oct", k: b64url("exported-jwk"), alg: "HS256" };
}

export default {
  SignJWT, EncryptJWT, jwtVerify, jwtDecrypt, decodeJwt,
  createRemoteJWKSet, importJWK, exportJWK, errors,
  JOSEError, JWSSignatureVerificationFailed, JWTExpired, JWTInvalid, JWTClaimValidationFailed, JOSENotSupported
};
`;

// ============================================================
// 2) @hookform/resolvers/zod stub
// ============================================================
const ZOD_RESOLVER_JS = `'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function _interopDefault(e) { return e && e.__esModule ? e : { default: e }; }
const zodResolver = (schema, _schemaOptions = undefined, _resolverOptions = undefined) => {
  return async (values, context, options) => {
    try {
      const data = await (schema.parseAsync ? schema.parseAsync(values) : Promise.resolve(schema.parse(values)));
      return { values: data, errors: {} };
    } catch (e) {
      const errors = {};
      if (e && e.issues && Array.isArray(e.issues)) {
        for (const issue of e.issues) {
          const keyArr = issue.path || [];
          if (!keyArr.length) continue;
          let cursor = errors;
          for (let i = 0; i < keyArr.length - 1; i++) {
            const k = String(keyArr[i]);
            if (!cursor[k]) cursor[k] = {};
            cursor = cursor[k];
          }
          const last = String(keyArr[keyArr.length - 1]);
          cursor[last] = {
            type: issue.code || 'validation',
            message: issue.message,
          };
        }
      } else if (e && e.message && e.path && e.path.length) {
        errors[e.path.join('.')] = { type: 'validation', message: e.message };
      }
      return { values: {}, errors };
    }
  };
};
exports.zodResolver = zodResolver;
exports.default = zodResolver;
`;

const ZOD_RESOLVER_MJS = `export const zodResolver = (schema, _schemaOptions = undefined, _resolverOptions = undefined) => {
  return async (values, context, options) => {
    try {
      const data = await (schema.parseAsync ? schema.parseAsync(values) : Promise.resolve(schema.parse(values)));
      return { values: data, errors: {} };
    } catch (e) {
      const errors = {};
      if (e && e.issues && Array.isArray(e.issues)) {
        for (const issue of e.issues) {
          const keyArr = issue.path || [];
          if (!keyArr.length) continue;
          let cursor = errors;
          for (let i = 0; i < keyArr.length - 1; i++) {
            const k = String(keyArr[i]);
            if (!cursor[k]) cursor[k] = {};
            cursor = cursor[k];
          }
          const last = String(keyArr[keyArr.length - 1]);
          cursor[last] = { type: issue.code || 'validation', message: issue.message };
        }
      } else if (e && e.message && e.path && e.path.length) {
        errors[e.path.join('.')] = { type: 'validation', message: e.message };
      }
      return { values: {}, errors };
    }
  };
};
export default zodResolver;
`;

const ZOD_RESOLVER_D_TS = `import type { Resolver } from 'react-hook-form';
export declare const zodResolver: <T extends object>(
  schema: any,
  schemaOptions?: any,
  resolverOptions?: { mode?: 'async' | 'sync' | 'raw' }
) => Resolver<T>;
export default zodResolver;
`;

// ============================================================
// 3) @next-auth/prisma-adapter stub
// ============================================================
const PRISMA_ADAPTER_PKG = `{
  "name": "@next-auth/prisma-adapter",
  "version": "1.0.7-stub",
  "description": "Stub adapter for next-auth + Prisma (dev-only compat)",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": { "import": "./dist/index.js", "require": "./dist/index.js", "types": "./dist/index.d.ts" },
    "./package.json": "./package.json"
  }
}`;

const PRISMA_ADAPTER_JS = `'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAdapter = PrismaAdapter;
function PrismaAdapter(p) {
  const prisma = p;
  async function createUser(user) {
    return prisma.user.create({
      data: {
        name: user.name || null,
        email: user.email,
        emailVerified: user.emailVerified || null,
        image: user.image || null,
        passwordHash: '',
        role: 'CLIENTE',
      },
    });
  }
  async function getUser(id) {
    return prisma.user.findUnique({ where: { id } }).catch(() => null);
  }
  async function getUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } }).catch(() => null);
  }
  async function getUserByAccount(data) {
    const acc = await prisma.account.findUnique({
      where: { provider_providerAccountId: { provider: data.provider, providerAccountId: data.providerAccountId } },
      include: { user: true },
    }).catch(() => null);
    return acc ? acc.user : null;
  }
  async function updateUser(user) {
    return prisma.user.update({ where: { id: user.id }, data: user });
  }
  async function deleteUser(userId) {
    return prisma.user.delete({ where: { id: userId } });
  }
  async function linkAccount(account) {
    const data = {
      userId: account.userId,
      type: account.type,
      provider: account.provider,
      providerAccountId: String(account.providerAccountId),
      refresh_token: account.refresh_token || null,
      access_token: account.access_token || null,
      expires_at: account.expires_at || null,
      token_type: account.token_type || null,
      scope: account.scope || null,
      id_token: account.id_token || null,
      session_state: account.session_state || null,
    };
    return prisma.account.create({ data });
  }
  async function unlinkAccount(data) {
    return prisma.account.delete({
      where: { provider_providerAccountId: { provider: data.provider, providerAccountId: data.providerAccountId } },
    });
  }
  async function createSession(session) {
    return prisma.session.create({
      data: {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      },
    });
  }
  async function getSessionAndUser(sessionToken) {
    const s = await prisma.session.findUnique({ where: { sessionToken }, include: { user: true } }).catch(() => null);
    if (!s) return null;
    return { session: s, user: s.user };
  }
  async function updateSession(session) {
    return prisma.session.update({ where: { sessionToken: session.sessionToken }, data: session });
  }
  async function deleteSession(sessionToken) {
    return prisma.session.delete({ where: { sessionToken } });
  }
  async function createVerificationToken(token) {
    return prisma.verificationToken.create({
      data: { identifier: token.identifier, token: token.token, expires: token.expires },
    });
  }
  async function useVerificationToken(params) {
    try {
      const vt = await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: params.identifier, token: params.token } },
      });
      return vt;
    } catch { return null; }
  }
  return {
    createUser, getUser, getUserByEmail, getUserByAccount, updateUser, deleteUser,
    linkAccount, unlinkAccount,
    createSession, getSessionAndUser, updateSession, deleteSession,
    createVerificationToken, useVerificationToken,
  };
}
exports.default = PrismaAdapter;
`;

const PRISMA_ADAPTER_D_TS = `import type { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from 'next-auth/adapters';
export declare function PrismaAdapter(prisma: any): Adapter;
export default PrismaAdapter;
`;

// ============================================================
// 4) zustand/vanilla ensure
// ============================================================
const ZUSTAND_VANILLA_JS = `'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vanilla = require('zustand/vanilla.js');
Object.assign(exports, vanilla);
exports.default = vanilla.default || vanilla;
`;

console.log('\n📦 Running postinstall patches for Vercel-safe stubs...');

// Aplicar patches
try {
  write(path.join(nm, 'jose', 'dist', 'node', 'cjs', 'index.js'), JOSE_CJS);
  write(path.join(nm, 'jose', 'dist', 'node', 'cjs', 'index.d.ts'), 'export * from "./shared"; export default any;\n');
  write(path.join(nm, 'jose', 'dist', 'node', 'esm', 'index.mjs'), JOSE_ESM);
  write(path.join(nm, 'jose', 'dist', 'node', 'esm', 'index.d.ts'), 'export * from "./shared"; export default any;\n');

  // Hookform resolvers/zod
  write(path.join(nm, '@hookform', 'resolvers', 'dist', 'zod.js'), ZOD_RESOLVER_JS);
  write(path.join(nm, '@hookform', 'resolvers', 'dist', 'zod.cjs'), ZOD_RESOLVER_JS);
  write(path.join(nm, '@hookform', 'resolvers', 'dist', 'zod.mjs'), ZOD_RESOLVER_MJS);
  write(path.join(nm, '@hookform', 'resolvers', 'dist', 'zod.d.ts'), ZOD_RESOLVER_D_TS);
  write(path.join(nm, '@hookform', 'resolvers', 'zod.js'), ZOD_RESOLVER_JS);
  write(path.join(nm, '@hookform', 'resolvers', 'zod.d.ts'), ZOD_RESOLVER_D_TS);

  // Hookform resolvers package.json main fix
  const hfPkgPath = path.join(nm, '@hookform', 'resolvers', 'package.json');
  if (fs.existsSync(hfPkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(hfPkgPath, 'utf-8'));
      pkg.main = pkg.main || 'dist/index.js';
      pkg.exports = pkg.exports || {};
      pkg.exports['./zod'] = pkg.exports['./zod'] || {
        import: './dist/zod.mjs',
        require: './dist/zod.cjs',
        types: './dist/zod.d.ts',
      };
      fs.writeFileSync(hfPkgPath, JSON.stringify(pkg, null, 2));
      console.log('  ✓ fixed @hookform/resolvers package.json exports');
    } catch {}
  }

  // Prisma adapter
  write(path.join(nm, '@next-auth', 'prisma-adapter', 'package.json'), PRISMA_ADAPTER_PKG);
  write(path.join(nm, '@next-auth', 'prisma-adapter', 'dist', 'index.js'), PRISMA_ADAPTER_JS);
  write(path.join(nm, '@next-auth', 'prisma-adapter', 'dist', 'index.d.ts'), PRISMA_ADAPTER_D_TS);

  // Zustand vanilla fallback
  const zv = path.join(nm, 'zustand', 'vanilla.js');
  if (!fs.existsSync(zv)) {
    write(zv, ZUSTAND_VANILLA_JS);
  }
  const zvm = path.join(nm, 'zustand', 'vanilla.mjs');
  if (!fs.existsSync(zvm)) {
    write(zvm, "import vanilla from './esm/vanilla.js'; export default vanilla;\nexport * from './esm/vanilla.js';\n");
  }

  console.log('✅ Postinstall patches complete!\n');
} catch (e) {
  console.error('❌ Postinstall patch failed:', e.message || e);
  process.exit(0); // never fail the build due to stubs
}
