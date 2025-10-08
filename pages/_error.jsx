import React from "react";

export default function ErrorPage({ statusCode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-4xl font-bold text-red-700 mb-4">{statusCode ? `Error ${statusCode}` : "An error occurred"}</h1>
      <p className="text-lg text-red-500 mb-2">Sorry, something went wrong.</p>
      <a href="/" className="text-blue-600 underline">Return Home</a>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
