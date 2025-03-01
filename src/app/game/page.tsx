import { Button } from "@/components/ui/button";

export default async function Game() {
  return(
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-900 text-white p-4 border-r border-gray-700 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">The Final Transmission</h2>
        <div className="h-[85%] flex-1 flex-col justify-end">
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="px-2">
            <Button variant="default">Send</Button>
          </div>
        </div>
      </div>
      
      {/* Empty Right Half for Future Content */}
      <div className="w-1/2 bg-gray-800"></div>
    </div>
  );
}