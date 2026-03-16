// import { prisma } from "@/lib/prisma"
// import bcrypt from "bcryptjs"
// import { signToken } from "@/utils/jwt"

// export const adminAuthService = {

//     async login(username: string, password: string) {

//         const user = await prisma.employee.findUnique({
//             where: { username }
//         })

//         if (!user) {
//             throw new Error("Invalid username")
//         }

//         const valid = await bcrypt.compare(password, user.password)

//         if (!valid) {
//             throw new Error("Invalid password")
//         }

//         const token = signToken({
//             user_id: user.employee_id,
//             phone: user.phone,
//             role: user.role
//         })

//         return {
//             token,
//             user
//         }

//     }

// }