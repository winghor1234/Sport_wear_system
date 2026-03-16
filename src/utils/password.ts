import bcrypt from "bcryptjs"

// export async function hashPassword(password: string) {
//     return bcrypt.hash(password, 10)
// }

export async function hashPassword(password: string): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Error hashing password");
    }
}
export async function comparePassword(password: string, hashed: string) {
    return bcrypt.compare(password, hashed)
}