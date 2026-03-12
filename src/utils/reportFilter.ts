import { NextRequest } from "next/server"

export function getReportDateFilter(
    req: NextRequest,
    field: string
) {

    const { searchParams } = new URL(req.url)

    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const month = searchParams.get("month")
    const year = searchParams.get("year")

    // 1️⃣ filter by startDate + endDate
    if (startDate && endDate) {
        return {
            [field]: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        }
    }

    // 2️⃣ filter by month
    if (month && year) {

        const start = new Date(Number(year), Number(month) - 1, 1)
        const end = new Date(Number(year), Number(month), 0)

        return {
            [field]: {
                gte: start,
                lte: end
            }
        }
    }

    // 3️⃣ filter by year
    if (year) {

        const start = new Date(Number(year), 0, 1)
        const end = new Date(Number(year), 11, 31)

        return {
            [field]: {
                gte: start,
                lte: end
            }
        }
    }

    return {}

}