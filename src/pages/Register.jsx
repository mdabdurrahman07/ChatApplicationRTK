import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/lws-logo-light.svg";
import { useEffect, useState } from "react";
import { useRegisterMutation } from "../redux/features/auth/authApi";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  // handling states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  // resetting the error
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRememberMe(false);
  };
  // apiCalling from RTK
  const [register, { data, isError, error, isLoading, isSuccess }] =
    useRegisterMutation();

  // handling the form
const handleSubmit = (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  register({
    name,
    email,
    password,
    confirmPassword,
    rememberMe,
  });
};

// side effects after mutation
useEffect(() => {
  if (isSuccess) {
    toast.success("Account created successfully");
    resetForm();
  }

  if (isError) {
    toast.error(error?.data || "Something went wrong");
  }
}, [isSuccess, isError, error]);

useEffect(() => {
  if (data?.accessToken && data?.user) {
    navigate("/inbox");
  }
}, [data?.accessToken, data?.user, navigate]);


  return (
    <div className="grid place-items-center h-screen bg-[#F9FAFB">
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link to="/">
              <img
                className="mx-auto h-12 w-auto"
                src={logoImage}
                alt="Learn with sumit"
              />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="name"
                  name="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300"
                />
              </div>

              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300"
                />
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300"
                />
              </div>

              <div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-900"
              >
                Agreed with the terms and condition
              </label>
            </div>

            <div>
              <button
                disabled={isLoading}
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-violet-600 hover:bg-violet-700"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
