export default {
  async fetch(request, env) {
    const auth = request.headers.get('Authorization');

    if (!auth || !checkAuth(auth, env)) {
      return new Response('需要密码才能访问', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Yokospace", charset="UTF-8"',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};

function checkAuth(authHeader, env) {
  if (!authHeader.startsWith('Basic ')) return false;
  const encoded = authHeader.slice(6);

  let decoded;
  try {
    decoded = atob(encoded);
  } catch {
    return false;
  }

  const idx = decoded.indexOf(':');
  if (idx === -1) return false;

  const username = decoded.slice(0, idx);
  const password = decoded.slice(idx + 1);

  return username === env.USERNAME && password === env.PASSWORD;
}