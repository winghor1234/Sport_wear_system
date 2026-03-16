import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/utils/password"
import { sendSuccess } from "@/utils/response"

export async function POST(req: Request) {

    const body = await req.json()

    const user = await prisma.customer.create({
        data: {
            customer_name: body.customer_name,
            email: body.email,
            phone: body.phone,
            password: await hashPassword(body.password)
        }
    })

    return sendSuccess(user)

}