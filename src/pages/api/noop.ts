import { NextApiRequest, NextApiResponse } from 'next'

// Set the size limit to 10MB
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).end('noop')
}