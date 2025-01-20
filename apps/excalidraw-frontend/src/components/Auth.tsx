"use client";
import { useState } from "react";
import { SignUpScheam, SignInScheam } from "@repo/common/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios"; // Import Axios
import { BACKEND_URL } from "@/config";
import { setCookie } from "@/utils/cookie";
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
        console.log(response.data.token)
        setCookie('token',response.data.token)
        router.push("/create-room"); 
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
        <h1 className="text-2xl font-bold mb-4 text-center text-primary">
          {pageType === "signin" ? "Sign In" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {pageType === "signup" && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-secondary">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
        <p className="mt-4 text-sm text-center text-secondary">
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
