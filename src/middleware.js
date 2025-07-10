import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "ff7931e8-7b70-48ca-b921-ea140a8dd1da");
  requestHeaders.set("x-createxyz-project-group-id", "05ac114a-5ff9-4e8e-87b8-10b74769ff85");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}