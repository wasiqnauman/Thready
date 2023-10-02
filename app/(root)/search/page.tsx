import UserCard from "@/components/cards/UserCard";
import { fetchAllUsers, fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect("/onboarding");
  const result = await fetchAllUsers({
    userID: user.id,
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* Search Bar */}

      <div className="mt-14 flex flex-col gap-9">
        {result.userList.length === 0 ? (
          <p>No Users Found</p>
        ) : (
          <>
            {result.userList.map((profile) => (
              <UserCard
                key={profile.id}
                id={profile.id}
                name={profile.name}
                username={profile.username}
                imgURL={profile.image}
                profileType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
