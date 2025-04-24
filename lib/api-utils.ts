export function getPaginationParams(request: Request) {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const skip = (page - 1) * limit
  
    return { page, limit, skip }
  }
  
  export function getPaginatedResponse(items: any[], totalItems: number, page: number, limit: number) {
    const totalPages = Math.ceil(totalItems / limit)
  
    return {
      data: items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }
  }
  
  