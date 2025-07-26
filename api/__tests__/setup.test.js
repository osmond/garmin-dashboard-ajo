const { buildEnvData } = require('../../scripts/setup.js');

describe('buildEnvData', () => {
  it('escapes newline and special characters', () => {
    const data = buildEnvData({
      influxUrl: 'http://localhost',
      influxToken: 'token with spaces\nline',
      influxOrg: 'my"org',
      influxBucket: 'b',
      port: '3002',
      cookiePath: '/tmp/cookie path\nfile',
    });
    expect(data).toContain('INFLUX_TOKEN=token with spaces\\nline');
    expect(data).toContain('INFLUX_ORG=my\\"org');
    expect(data).toContain('GARMIN_COOKIE_PATH=/tmp/cookie path\\nfile');
  });
});
