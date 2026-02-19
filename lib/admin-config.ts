export const getAdminEmails = (): string[] => {
    const envAdmins = process.env.ADMIN_EMAILS || "";
    return envAdmins.split(",").map(email => email.trim()).filter(email => email.length > 0);
};

export const isSystemAdmin = (email: string | null | undefined): boolean => {
    if (!email) return false;
    const admins = getAdminEmails();
    return admins.includes(email);
};
