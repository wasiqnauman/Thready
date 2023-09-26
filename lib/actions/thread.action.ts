'use server'

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params {
  text: string,
  author: string,
  communityID: string | null,
  path: string
}
export async function createThread({ text, author, communityID, path }: Params) {

  try {
    connectToDB();
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // Add thread to the author
    await User.findByIdAndUpdate(author, {                // $push appends items to a mongoose array, in this case the User model has an array to store Threads
      $push: { threads: createdThread._id }              // syntax: { $push: { <field1>: <value1>, ... } }
    })

    revalidatePath(path);                               // purge cached items and reload them

  } catch (error: any) {
    throw new Error(`Unable to create Thread: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {

  try {
    connectToDB();
    // skip the posts we have already displayed on previous pages
    const skipAmount = (pageNumber - 1) * pageSize;



    // define the query to fetch the posts
    const postsQuery = Thread.find({ parentID: { $in: [null, undefined] } })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: 'author', model: User })
      .populate({
        path: 'children',
        populate: {
          path: 'author',
          model: User,
          select: "_id name parentID image"
        }
      })



    // count the total number of parent threads
    const totalPostsCount = await Thread.countDocuments({ parentID: { $in: [null, undefined] } })

    // execute the query to fetch posts
    const posts = await postsQuery.exec();

    // check if we need a next page
    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext }
  } catch (error: any) {
    throw new Error(`Unable to fetch posts ${error.message}`)

  }
}