import { NextResponse } from "next/server"

export function successResponse<T>(data: T | null, message: string, statusCode: number = 200) {
    return NextResponse.json(
        {
            success: true,
            message,
            data,
        },
        { status: statusCode }
    );
}

export const errorResponse = (message: string, statusCode = 500, error?: unknown) =>
    NextResponse.json(
        {
            success: false,
            message,
            error: error instanceof Error ? error.message : typeof error === "string" ? error : null,
        },
        { status: statusCode }
    );



export class BadRequestError extends Error {
    statusCode: number;

    constructor(message = "Bad Request") {
        super(message);
        this.name = "BadRequestError";
        this.statusCode = 400;
    }
}

export class UnauthorizedError extends Error {
    statusCode: number;

    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401;
    }
}

export class ForbiddenError extends Error {
    statusCode: number;

    constructor(message = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
        this.statusCode = 403;
    }
}

export class NotFoundError extends Error {
    statusCode: number;

    constructor(message = "Not Found") {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}
