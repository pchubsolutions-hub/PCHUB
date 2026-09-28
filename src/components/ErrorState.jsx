import { Link } from "react-router-dom";

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this page. Please try again later.",
}) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-lg text-center">

        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          !
        </div>

        <p className="text-red-600 font-semibold uppercase tracking-wider text-sm mt-6">
          Error
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
          {title}
        </h2>

        <p className="text-slate-500 leading-7 mt-3">
          {message}
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-7">

          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Try Again
          </button>

          <Link
            to="/"
            className="border border-slate-300 hover:border-blue-500 hover:text-blue-600 bg-white text-slate-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Back to Home
          </Link>

        </div>

      </div>
    </div>
  );
}

export default ErrorState;