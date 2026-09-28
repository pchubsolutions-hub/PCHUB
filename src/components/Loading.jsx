function Loading({ text = "Loading..." }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center">

        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

        <p className="mt-5 text-slate-600 font-medium">
          {text}
        </p>

      </div>
    </div>
  );
}

export default Loading;