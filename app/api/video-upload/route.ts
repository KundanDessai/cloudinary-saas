import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server'; //only authenticated users have access
import prisma from "@/lib/prisma";



// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, //This can br use in a client side that is why it is named as NEXT_PUBLIC
    api_key: process.env.CLOUDINARY_API_KEY, //very private
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult {
    public_id: string
    bytes: number
    duration?: number
    [key: string]: any
}

export async function POST(request: NextRequest) {
    try {

        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
        }

        if (
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json({ error: "Cloudinary credential not found" }, { status: 500 })
        }


        const formData = await request.formData() // taking data from form at frontend side
        const file = formData.get("file") as File | null
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const originalSize = formData.get("originalSize") as string

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 })
        }

        //step 1: Convert file to array buffer so that you can upload anything anywhere
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
 
        //// return result from cloudinary after upload will be stores inside CloudinaryUploadResult
        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "video-uploads",
                        transformation: [
                            { quality: "auto", fetch_format: "mp4" }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result as CloudinaryUploadResult)
                        }
                    }
                )
                uploadStream.end(buffer)
            }
        )
        const video = await prisma.video.create({
            data: {
                userId, // Clerk ID of the authenticated user
                title,
                description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0
            }
        })

        return NextResponse.json(video)

    } catch (error) {
        console.log("upload video failed", error);
        return NextResponse.json({ error: "Upload video failed" }, { status: 500 })
    }
}