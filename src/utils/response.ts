import { NextResponse } from "next/server"

export function sendSuccess<T>(data: T, message = "Success") {
    return NextResponse.json(
        {
            success: true,
            message,
            data
        },
        { status: 200 }
    )
}

export function sendCreated<T>(data: T, message = "Created successfully") {
    return NextResponse.json(
        {
            success: true,
            message,
            data
        },
        { status: 201 }
    )
}

export function sendError(
    message = "Internal Server Error",
    status = 500,
    error?: unknown
) {
    return NextResponse.json(
        {
            success: false,
            message,
            error
        },
        { status }
    )
}