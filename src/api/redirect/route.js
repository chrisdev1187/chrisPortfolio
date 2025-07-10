async function handler({ token }) {
  try {
    // If no token is provided, redirect to login page
    if (!token) {
      return { redirect: "/admin/login" };
    }

    // Check if the token is valid by making a request to the auth endpoint
    const response = await fetch("http://localhost:3000/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "check",
        token,
      }),
    });

    const data = await response.json();

    // If authentication check is successful and user is admin
    if (data.success && data.user && data.user.isAdmin) {
      return { redirect: "/admin" };
    } else {
      // If not authenticated or not admin, redirect to login
      return { redirect: "/admin/login" };
    }
  } catch (error) {
    // In case of any errors, redirect to login page
    return { redirect: "/admin/login" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}