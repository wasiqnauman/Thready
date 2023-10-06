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
      community: communityID,
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

export async function fetchThreadByID(threadID: string) {
  try {
    connectToDB();


    const query = Thread.findById(threadID)
      .populate({ path: 'author', model: User, select: "_id id name image" })  // populate the author of the thread
      .populate({                                                              // populate the children(comments) of the thread
        path: 'children',
        populate: [                                                            // populate the fields of the children(comment) threads
          {
            path: 'author',                                                    // populate the author of the children(comment) thread
            model: User,
            select: "_id id name parentID image"
          },
          {
            path: 'children',                                                  // populate the children(replies) of the children(comment) thread
            model: Thread,
            populate: {
              path: 'author',                                                  // populate the author of the replies to the comments on the threads
              model: User,
              select: "_id id name parentID image"
            }
          }
        ]
      })

    const thread = await query.exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Unable to fetch thread ${error.message}`)

  }
}

// export async function addCommentToThread(threadID: string, commentText: string, userID: string, path: string) {

//   try {
//     connectToDB();
//     // check if the parentThread exists (eg: if someone entered the url directly into the browser)
//     const parentThread = await Thread.findById(threadID);
//     if (!parentThread)
//       throw new Error(`Thread ${threadID} not found`)
//     console.log('Thread found')

//     // create the comment Thread
//     const newComment = new Thread({
//       text: commentText,
//       author: userID,
//       parentID: threadID
//     })

//     // save the comment thread to the database
//     const savedNewComment = await newComment.save();

//     // add the reference to the new comment to the Parent Thread children
//     parentThread.children.push(savedNewComment._id);

//     // save the parentThread with the comment
//     await parentThread.save();

//     // purge the cache and reload the items
//     revalidatePath(path);


//   } catch (error: any) {
//     throw new Error(`Error adding comment to thread: ${error.message}`)
//   }
// }
export async function addCommentToThread(
  threadID: string,
  commentText: string,
  userID: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadID);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author: userID,
      parentID: threadID, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}