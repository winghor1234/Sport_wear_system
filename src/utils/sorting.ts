export function getSortingParams(req: Request) {
    const { searchParams } = new URL(req.url)
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") === "asc" ? "asc" : "desc"
    return { [sort]: order }
}