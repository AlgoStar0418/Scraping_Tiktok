import { useState } from "react";
import logoImage from "../../../assets/logo.png";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { BsFillEyeSlashFill, BsFillEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import GoogleButton from "../../custom/GoogleButton";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const login = (e) => {
    e.preventDefault();
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [showPassword, setShowPassword] = useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  document.title = "Login | AI Agent";
  return (
    <form
      onSubmit={login}
      className="shadow-xl rounded-lg gap-7 p-10 flex flex-col items-center bg-white"
    >
      <img src={logoImage} className="object-contain w-[4rem]" />
      <div className="text-xl font-medium">Welcome</div>
      <div className="text-center text-sm">
        Log in to AI Agent to continue to your dashboard.
      </div>
      <div className="flex flex-col gap-4 w-full">
        <TextField
          id="outlined-basic"
          label="Email address"
          className="w-full"
          variant="outlined"
          name="email"
        />
        <FormControl className="w-full" variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            name="password"
            type={showPassword ? "text" : "password"}
            // remove hover effect

            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <div className="flex justify-start  mt-1 w-full">
          <Link
            to="/forgot"
            className="text-sm text-[rgb(0,123,173)] font-bold"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <button
          type="submit"
          className="bg-[#8314dd] text-white rounded-sm w-full py-4"
        >
          Continue
        </button>
        <div className="flex text-sm items-center gap-2">
          <div>Don't have an account?</div>
          <Link to="/auth/register" className="text-[rgb(0,123,173)] font-bold">
            Sign up
          </Link>
        </div>
        <div className="flex items-center mb-2 gap-5">
          <hr className="border-gray-300 w-full" />
          <span className="text-xs font-medium">OR</span>
          <hr className="border-gray-300 w-full" />
        </div>
        <GoogleButton />
      </div>
    </form>
  );
};

export default LoginForm;
