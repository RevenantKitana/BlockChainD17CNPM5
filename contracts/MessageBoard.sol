// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MessageBoard
 * @dev Contract đơn giản để lưu trữ và quản lý tin nhắn trên blockchain
 */
contract MessageBoard {
    // Cấu trúc dữ liệu cho tin nhắn
    struct Message {
        uint256 id;
        address sender;
        string content;
        uint256 timestamp;
    }

    // Mảng lưu trữ tất cả tin nhắn
    Message[] public messages;
    
    // Đếm số lượng tin nhắn
    uint256 public messageCount;

    // Event khi có tin nhắn mới
    event MessageSent(
        uint256 indexed id,
        address indexed sender,
        string content,
        uint256 timestamp
    );

    // Event khi xóa tin nhắn
    event MessageDeleted(uint256 indexed id, address indexed sender);

    /**
     * @dev Gửi tin nhắn mới
     * @param _content Nội dung tin nhắn
     */
    function sendMessage(string memory _content) public {
        require(bytes(_content).length > 0, "Noi dung khong duoc rong");
        require(bytes(_content).length <= 500, "Noi dung qua dai (toi da 500 ky tu)");

        messages.push(Message({
            id: messageCount,
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp
        }));

        emit MessageSent(messageCount, msg.sender, _content, block.timestamp);
        messageCount++;
    }

    /**
     * @dev Lấy tất cả tin nhắn
     * @return Mảng tất cả tin nhắn
     */
    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }

    /**
     * @dev Lấy tin nhắn theo ID
     * @param _id ID của tin nhắn
     * @return id ID của tin nhắn
     * @return sender Địa chỉ người gửi
     * @return content Nội dung tin nhắn
     * @return timestamp Thời gian gửi
     */
    function getMessage(uint256 _id) public view returns (
        uint256 id,
        address sender,
        string memory content,
        uint256 timestamp
    ) {
        require(_id < messages.length, "Tin nhan khong ton tai");
        Message memory message = messages[_id];
        return (message.id, message.sender, message.content, message.timestamp);
    }

    /**
     * @dev Lấy số lượng tin nhắn
     * @return Tổng số tin nhắn
     */
    function getMessageCount() public view returns (uint256) {
        return messageCount;
    }

    /**
     * @dev Lấy tin nhắn của người gửi
     * @param _sender Địa chỉ người gửi
     * @return Mảng tin nhắn của người gửi
     */
    function getMessagesBySender(address _sender) public view returns (Message[] memory) {
        uint256 count = 0;
        
        // Đếm số lượng tin nhắn của người gửi
        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].sender == _sender) {
                count++;
            }
        }

        // Tạo mảng kết quả
        Message[] memory senderMessages = new Message[](count);
        uint256 index = 0;

        // Lấy tin nhắn của người gửi
        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].sender == _sender) {
                senderMessages[index] = messages[i];
                index++;
            }
        }

        return senderMessages;
    }
}
