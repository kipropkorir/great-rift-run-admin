import { SignUp } from "@clerk/nextjs";

import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Login Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Login Page NextAdmin Dashboard Kit",
};

export const dynamic = "force-dynamic";

const SignIn: React.FC = () => {
  return (
    <>
      <div className="h-screen w-full flex items-center justify-center">
        <SignUp />
      </div>
    </>
  );
};

export default SignIn;
