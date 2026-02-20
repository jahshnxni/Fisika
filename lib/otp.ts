import crypto from 'crypto';

export function generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        // crypto.randomInt is secure (introduced in Node 14.10)
        otp += digits[crypto.randomInt(0, 10)];
    }
    return otp;
}
