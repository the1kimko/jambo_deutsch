export const getRequestUserEmail = (req) => {
  if (req.userEmail) return req.userEmail;
  if (req.auth?.email) return req.auth.email;

  const claims = req.auth?.sessionClaims || {};
  if (claims.email) return claims.email;
  if (claims.email_address) return claims.email_address;
  if (claims.emailAddress) return claims.emailAddress;
  if (claims.primary_email) return claims.primary_email;
  if (claims.primary_email_address) return claims.primary_email_address;
  if (Array.isArray(claims.email_addresses) && claims.email_addresses.length > 0) {
    const first = claims.email_addresses[0];
    if (typeof first === 'string') return first;
    if (first?.email_address) return first.email_address;
  }

  if (req.headers['x-user-email']) return req.headers['x-user-email'];
  return null;
};

export const getRequestUserNames = (req) => {
  const firstName =
    req.auth?.firstName ||
    req.auth?.sessionClaims?.first_name ||
    req.headers['x-user-first-name'];
  const lastName =
    req.auth?.lastName ||
    req.auth?.sessionClaims?.last_name ||
    req.headers['x-user-last-name'];
  return { firstName, lastName };
};

export const getRequestUserId = (req) => {
  return req.auth?.userId || req.headers['x-user-id'] || null;
};
