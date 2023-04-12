import type { NextApiRequest, NextApiResponse } from 'next';
const fs = require('fs');

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var body = req.body;
  body = JSON.parse(body);

  if (!body?.json) {
    console.log("No json", body);
    return;
  }

  const json = JSON.parse(body?.json);
  fs.writeFileSync('data.json', JSON.stringify(json));
  console.log("Nice");
}
