const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-4 w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      <p className="text-lg font-medium text-gray-800">Loading...</p>
    </div>
  );
};

export default Loader;
