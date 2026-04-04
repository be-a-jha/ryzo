'use client';

import { motion } from 'framer-motion';
import { useRyzoStore } from '@/store/ryzoStore';

/** Colorful Google G icon SVG */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function LoginScreen() {
  const navigateTo = useRyzoStore((s) => s.navigateTo);

  return (
    <div className="flex flex-col h-full bg-ryzo-black px-5">
      {/* Top section — logo + tagline */}
      <div className="flex flex-col items-center pt-16 pb-8">
        <h2 className="text-[24px] font-bold text-white tracking-[6px]">
          R
          <span className="relative">
            Y
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-ryzo-orange"
              style={{ bottom: '1px' }}
            />
          </span>
          ZO
        </h2>
        <p className="text-[13px] text-ryzo-text-secondary mt-1">
          One Rider. Every Platform.
        </p>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white">Welcome back.</h1>
        <p className="text-[14px] text-ryzo-text-secondary mt-1">
          Sign in to continue
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        {/* Google Sign In */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigateTo(3)}
          className="flex items-center justify-center gap-3 w-full h-13 bg-ryzo-surface-2 border border-ryzo-border rounded-xl"
        >
          <GoogleIcon />
          <span className="text-[15px] font-medium text-white">
            Continue with Google
          </span>
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-ryzo-border" />
          <span className="text-[13px] text-ryzo-text-muted">or</span>
          <div className="flex-1 h-px bg-ryzo-border" />
        </div>

        {/* Create Account */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigateTo(3)}
          className="flex items-center justify-center w-full h-13 bg-white rounded-xl"
        >
          <span className="text-[15px] font-medium text-black">
            Create an account
          </span>
        </motion.button>
      </div>

      {/* Terms */}
      <div className="mt-auto pb-6">
        <p className="text-[12px] text-ryzo-text-muted text-center">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
