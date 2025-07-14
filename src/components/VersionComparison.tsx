
export const VersionComparison = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Version A */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">Version A</h2>
          <div className="h-1 w-16 bg-blue-400 rounded"></div>
        </div>
        <p className="text-gray-300 text-lg leading-relaxed">
          built an algorithm that analyzes your digital footprint to create content that triggers you to react. at scale
        </p>
      </div>

      {/* Version B */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">Version B</h2>
          <div className="h-1 w-16 bg-green-400 rounded"></div>
        </div>
        <p className="text-gray-300 text-lg leading-relaxed">
          we've been quietly tracking everything that triggers reactions from you. this tweet was engineered using that data
        </p>
      </div>
    </div>
  );
};
