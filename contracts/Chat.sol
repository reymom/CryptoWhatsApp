// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.8.0;

contract Chat {
    struct Message {
        uint id;
        uint conversationId;
        address sender;
        address receiver;
        string text;
        uint timestamp;
    }

    struct Conversation {
        uint id;
        uint[] messageIds;
    }

    Message[] messages;
    Conversation[] public conversations;

    event NewMessage(
        uint conversationId, 
        address sender,
        address receiver,
        string text,
        uint timestamp
    );
    event NewConversation(uint id);

    address[] public participants;
    mapping(address => bool) public isParticipant;

    mapping(address => mapping(address => bool)) public haveConversation;
    mapping(address => mapping(address => uint)) public conversationId;

    uint[] emptyArrayPointer;

    constructor () {}

    function sendNewMessage(string memory _message, address _to) public returns (bool) {
        require(_to != msg.sender, 'You cannot initiate a conversation with yourself');
        require(_to != address(0), 'Null address');

        // creates message
        uint messageId = messages.length;
        uint timeSent = block.timestamp;
        Message memory message = Message({
            id: messageId, conversationId: 0, sender: msg.sender, receiver: _to, text: _message, timestamp: timeSent
        });
        messages.push(message);

        // links to existent conversation or to a new one
        if (haveConversation[msg.sender][_to]) {
            // add message to existing conversation
            Conversation storage conversation = conversations[conversationId[msg.sender][_to]];
            uint lenMessages = conversation.messageIds.length + 1;
            uint[] memory messIds = new uint[](lenMessages);
            for (uint i = 0; i < lenMessages; i++) {
                if (i < lenMessages - 1) {
                    messIds[i] = conversation.messageIds[i];
                } else {
                    messIds[i] = messageId;
                }
            }
            conversation.messageIds = messIds;
            message.conversationId = conversation.id;
            emit NewMessage(conversation.id,  msg.sender, _to, _message, timeSent);
        } else {
            // create conversation and add message
            if (!isParticipant[msg.sender]) {
                isParticipant[msg.sender] = true;
                participants.push(msg.sender);
            }
            if (!isParticipant[_to]) {
                isParticipant[_to] = true;
                participants.push(_to);
            }
            haveConversation[msg.sender][_to] = true;
            haveConversation[_to][msg.sender] = true;
            conversationId[msg.sender][_to] = conversations.length;
            conversationId[_to][msg.sender] = conversations.length;
            uint[] memory messIds = new uint[](1);
            messIds[0] = messageId;
            conversations.push(Conversation({
                id: conversations.length, messageIds: messIds
            }));
            message.conversationId = conversations.length - 1;
            emit NewConversation(conversations.length - 1);
            emit NewMessage(conversations.length - 1, msg.sender, _to, _message, timeSent);
        }
        return true;
    }

    function getConvId(address _user_a, address _user_b) public view returns (uint) {
        return conversationId[_user_a][_user_b];
    }

    function getConvLength(uint _conversationId) public view returns (uint) {
        return conversations[_conversationId].messageIds.length;
    }

    function getConvMessageIds(uint _conversationId) public view returns (uint[] memory) {
        return conversations[_conversationId].messageIds;
    }

    function getMessageInfo(uint _messageId) public view returns (address, address, string memory, uint) {
        return (
            messages[_messageId].sender,
            messages[_messageId].receiver,
            messages[_messageId].text,
            messages[_messageId].timestamp
        );
    }

    function getUserNumConv(address _user) public view returns (uint) {
        uint numConversations = 0;
        for (uint i = 0; i < participants.length; i++) {
            if (haveConversation[_user][participants[i]]) {
                numConversations = numConversations + 1;
            }
        }
        return numConversations;
    }

    function getUserConvIds(address _user) public view returns (uint[] memory) {
        uint numConversations = getUserNumConv(_user);
        uint[] memory conversationIds = new uint[](numConversations);
        uint nConv = 0;
        for (uint i = 0; i < participants.length; i++) {
            if (haveConversation[_user][participants[i]]) {
                conversationIds[nConv] = conversationId[_user][participants[i]];
                nConv = nConv + 1;
            }
        }
        return conversationIds;
    }
}

