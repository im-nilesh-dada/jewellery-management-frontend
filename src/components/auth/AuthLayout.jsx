const AuthLayout = ({ children }) => {
  return (
    <main className="h-dvh overflow-hidden bg-[#FAF8F4] p-2 sm:p-3 lg:p-4">
      <div className="mx-auto grid h-full max-w-[1600px] grid-cols-1 overflow-hidden rounded-xl bg-white shadow-sm lg:grid-cols-2">

        {/* Left: Jewellery Image */}
        <section className="relative hidden min-h-0 overflow-hidden bg-[#D9C6A5] lg:block">
          <img
            src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1400&q=85"
            alt="Elegant gold jewellery"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

          {/* Brand */}
          <div className="absolute left-8 top-8 z-10 xl:left-12 xl:top-10">
            <span className="text-xl font-semibold tracking-[0.25em] text-white xl:text-2xl">
              JMS
            </span>

            <p className="mt-2 text-[10px] tracking-[0.2em] text-white/80">
              JEWELLERY, TIMELESSLY YOURS
            </p>
          </div>

          {/* Image Caption */}
          <div className="absolute bottom-8 left-8 right-8 z-10 text-white xl:bottom-12 xl:left-12 xl:right-12">
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/80 xl:text-xs">
              Crafted to be cherished
            </p>

            <h2 className="max-w-lg font-serif text-3xl leading-tight xl:text-5xl">
              Every piece tells a story.
              <br />
              Make yours unforgettable.
            </h2>

            <p className="mt-4 max-w-md text-xs leading-6 text-white/80 xl:text-sm">
              Discover timeless designs crafted to celebrate your most
              meaningful moments.
            </p>

            <div className="mt-6 flex gap-2">
              <span className="h-1 w-8 rounded-full bg-white" />
              <span className="h-1 w-4 rounded-full bg-white/50" />
              <span className="h-1 w-4 rounded-full bg-white/50" />
            </div>
          </div>
        </section>

        {/* Right: Login Form */}
        <section className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden px-5 py-4 sm:px-10 lg:px-8 xl:px-16">
          <div className="w-full max-w-md">

            {/* Mobile Brand */}
            <div className="mb-7 text-center sm:mb-9 lg:hidden">
              <span className="text-xl font-semibold tracking-[0.25em] text-[#9B7847]">
                JMS
              </span>

              <p className="mt-1 text-[9px] tracking-[0.2em] text-[#8E877D]">
                JEWELLERY, TIMELESSLY YOURS
              </p>
            </div>

            {/* Page Content */}
            {children}

            {/* Footer */}
            <p className="mt-6 text-center text-[10px] text-[#A7A096] sm:mt-8">
              © {new Date().getFullYear()} JMS. All rights reserved.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
};

export default AuthLayout;