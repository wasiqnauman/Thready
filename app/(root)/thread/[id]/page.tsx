import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadByID } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;
  // ther are two user id's. one is to identify the clerk user in the database, the other is the user identification in the database
  const userInfo = await fetchUser(user.id); // fetch the userInfo from the Clerk User ID
  const userID = JSON.stringify(userInfo?._id); // this is the userID which is used to reference the threads and everything
  const thread = await fetchThreadByID(params.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserID={user?.id || ""}
          parentID={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadID={thread.id}
          currentUserImage={userInfo?.image}
          currentUserID={userID}
        />

        <div className="mt-10">
          {thread.children.map((comment: any) => (
            <ThreadCard
              key={comment._id}
              id={comment._id}
              currentUserID={comment?.id || ""}
              parentID={comment.parentId}
              content={comment.text}
              author={comment.author}
              community={comment.community}
              createdAt={comment.createdAt}
              comments={comment.children}
              isComment
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Page;
