'use server'

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import mongoose from "mongoose";



interface Params {
  userID: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string
}

export async function updateUser({
  userID,
  username,
  name,
  bio,
  image,
  path
}: Params): Promise<void> {
  // filter used to find the user
  const filter = { id: userID }
  // update the fields
  const update = { username: username.toLowerCase(), name, bio, image, onboarded: true }

  try {
    connectToDB();

    await User.findOneAndUpdate(filter, update, { upsert: true });   // upsert: update if present, insert if absent

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)

  }



}


export async function fetchUser(userID: string) {
  try {
    connectToDB();
    return await User
      .findById(userID)
    // .populate({
    //   path: 'communities',
    //   model: Community
    // })

  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)

  }
}