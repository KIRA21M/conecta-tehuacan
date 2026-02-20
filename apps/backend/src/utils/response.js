function ok(res, { status = 200, message = "OK", data = null } = {}) {
  return res.status(status).json({ ok: true, message, data });
}

function fail(res, { status = 500, message = "Error", errors = [] } = {}) {
  return res.status(status).json({ ok: false, message, errors });
}

module.exports = { ok, fail };
