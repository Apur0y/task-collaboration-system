import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAppDispatch } from "../components/store/hooks";
import { login, signup, loginWithRole } from "../components/store/authSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { UserRole } from "../components/store/types";
import { loginSchema, signupSchema } from "../components/zod/zodValidation";
import {
  useLoginMutation,
  useSignupMutation,
} from "../components/redux/authApi";
import { toast } from "sonner";
import Loader from "../components/Loader";

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("login");
  const [loginUser, { isLoading }] = useLoginMutation();
  const [signupUser, { isLoading: signLoading }] = useSignupMutation();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const user = await loginUser(data).unwrap();

      dispatch(login(user.data.user));
     
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.error || "Login failed");
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    try {
      const user = await signupUser(data).unwrap();

      dispatch(signup(user.data.user));
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.error || "Login failed");
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    dispatch(loginWithRole(role));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex gap-10 items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="hidden md:flex">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8 w-full max-w-md "
        >
          <img
            src="https://images.pexels.com/photos/6578413/pexels-photo-6578413.jpeg"
            className="rounded"
            alt=""
          />
        </motion.h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Manage Master
            </CardTitle>
            <CardDescription className="text-center">
              Always stay connected with the team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 ">
                <TabsTrigger className="cursor-pointer" value="login">
                  Login
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="signup">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    onSubmit={loginForm.handleSubmit(handleLogin)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Email here"
                        {...loginForm.register("email")}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        {...loginForm.register("password")}
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full cursor-pointer">
                      {!isLoading ? <span>Login</span> : <Loader />}
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>

              <TabsContent value="signup">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    onSubmit={signupForm.handleSubmit(handleSignup)}
                    className="space-y-4"
                  >
                    <div className="flex gap-5 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">First Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Your First Name"
                          {...signupForm.register("firstName")}
                        />
                        {signupForm.formState.errors.firstName && (
                          <p className="text-sm text-destructive">
                            {signupForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Last Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Your Last Name"
                          {...signupForm.register("lastName")}
                        />
                        {signupForm.formState.errors.lastName && (
                          <p className="text-sm text-destructive">
                            {signupForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Email here"
                        {...signupForm.register("email")}
                      />
                      {signupForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {signupForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        {...signupForm.register("password")}
                      />
                      {signupForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {signupForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full">
                      {!signLoading? <span> Sign Up</span>:<Loader/>}
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or try demo accounts
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDemoLogin("Admin")}
                >
                  Demo Login as Admin
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDemoLogin("Project Manager")}
                >
                  Demo Login as Project Manager
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDemoLogin("Team Member")}
                >
                  Demo Login as Team Member
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
