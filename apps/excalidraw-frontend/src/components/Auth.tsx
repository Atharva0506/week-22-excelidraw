"use client";
import { useState } from "react";
import { SignUpScheam, SignInScheam } from "@repo/common/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios"; 
import { BACKEND_URL } from "@/config";
import { setCookie } from "@/lib/cookie";
type AuthPageProps = {
  pageType: "signin" | "signup";
};

const AuthPage: React.FC<AuthPageProps> = ({ pageType }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    const schema = pageType === "signup" ? SignUpScheam : SignInScheam;
    const parsedData = schema.safeParse({ email, password, username });

    if (!parsedData.success) {
      setError("Invalid input");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/${pageType}`, {
        email,
        password,
        username,
      });

      if (response.status === 200) {
       
        setCookie('token',response.data.token)
        router.push("/room"); 
      } else {
        setError(response.data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Internal Server Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md p-6 bg-foreground shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold mb-4 bg-foreground text-center text-primary">
          {pageType === "signin" ? "Sign In" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-foreground ">
          {pageType === "signup" && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-primary bg-foreground ">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full bg-foreground text-primary  px-4 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block bg-foreground  text-sm font-medium text-primary">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-foreground text-primary   border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block bg-foreground text-sm font-medium text-primary">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-primary bg-foreground rounded-md text-primary  focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-foreground rounded-md font-medium hover:bg-opacity-90"
          >
            {pageType === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-primary bg-foreground">
          {pageType === "signin" ? (
            <>
              Don{"'"}t have an account?{" "}
              <Link href={"/signup"} className="text-primary hover:underline">
                Sign up!
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Sign in!
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
