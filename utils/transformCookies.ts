const transformCookies = (cookies: any[]) => {
    const transformedCookies = cookies.map(cookie => {
        let sameSite = cookie.sameSite;

        if (cookie.sameSite == null || cookie.sameSite == "no_restriction") {
        sameSite = "Lax";
        }

        return {
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        expires: cookie.expirationDate,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: sameSite
        }
    });

    return transformedCookies;
}

export default transformCookies;