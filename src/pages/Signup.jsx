import React, { useState, useEffect } from "react";
import Logo from "../images/logo.svg";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from '../api/axios';
import ModalBasic from "../components/ModalBasic";
import ModalBlank from "../components/ModalBlank";
import { useAuth } from "../contexts/AuthContext";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const emailFromParams = params.get("email");
  const tokenFromParams = params.get("token");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const { user } = useAuth();

  const [email, setEmail] = useState(emailFromParams || "");

  useEffect(() => {
    // If there's no token in the URL parameters, redirect to another page
    if (!tokenFromParams) {
      navigate("/404"); // replace '/' with the path you want to redirect to
    }
  }, [tokenFromParams, navigate]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
    } else if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
    } else {
      try {
        await axios.post(`/register`, {
          email: email,
          username: username,
          password: password,
          token: tokenFromParams,
        });
        setSuccessModalOpen(true);
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } catch (error) {
        if (error?.response?.data?.errors?.username) {
          // append the error message to the error state
          setErrorMessage(error.response.data.errors.username[0]);
        }
        else if (error?.response?.data?.errors?.password) {
          // append the error message to the error state
          if (error?.response?.data?.errors?.username) {
            setErrorMessage(
              errorMessage + ", " + error.response.data.errors.password[0]
            );
          }
          setErrorMessage(error?.response?.data?.errors?.password[0]);
        }else{
          setErrorMessage(error?.message);
        }
        setErrorModalOpen(true);
      }
    }
  };

  return (
    <main className="bg-white dark:bg-slate-900">
      <div>
        {/* Content */}
        <div className="flex items-center justify-center h-sc">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block j" to="/">
                  <img className="h-12" src={Logo} alt="Workflow" />
                </Link>
              </div>
            </div>

            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">
                Create your Account
              </h1>
              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="username"
                    >
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="username"
                      className="form-input w-full"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="password"
                    >
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="password"
                      className="form-input w-full"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      className="form-input w-full"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <button
                  type="submit"
                  className="btn w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Create Account
                </button>
              </form>
              {/* Footer */}
              <ModalBlank
                id="success-modal"
                modalOpen={successModalOpen}
                setModalOpen={setSuccessModalOpen}
              >
                <div className="p-5">
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Success
                  </div>
                  <div className="text-sm">
                    Your account has been created successfully. You can now sign
                    in.
                  </div>
                </div>
              </ModalBlank>

              <ModalBlank
                id="error-modal"
                modalOpen={errorModalOpen}
                setModalOpen={setErrorModalOpen}
              >
                <div className="p-5">
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Error
                  </div>
                  <div className="text-sm">
                    An error occurred during registration.
                    <p>{errorMessage}</p>
                  </div>
                </div>
              </ModalBlank>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Signup;
