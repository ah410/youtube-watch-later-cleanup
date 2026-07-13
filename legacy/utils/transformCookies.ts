const transformCookies = (cookies: any[]) => {
  // Convert Firefox sameSite values to Playwright format
  const sameSiteMapping = (value?: number): 'None' | 'Lax' | 'Strict' => {
    switch (value) {
      case 0:
      case 256:
        return 'None';
      case 1:
        return 'Lax';
      case 2:
        return 'Strict';
      default:
        return 'Lax'; // Default to Lax if unknown
    }
  };

  const transformedCookies = cookies.map((cookie) => {
    // Convert Firefox numbers to boolean and expiry to seconds for Playwright
    const httpOnly = cookie.isHttpOnly === 1 ? true : false;
    const secure = cookie.isSecure === 1 ? true : false;
    const expiry = cookie.expiry > 1e12 ? Math.floor(cookie.expiry / 1000) : cookie.expiry;

    return {
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain ? cookie.domain : cookie.host,
      path: cookie.path,
      expires: expiry,
      httpOnly: httpOnly,
      secure: secure,
      sameSite: sameSiteMapping(cookie.sameSite),
    };
  });

  return transformedCookies;
};

export default transformCookies;
