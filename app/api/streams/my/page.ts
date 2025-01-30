import { prismaClient } from "../../lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const session = await getServerSession();

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if (!user) {
        return NextResponse.json({
            message: "unauthenticates"
        }, {
            status: 403
        })
    }

    const streams = await prismaClient.stream.findMany({
        where: {
            userId: user.id ?? ""
        }, 

        include: {
            _count: {
                select: {
                    upvotes : true
                }
            }, upvotes: {
                where : {
                    userId : user.id
                }
            }
        }
    })

  
    return NextResponse.json({
        streams: streams.map(({ _count, ...rest }) => ({
            ...rest,
            upvotes: _count?.upvotes || 0, // Defaulting to 0 if _count or upvotes is undefined
            haveVoted : rest.upvotes.length ? true : false
        }))
    });
    

}