import { NextRequest } from "next/server"
import { verifyAccessToken } from "./jwt"

export function authenticate(req: NextRequest) {

    const auth = req.headers.get("authorization")

    if (!auth) throw new Error("Unauthorized")

    const token = auth.split(" ")[1]

    return verifyAccessToken(token)

}
