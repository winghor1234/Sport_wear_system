export function getSearchParam(req: Request) {
    const { searchParams } = new URL(req.url)
    return searchParams.get("search") || ""

}