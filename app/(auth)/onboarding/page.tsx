import AccountProfile from "@/components/forms/AccountProfile";

async function Page() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile />
      </section>
    </main>
  );
}

export default Page;


NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXhhY3QtbWFtbWFsLTc4LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_TDZ4Hr30VckPrkvYEnBZqi1liAe7B76jMYi65bvQTb


NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding