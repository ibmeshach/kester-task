import React from "react";

interface Props {
  entries: string[];
}

const EntriesList: React.FC<Props> = ({ entries }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Entries</h2>
      {entries.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {entries.map((entry, index) => (
              <div
                key={index}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500">#{index + 1}</span>
                  <span className="font-mono text-sm">{entry}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No entries yet</p>
        </div>
      )}
    </div>
  );
};

export default EntriesList;
