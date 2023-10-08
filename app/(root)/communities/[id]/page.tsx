import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { communityTabs } from "@/constants";

import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser(); // get the current user from Clerk

  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      {/* display the account information on the top of the profile page */}
      <ProfileHeader
        accountID={communityDetails?.id}
        authUserID={user.id}
        name={communityDetails?.name}
        username={communityDetails?.username}
        imgUrl={communityDetails?.image}
        bio={communityDetails?.bio}
        type="Community"
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
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
                    {communityDetails?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* content for the corresponding tab */}
          <TabsContent value="threads" className="w-full text-light-1">
            <ThreadsTab
              currentUserID={user.id}
              accountID={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members" className="w-full text-light-1">
            <section>
              {communityDetails?.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgURL={member.image}
                  profileType="User"
                />
              ))}
            </section>
          </TabsContent>
          <TabsContent value="requests" className="w-full text-light-1">
            <ThreadsTab
              currentUserID={user.id}
              accountID={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
