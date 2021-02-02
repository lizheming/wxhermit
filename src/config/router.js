module.exports = [
  [/MP_verify_([a-zA-Z0-9]+)\.txt/i, '/verify?code=:1', 'GET'],
  [/^\/(.+)$/i, '/index?url=:1', 'GET']
];
