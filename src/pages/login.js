export default function Login() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Login to Dashboard
        </h2>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-left text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-left text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 font-semibold transition duration-300"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
