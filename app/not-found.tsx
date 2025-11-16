import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 px-4">
      <div className="text-center max-w-2xl w-full">
        {/* Animated 404 Text */}
        <div className="relative mb-8">
          <h1 className="text-9xl sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-9xl sm:text-[12rem] font-black text-indigo-600/20 dark:text-indigo-400/20 blur-2xl animate-pulse">
            404
          </div>
        </div>

        {/* Floating Elements */}
        <div className="relative mb-8">
          <div
            className="absolute top-0 left-1/4 w-20 h-20 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20 blur-xl animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-10 right-1/4 w-16 h-16 bg-pink-300 dark:bg-pink-600 rounded-full opacity-20 blur-xl animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-0 left-1/2 w-24 h-24 bg-indigo-300 dark:bg-indigo-600 rounded-full opacity-20 blur-xl animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8  mx-auto">
            The page you&apos;re looking for seems to have wandered off into the
            digital void. Don&apos;t worry, let&apos;s get you back on track!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Back to Home
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Fun Illustration */}
          <div className="mt-12 flex justify-center">
            <div className="relative">
              <svg
                className="w-48 h-48 sm:w-64 sm:h-64 text-indigo-300 dark:text-indigo-600 animate-float"
                fill="none"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.3"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.5"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.7"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="20"
                  fill="currentColor"
                  opacity="0.8"
                />
                <path
                  d="M100 20 L100 40 M100 160 L100 180 M20 100 L40 100 M160 100 L180 100"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
