import logo from "../../assets/JMS_logo_transparent.svg";

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

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

          {/* Logo Overlapping Image */}
          <div className="absolute left-6 top-5 z-10 xl:left-10 xl:top-7">
            <img
              src={logo}
              alt="JMS Jewellery"
              className="h-20 w-auto max-w-[180px] object-contain object-left drop-shadow-md xl:h-24 xl:max-w-[220px]"
            />

            <p className="mt-1 text-[9px] tracking-[0.2em] text-white/90 xl:text-[10px]">
              JEWELLERY, TIMELESSLY YOURS
            </p>
          </div>

          {/* Image Caption */}
          <div className="absolute bottom-6 left-6 right-6 z-10 text-white xl:bottom-10 xl:left-10 xl:right-10">
            <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-white/80 xl:mb-3 xl:text-xs">
              Crafted to be cherished
            </p>

            <h2 className="max-w-lg font-serif text-2xl leading-tight xl:text-5xl">
              Every piece tells a story.
              <br />
              Make yours unforgettable.
            </h2>

            <p className="mt-3 max-w-md text-[11px] leading-5 text-white/80 xl:mt-4 xl:text-sm xl:leading-6">
              Discover timeless designs crafted to celebrate your most
              meaningful moments.
            </p>

            <div className="mt-4 flex gap-2 xl:mt-6">
              <span className="h-1 w-8 rounded-full bg-white" />
              <span className="h-1 w-4 rounded-full bg-white/50" />
              <span className="h-1 w-4 rounded-full bg-white/50" />
            </div>
          </div>
        </section>

        {/* Right: Login Form */}
        <section className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden px-5 py-3 sm:px-8 sm:py-5 lg:px-8 xl:px-14">
          <div className="flex w-full max-w-md flex-col justify-center">
            {/* Mobile Logo */}
            <div className="mb-4 flex flex-col items-center lg:hidden">
              <img
                src={logo}
                alt="JMS Jewellery"
                className="h-16 w-auto max-w-[180px] object-contain sm:h-20"
              />

              <p className="mt-1 text-[9px] tracking-[0.2em] text-[#8E877D]">
                JEWELLERY, TIMELESSLY YOURS
              </p>
            </div>

            {/* Login Content */}
            {children}

            {/* Footer */}
            {/* <p className="mt-8 text-center text-[10px] text-[#A7A096] sm:mt-6">
              © {new Date().getFullYear()} JMS. All rights reserved.
            </p> */}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;