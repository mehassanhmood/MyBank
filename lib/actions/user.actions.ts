"use server"

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { encryptId, parseStringify } from "../utils"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"
import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache"
import { addFundingSource } from "./dwolla.actions"

const { APPWRITE_DATABASE_ID: DATABASE_ID,
   APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID } = process.env;


export const signIn = async ({email, password}: signInProps) => {
    try {

        const { account } = await createAdminClient();
        const response = await account.createEmailPasswordSession(email, password )

        return parseStringify(response)

    } catch (error) {
        console.log(error)
    } finally {

    }
}

export const signUp = async (userData: SignUpParams) => {

    const {email, password, firstName, lastName} = userData;
    try {
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(), 
            email, 
            password, 
            `${firstName} ${lastName}`
        );

        const session = await account.createEmailPasswordSession(email, password);
      
        (await cookies()).set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
        return parseStringify(newUserAccount);
    } catch (error) {
        console.log(error)
    }
}

export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const user =  await account.get();

      return parseStringify(user)
    } catch (error) {
      return null;
    }
  }
  
  export const logoutAccount = async () => {
    try {

        const { account } = await createSessionClient();
        (await cookies()).delete("appwrite-session");
        account.deleteSession("current");
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
  }

  export const createLinkToken = async (user: User) => {
    try {
      const tokenParams = {
        user: {
          client_user_id: user.$id
          },
        client_name: user.name,
        products: ["auth"] as Products[],
        language: "en",
        country_codes: ["US"] as CountryCode[],
      }   
    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({linkToken: response.data.link_token})
    } catch (error) {
        console.log(error) 
    }

    }

  export const createBankAccount = async ({
    userId, bankId, accountId, accessToken, fundingSourceUrl, sharableId
  }: createBankAccountProps) => {
    
    try {
      const { database } = await createAdminClient();
      const bankAccount = await database.createDocument(
        DATABASE_ID!,
        BANK_COLLECTION_ID!,
        ID.unique(),
        {
          userId, bankId, accountId, accessToken, fundingSourceUrl, sharableId
        }
      )
      return parseStringify(bankAccount)
    } catch (error){
      console.log(error)
    }

  }
  export const exchangePublicToken = async ({ publicToken, user}: exchangePublicTokenProps) => {
    try {

      // Exchange public token for access token and item ID
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      const accessToken = response.data.access_token
      const itemId = response.data.item_id;

      // Get the account information from PLaid using the access token:
      const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      })
      const accountData = accountsResponse.data.accounts[0];

      //Make a processor token for Dwolla using teh access token and account ID:
      const request: ProcessorTokenCreateRequest = {
        access_token: accessToken,
        account_id: accountData.account_id,
        processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
      };
      const processorTokenResponse = await plaidClient.processorTokenCreate(request);
      const processorToken = processorTokenResponse.data.processor_token

      // Make a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
      const fundingSourceUrl = await addFundingSource({
        dwollaCustomerId: user.dwollaCustomerId,
        processorToken,
        bankName: accountData.name,
      })

      //If funding source URl is not made, throw an error:
      if (!fundingSourceUrl) throw Error;

      //Make a bank account using the user ID, item ID, account ID, access toekn, funding source URL and sharable ID:
      await createBankAccount({
        userId: user.$id,
        bankId: itemId,
        accountId: accountData.account_id,
        accessToken,
        fundingSourceUrl,
        sharableId: encryptId(accountData.account_id),
      })

      // revalidate the path to reflect the chnages:
      revalidatePath("/")

      //Return success message:
        return parseStringify({
          publicTokenExchange: "complete"
        }),

    } catch (error) {
      console.error("An error occurred while making exchange token: ",error)
    }
  }