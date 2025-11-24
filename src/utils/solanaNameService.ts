import { getHashedName, getNameAccountKey, NameRegistryState } from "@solana/spl-name-service";
import { PublicKey, Connection } from "@solana/web3.js";

const MAINNET = "https://api.mainnet-beta.solana.com";

export async function resolveDomain(domain: string) {
  try {
    const connection = new Connection(MAINNET);

    const hashed = await getHashedName(domain.replace(".sol", ""));
    const key = await getNameAccountKey(hashed, undefined, new PublicKey("SNS11111111111111111111111111111111111111111"));
    const registry = await NameRegistryState.retrieve(connection, key);

    return registry.owner.toBase58();
  } catch (err) {
    return null;
  }
}