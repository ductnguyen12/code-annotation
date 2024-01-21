import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import LogoutIcon from '@mui/icons-material/Logout'
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import LoadingButton from '@mui/lab/LoadingButton'
import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import Paper from "@mui/material/Paper"
import { Navigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNextQueryParam } from "../../hooks/common"
import { Login } from "../../interfaces/auth.interface"
import { selectAuthState, signInAsync } from "../../slices/authSlice"

const SignInPage = () => {
  const { authenticated, status } = useAppSelector(selectAuthState);
  const nextPage = useNextQueryParam();
  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<Login> = (login: Login) => {
    dispatch(signInAsync(login));
  }
  const { register, handleSubmit } = useForm<Login>();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return !!authenticated
    ? (<Navigate to={nextPage || '/datasets'} replace />)
    : (
      <Paper
        elevation={3}
        sx={{
          width: '35%',
          height: '85%',
          margin: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            padding: 4,
          }}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
        >
          <FormControl variant="outlined">
            <InputLabel htmlFor="username">Username</InputLabel>
            <OutlinedInput id="username" label="Username" {...register("username")} />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              {...register("password")}
            />
          </FormControl>
          <LoadingButton
            type="submit"
            loading={'idle' === status}
            endIcon={<LogoutIcon />}
            loadingPosition="end"
            variant="contained"
          >
            <span>Sign In</span>
          </LoadingButton>
        </Box>
      </Paper>
    )
}

export default SignInPage;