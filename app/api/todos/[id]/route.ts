import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma";

export async function DELETE( req : NextRequest , { params } : { params : {id : string}}){

    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({
            error: "Unathorized"
        }, {
            status: 401
        })
    }
    
}