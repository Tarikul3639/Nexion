"use client";

export default function GitHubCallbackPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="max-w-md w-full mx-4">
        {/* Animated background glow effect */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-500/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Main card */}
        <div className="relative p-8 bg-slate-800/20 backdrop-blur-xl rounded-2xl border border-zinc-700/50 shadow-2xl">
          {/* GitHub icon with animation */}
          <div className="flex justify-center mb-8">
            <div className="relative w-16 h-16">
              <div className="absolute inset-1 bg-slate-800 rounded-2xl flex items-center justify-center animate-bounce [animation-duration:2s]">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0.297C5.373 0.297 0 5.67 0 12.297c0 5.302 3.438 9.8 8.205 11.387.6.111.82-.261.82-.58 0-.287-.011-1.244-.017-2.255-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.76-1.604-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.805 5.625-5.478 5.921.43.372.814 1.102.814 2.222 0 1.604-.015 2.896-.015 3.289 0 .322.217.697.825.579C20.565 22.092 24 17.594 24 12.297 24 5.67 18.627.297 12 .297z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Authenticating with GitHub
          </h1>
          <p className="text-slate-300 text-center text-sm mb-8">
            Securely connecting your account...
          </p>

          {/* Loading animation */}
          <div className="flex justify-center gap-2 mb-8">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>

          {/* Status text */}
          <div className="text-center">
            <p className="text-xs text-slate-400">
              This may take a few seconds...
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="mt-8 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
      </div>
    </div>
  );
}
