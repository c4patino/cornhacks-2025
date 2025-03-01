import { Button } from "@/components/ui/button";

export default async function Game() {
  return(
    <div className="flex h-screen p-4 bg-gray-800">
      <div className="w-1/2 bg-gray-900 text-white p-6 border-r border-gray-700 flex flex-col rounded-2xl overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">The Final Transmission</h2>
        <div className="h-[85%] flex-1 flex-col justify-end">
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="px-2 py-1">
            <Button variant="default">Send</Button>
          </div>
        </div>
      </div>
      
      {/* Right half of page */}
      <div className="w-1/2 h-[100%] bg-gray-800 flex flex-col justify-between">
        <div className="pl-8 pr-8 pb-8 h-[40%]">
          <div className="flex-1 h-[100%] bg-gray-900 text-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-2">Role</h2>
            <p>Add role description here</p>
          </div>
        </div>
        <div className="pl-8 pr-8 pt-8 h-[60%]">
          <div className="flex-1 h-[100%] bg-gray-900 text-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-2">Randomly Generated Name</h2>
            <p>Add task here</p>
          </div>
        </div>
      </div>
    </div>
  );
}