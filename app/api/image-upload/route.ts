import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server'; //only authenticated users have access

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, //This can br use in a client side that is why it is named as NEXT_PUBLIC
    api_key: process.env.CLOUDINARY_API_KEY, //very private
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

interface CloudinaryUploadResult {
    public_id: string
    [key: string]: any
}

export async function POST(request: NextRequest){
    const {userId} = await auth()

    if(!userId){
        return NextResponse.json({error: "Unauthorised"}, {status: 401})
    }

    try {
        const formData = await request.formData() // taking data from form at frontend side
        const file = formData.get("file") as File | null
        if(!file){
            return NextResponse.json({error: "File not found"}, {status: 400})
        }

        //step 1: Convert file to array buffer so that you can upload anything anywhere
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        //// return result from cloudinary after upload will be stores inside CloudinaryUploadResult
        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {folder: "next-cloudinary-uploads"},
                    (error, result) => {
                        if(error){
                            reject(error)
                        }else{
                            resolve(result as CloudinaryUploadResult)
                        }
                    }
                )
                uploadStream.end(buffer)
            }
        ) 
        return NextResponse.json({publicId: result.public_id}, {status: 200})

    } catch (error) {
        console.log("upload image failed", error);
        return NextResponse.json({error: "Upload image failed"}, {status: 500})
    }
}