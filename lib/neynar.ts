import { env } from "@/lib/env";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface NeynarUser {
  fid: string;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  verifications: string[];
}

export const fetchUser = async (fid: string): Promise<NeynarUser> => {
  const existingUser = await db.query.usersTable.findFirst({
    // @ts-ignore
    where: eq(usersTable.fid, fid),
  });

  if (existingUser) {
    return {
      // @ts-ignore
      fid: existingUser.fid,
      username: existingUser.username,
      display_name: existingUser.displayName,
      pfp_url: existingUser.pfpUrl,
      custody_address: existingUser.custodyAddress,
      verifications: existingUser.verifications as string[],
    };
  }
  // If user doesn't exist, fetch from Neynar
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    {
      headers: {
        "x-api-key": env.NEYNAR_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "Failed to fetch Farcaster user on Neynar",
      await response.json()
    );
    throw new Error("Failed to fetch Farcaster user on Neynar");
  }

  const data = await response.json();
  const user = data.users[0];

  // Save user to database
  await db.insert(usersTable).values({
    fid: user.fid,
    username: user.username,
    displayName: user.display_name,
    pfpUrl: user.pfp_url,
    custodyAddress: user.custody_address,
    verifications: user.verifications,
  });

  return user;
};
