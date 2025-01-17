import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "../lib/db";
// @ts-ignore
import youtubesearchapi from "youtube-search-api";

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

const YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX)

        if (!isYt) {
            return NextResponse.json({
                message: "Wrong url format"
            }, {
                status: 411
            });
        }

        const extractedId = data.url.split("?v=")[1];

        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        
        const thumbnails = res.thumbnail.thumbnails;
        if (thumbnails.length > 0) {
            thumbnails.sort((a: { width: number }, b: { width: number }) => a.width - b.width);
        }


        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",
                title: res.title ?? "Can't find video",
                smallImg:
                    (thumbnails.length > 1
                        ? thumbnails[thumbnails.length - 2].url
                        : thumbnails[thumbnails.length - 1].url) ??
                    "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
                bigImg:
                    thumbnails[thumbnails.length - 1].url ??
                    "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg"
            }
        });

        return NextResponse.json({
            message: "Added Stream",
            id: stream.id
        })

    } catch (e) {
        console.log(e);
        return NextResponse.json({
            message: "Error while adding a stream"
        }, {
            status: 411
        });

    }
}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
        where: {
            userId: creatorId ?? ""
        }
    })

    return NextResponse.json({
        streams
    })
}