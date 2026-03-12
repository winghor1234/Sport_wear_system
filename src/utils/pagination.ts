export function getPaginationParams(req: Request) {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10
    const skip = (page - 1) * limit
    return { page, limit, skip }
}

export function getPaginationMeta(total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit)
    return { total, page, limit, totalPages }
}