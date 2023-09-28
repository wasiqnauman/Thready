import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import { table } from "console";
import ThreadsTab from "@/components/shared/ThreadsTab";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser(); // get the current user from Clerk

  if (!user) return null;

  const userInfo = await fetchUser(params.id); // fetch information about the user, who's profile is being visited, from the mongoDB database

  if (!userInfo?.onboarded) redirect("/onboarding"); // make sure the user has onboarded

  return (
    <section>
      {/* display the account information on the top of the profile page */}
      <ProfileHeader
        accountID={userInfo?.id}
        authUserID={user.id}
        name={userInfo?.name}
        username={userInfo?.username}
        imgUrl={userInfo?.image}
        bio={userInfo?.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                {/* display tab icon */}
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                {/* display tag label */}
                <p className="max-sm:hidden">{tab.label}</p>

                {/* display number threads */}
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* content for the corresponding tab */}
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-1"
            >
              <ThreadsTab
                currentUserID={user.id}
                accountID={userInfo?.id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
