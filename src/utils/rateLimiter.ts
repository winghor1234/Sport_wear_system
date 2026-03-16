import { RateLimiterMemory } from "rate-limiter-flexible"

export const loginLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60
})

export const otpLimiter = new RateLimiterMemory({
    points: 3,
    duration: 60
})

export const apiLimiter = new RateLimiterMemory({
    points: 100,
    duration: 60
})