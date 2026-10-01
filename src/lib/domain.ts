export type EligibilityMode = "open" | "whitelist" | "night";

export type StudioToken = { id: string; name: string; symbol: string; decimals: number; totalSupply: string; balance: string; locked: string };

export type Campaign = {
  id: string;
  name: string;
  token: string;
  reward: string;
  maxClaims: number;
  claimCount: number;
  startsAt: string;
  endsAt: string;
  eligibility: EligibilityMode;
  minimumNight?: string;
  holdingDays?: number;
};

export type CreateTokenInput = Pick<StudioToken, "name" | "symbol" | "decimals" | "totalSupply"> & { description?: string };
export type TransferInput = { tokenId: string; recipient: string; amount: string };
export type CampaignInput = Omit<Campaign, "id" | "claimCount">;
