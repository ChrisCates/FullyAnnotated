// TOTP (2FA) Secret
import { TOTP, Secret } from 'otpauth';
import { randomBytes } from 'crypto';
import { encode } from 'hi-base32';

export const totpIssuer = process.env.TOTP_ISSUER || 'JADEO';
export const totpLabel = process.env.TOTP_LABEL || 'JADEO';
export const totpSecret = process.env.TOTP_SECRET || 'JADEO';

export function twofaSecretFactory(len: number = 12): string  {
    let hex  = randomBytes(Math.ceil(len / 2)).toString('hex');
    return encode(hex, true).slice(0, len);
}

export function twofaAuthFactory() {
    let secretBase32 = twofaSecretFactory();
    let secret = Secret.fromRaw(secretBase32);
    let totp = new TOTP({
        issuer: totpIssuer,
        label: totpLabel,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret,
    });

    return {
        secret,
        totp
    };
}

export function getTwofaAuth(secret) {
    return new TOTP({
        issuer: totpIssuer,
        label: totpLabel,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: Secret.fromB32(secret)
    });
}