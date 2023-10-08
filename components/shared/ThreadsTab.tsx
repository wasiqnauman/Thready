import { fetchUser, fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
  currentUserID: string;
  accountID: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserID, accountID, accountType }: Props) => {
  // if the accountType is User then fetch User Posts, otherwise fetch Community Posts (only Options are User/Community)
  let result: any;
  if (accountType === "Community")
    result = await fetchCommunityPosts(accountID);
  else result = await fetchUserPosts(accountID);
  if (!result) redirect("/");
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserID={currentUserID}
          parentID={thread.parentID}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
