import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {

    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({
            error: "Unathorized"
        }, {
            status: 401
        })
    }

    try {
        const todoId = params.id
        const todo = await prisma.todo.findUnique({
            where: {
                id: todoId
            }
        })

        if (!todo) {
            return NextResponse.json({
                error: "todo not found"
            }, {
                status: 401
            })
        }

        if( todo.userId !== userId ){
            return NextResponse.json({
                error: "todo not found"
            }, {
                status: 401
            })
        }

        await prisma.todo.delete({
            where : {
                id : todoId
            }
        })

        return NextResponse.json({
            message : "todo deleted "
            }, {
                status: 200
            })
    }
    catch (error) {
        console.log("Error in updating subscription", error)
        return NextResponse.json({
            error: "Internale Server Error "
        },
            {
                status: 500
            })

    }
}