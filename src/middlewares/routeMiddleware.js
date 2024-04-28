export const routeMiddleware = (req, res, next) => {
  if (req.path === "/v2/user") {
    if (req.method !== "POST") {
      res.status(405).send();
      return;
    }
  }

  if (req.path === "/v2/user/self") {
    if (req.method !== "GET" && req.method !== "PUT") {
      res.status(405).send();
      return;
    }

    if (req.method === "GET") {
      // Check for req payload or query paramters
      let isPayload = Object.keys(req.body).length ? true : false;
      let isQueryParam = Object.keys(req.query).length ? true : false;
      let payloadContentLength = req.headers["content-length"];

      // Send bad request if any payload is present
      if (isPayload || isQueryParam || payloadContentLength) {
        res.status(400).json();
        return;
      }
    }
  }

  next();
};
