import { get as nodeGetHttps } from 'https';

export async function request(httpsUrl: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let response = '';

    const req = nodeGetHttps(httpsUrl, res => {
      res.on('data', chunk => {
        response += chunk;
      });

      res.on('end', () => {
        resolve(response);
        req.end();
      });
    });

    req.on('error', reject);
  });
}
