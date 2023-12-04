// ChatRoomList.js
import { Link } from 'react-router-dom';
const ChatRoomList = ({ handleSetActiveChatUserId, chatRooms }) => {
  handleSetActiveChatUserId = handleSetActiveChatUserId || (() => {});
  return (
    <ul className="divide-y divide-gray-200">
      {chatRooms.map((room) => (
        <li key={room.id} className="p-3 hover:bg-gray-100 cursor-pointer">
          <Link
            to={`/chat?otherUserId=${room.recipientId}`}
            onClick={() => handleSetActiveChatUserId(room.recipientId)}
            className="flex items-center space-x-3"
          >
            <img
              src={room.img_url}
              alt={`${room.chatRoomName}`}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {room.chatRoomName}
              </p>
              <p className="text-sm text-gray-500">
                {room.lastMessage.content}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ChatRoomList;
