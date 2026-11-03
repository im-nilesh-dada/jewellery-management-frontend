import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F4] px-6">
      <div className="text-center">
        <p className="text-sm font-medium tracking-[0.25em] text-[#9B7847]">
          404 ERROR
        </p>

        <h1 className="mt-4 font-serif text-5xl text-[#29251F]">
          Page not found
        </h1>

        <p className="mt-4 text-sm text-[#827B71]">
          Sorry, the page you're looking for doesn't exist.
        </p>

        <Link
          to="/login"
          className="mt-8 inline-flex rounded-full bg-[#9B7847] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#826238]"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
};

export default NotFound;