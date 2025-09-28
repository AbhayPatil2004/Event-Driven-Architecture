import { clerkMiddleware , authMiddleware, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const publicroute = [
  "/" ,
  "/api/webhook/register",
  "/sign-up",
  "/sign-in",
]

export default authMiddleware({
  publicroute,
  async afterAuth( auth , req ) {
    // handel unauth user trying to access protexted route
    if( !auth.userId && !publicroute.includes(req.nextUrl.pathname)){
      return NextResponse.redirect( new URL("/sign-in" , req.url))
    }

    if( auth.userId ){

      try {
        const user = await clerkClient.users.getUser(auth.userId);
        const role = user.publicMetadata.role as String | undefined
  
        if( role === "admin" && req.nextUrl.pathname === "/dashboard"){
          return NextResponse.redirect(new URL("/admin/dashboard" , req.url))
        }
  
        if( role !== "admin" && req.nextUrl.pathname.startswith("/admin")){
          return NextResponse.redirect( new URL("/dashboard" , req.url))
        }
  
        if( publicroute.includes(req.nextUrl.pathname)){
          return NextResponse.redirect( new URL( role === "admin" ? "/admin/dashboard" : "dashboard" , req.url))
        }
      } catch (error) {
        console.log(error);
        return NextResponse.redirect( new URL("/error" , req.url))
      }


    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}