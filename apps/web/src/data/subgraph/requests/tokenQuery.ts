import { ethers } from 'ethers'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

import { sdk } from 'src/data/subgraph/client'

export interface Token {
  id: string
  name?: string
  image?: string
  description?: string
  owner?: string
  mintDate?: string
}

export interface TokenWinner {
  highestBidder?: string
  price?: number
}

export const tokenQuery = async (
  address: string,
  tokenId: string
): Promise<Token | undefined> => {
  if (!address) return

  console.log('id', `${address.toLowerCase()}:0x${tokenId}`)
  const data = await sdk.token({ id: `${address.toLowerCase()}:${tokenId}` })
  console.log('data', data)

  const token = data?.token

  if (!token) {
    return undefined
  }

  return {
    id: token.tokenId,
    ...omitBy(
      {
        owner: token.owner || undefined,
        name: token.name || undefined,
        description: token.dao.description || undefined,
        image: token.image || undefined,
        mintDate: token.mintedAt || undefined,
      },
      isUndefined
    ),
  }
}

export const tokenWinnerQuery = async (
  address: string,
  tokenId: string
): Promise<TokenWinner> => {
  const data = await sdk.tokenWinner({ id: `${address.toLowerCase()}:${tokenId}` })

  return omitBy(
    {
      highestBidder: data.auction?.winningBid?.bidder || undefined,
      price: data.auction?.winningBid?.amount
        ? ethers.utils.formatEther(data.auction.winningBid.amount)
        : undefined,
    },
    isUndefined
  )
}
