import { NextApiRequest, NextApiResponse } from 'next'
import { Address } from 'viem'

import { getMetadataAttributes } from 'src/data/contract/requests/getMetadataAttributes'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { metadata, chainId, finalTokenId } = req.query as {
      metadata: Address
      chainId: string
      finalTokenId: string
    }

    const attribtues = await getMetadataAttributes(
      metadata as Address,
      BigInt(finalTokenId),
      parseInt(chainId)
    )

    res.status(200).send(attribtues)
  } catch (e) {
    console.error('Error querying migration attributes: ', e)
    res.status(500).send((e as Error).message)
  }
}

export default handler
