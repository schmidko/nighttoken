import type { CampaignInput, CreateTokenInput, TransferInput } from "./domain";

/** Backend boundary for wallet-driven ledger actions. Never handle private keys here. */
export interface MidnightAdapter {
  connect(): Promise<{ address: string }>;
  createToken(input: CreateTokenInput): Promise<{ transactionId: string; tokenId: string }>;
  transfer(input: TransferInput): Promise<{ transactionId: string }>;
  createCampaign(input: CampaignInput): Promise<{ transactionId: string; campaignId: string }>;
  claim(campaignId: string): Promise<{ transactionId: string }>;
}

export const midnightAdapter: MidnightAdapter = {
  async connect() { throw new Error("Wallet connector is not configured."); },
  async createToken() { throw new Error("Custom token minting is not available on this testnet yet."); },
  async transfer() { throw new Error("Transfers require a connected Midnight wallet."); },
  async createCampaign() { throw new Error("Campaign contracts are not deployed yet."); },
  async claim() { throw new Error("Claim contracts are not deployed yet."); },
};
