import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  const results = await fetchPosts();
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
    </>
  );
}
