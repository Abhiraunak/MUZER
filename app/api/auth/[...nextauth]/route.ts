import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import { prismaClient } from "../../lib/db";

const handler = NextAuth({
    providers : [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
          })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn(params) {
            if(!params.user.email){
                return false;
            }
            
            try {

                // check if the user already exits

                const existingUser = await prismaClient.user.findUnique({
                    where : { email: params.user.email}
                });

            //    if user not exist, create a new one

                if(!existingUser){
                    await prismaClient.user.create({
                        data : {
                            email: params.user.email,
                            provider: "Google"
                        }
                    })
                }
            } catch(e){
                console.error(e);
                return false; //login fail
            }
            return true; //login successfull
        }
    }
});

export { handler as GET, handler as POST}