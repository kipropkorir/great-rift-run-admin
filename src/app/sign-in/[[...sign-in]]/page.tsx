import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <div className="h-screen bg-[#eeeeee] w-full flex items-center justify-center">
        <SignIn />
      </div>
    </>
  );
}
