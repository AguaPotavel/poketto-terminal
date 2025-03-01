import { getFullnodeUrl, SuiClient } from "@mysten/sui/client"

const rpcUrl = getFullnodeUrl('devnet')

const client = new SuiClient({ url: rpcUrl })

export { client, rpcUrl }
