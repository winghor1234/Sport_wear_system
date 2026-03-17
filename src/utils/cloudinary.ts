import { v2 as cloudinary } from "cloudinary";

/* 🔧 CONFIG */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* 🔥 UPLOAD IMAGE */
export async function uploadImage(base64: string, folder = "products") {

    const result = await cloudinary.uploader.upload(base64, {
        folder: `Sport_wear_system/${folder}`,

        transformation: [
            { width: 1000, height: 1000, crop: "limit" },
            { quality: "auto:eco" },
            { fetch_format: "auto" },
            { dpr: "auto" }
        ],

        eager: [
            { width: 300, height: 300, crop: "fill" },
            { width: 600, height: 600, crop: "limit" }
        ]
    });

    return {
        url: result.secure_url,
        publicId: result.public_id
    };
}

/* 🔥 MULTIPLE */
export async function uploadMultipleImages(files: string[], folder = "products") {
    return Promise.all(files.map(file => uploadImage(file, folder)));
}

/* 🔥 DELETE */
export async function deleteImages(publicIds: string[]) {
    await Promise.all(publicIds.map(id => cloudinary.uploader.destroy(id)));
}

/* 🔥 CDN URL */
export function getOptimizedImageUrl(
    publicId: string,
    width = 800,
    height = 800
) {
    return cloudinary.url(publicId, {
        transformation: [
            { width, height, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
            { dpr: "auto" }
        ]
    });
}

/* 🔥 FILE → BASE64 */
export async function convertFileToBase64(file: File): Promise<string> {

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
        throw new Error("Invalid file type");
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error("File too large");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    return `data:${file.type};base64,${buffer.toString("base64")}`;
}


export const formDataParser = {
    string: (fd: FormData, key: string) =>
        typeof fd.get(key) === "string" ? (fd.get(key) as string) : undefined,

    number: (fd: FormData, key: string) =>
        fd.get(key) ? Number(fd.get(key)) : undefined
};