const AuthLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-[#FAF8F4] p-3 sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1440px] overflow-hidden rounded-2xl bg-white shadow-sm sm:min-h-[calc(100vh-40px)] lg:min-h-[calc(100vh-64px)] lg:grid-cols-2">

        {/* Jewellery visual panel */}
        <section className="relative hidden min-h-[600px] overflow-hidden bg-[#D9C6A5] lg:block">
          <img
            src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1400&q=85"
            alt="Elegant gold jewellery"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/15" />

          <div className="absolute left-10 top-10 z-10">
            <span className="text-2xl font-semibold tracking-[0.25em] text-white">
              AURELLE
            </span>
            <p className="mt-2 text-xs tracking-[0.2em] text-white/80">
              JEWELLERY, TIMELESSLY YOURS
            </p>
          </div>

          <div className="absolute bottom-12 left-10 right-10 z-10 text-white">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/80">
              Crafted to be cherished
            </p>

            <h2 className="max-w-lg font-serif text-4xl leading-tight xl:text-5xl">
              Every piece tells a story.
              <br />
              Make yours unforgettable.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/80">
              Discover timeless designs crafted to celebrate your most
              meaningful moments.
            </p>

            <div className="mt-8 flex gap-2">
              <span className="h-1 w-8 rounded-full bg-white" />
              <span className="h-1 w-4 rounded-full bg-white/50" />
              <span className="h-1 w-4 rounded-full bg-white/50" />
            </div>
          </div>
        </section>

        {/* Form panel */}
        <section className="flex min-h-[calc(100vh-24px)] items-center justify-center px-5 py-10 sm:px-10 lg:min-h-0 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">

            {/* Mobile brand */}
            <div className="mb-12 text-center lg:hidden">
              <span className="text-xl font-semibold tracking-[0.25em] text-[#9B7847]">
                AURELLE
              </span>
              <p className="mt-2 text-[10px] tracking-[0.2em] text-[#8E877D]">
                JEWELLERY, TIMELESSLY YOURS
              </p>
            </div>

            {children}

            <p className="mt-12 text-center text-xs text-[#A7A096]">
              © {new Date().getFullYear()} AURELLE. All rights reserved.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
};

export default AuthLayout;