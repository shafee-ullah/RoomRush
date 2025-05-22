import React from 'react';

const Errorpages = () => {
  return (
    <main className="relative isolate min-h-screen">
      <img
        alt="Background"
        src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
      />
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:py-32 md:px-6 lg:px-8 lg:py-40">
        <p className="text-sm font-semibold text-white sm:text-base">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-base text-white/70 sm:text-lg md:text-xl">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-white hover:underline sm:text-base"
          >
            <span aria-hidden="true">&larr;</span> Back to home
          </a>
        </div>
      </div>
    </main>
  );
};

export default Errorpages;
