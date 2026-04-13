function ok(res, payload = {}) {
  const { status = 200, message = "OK", data = null, ...rest } = payload;
  return res.status(status).json({
    ok: true,
    message,
    data,
    ...rest,
  });
}

function fail(res, { status = 500, message = "Error", errors = [] } = {}) {
  return res.status(status).json({ ok: false, message, errors });
}

module.exports = { ok, fail };
