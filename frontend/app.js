// Biến toàn cục
let provider;
let signer;
let contract;
let userAddress;

// Contract ABI - sẽ được load từ file MessageBoard.json
let contractABI;

// Khởi tạo khi trang load
window.addEventListener('load', async () => {
    console.log('🔍 Đang kiểm tra MetaMask...');
    console.log('window.ethereum:', typeof window.ethereum);
    
    // Kiểm tra MetaMask với retry
    const hasMetaMask = await checkMetaMask();
    
    console.log('✅ Kết quả kiểm tra MetaMask:', hasMetaMask);
    
    if (!hasMetaMask) {
        console.log('❌ Không tìm thấy MetaMask');
        showMetaMaskModal();
        return;
    }

    console.log('✅ Tìm thấy MetaMask, đang khởi tạo ứng dụng...');
    await initializeApp();
});

// Kiểm tra MetaMask có sẵn hay không (với retry)
async function checkMetaMask(retries = 3, delay = 500) {
    for (let i = 0; i < retries; i++) {
        if (typeof window.ethereum !== 'undefined') {
            return true;
        }
        // Đợi một chút rồi thử lại
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    return false;
}

// Khởi tạo ứng dụng
async function initializeApp() {
    // Load ABI
    await loadContractABI();

    // Setup event listeners
    setupEventListeners();

    // Kiểm tra nếu đã kết nối trước đó
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await connectWallet();
        }
    } catch (error) {
        console.error('Lỗi kiểm tra accounts:', error);
    }
}

// Load Contract ABI
async function loadContractABI() {
    try {
        const response = await fetch('MessageBoard.json');
        const artifact = await response.json();
        contractABI = artifact.abi;
    } catch (error) {
        console.error('Không thể load ABI:', error);
        showNotification('Lỗi khi load contract ABI. Vui lòng deploy contract trước!', 'error');
    }
}

// Hiển thị modal cài đặt MetaMask
function showMetaMaskModal() {
    const modal = document.getElementById('metamaskModal');
    modal.classList.remove('hidden');
    
    // Setup retry button
    const retryBtn = document.getElementById('retryMetaMask');
    const retryHandler = async () => {
        showNotification('Đang kiểm tra MetaMask...', 'info');
        
        // Kiểm tra lại MetaMask
        const hasMetaMask = await checkMetaMask(5, 1000); // Thử 5 lần, mỗi lần cách 1 giây
        
        if (hasMetaMask) {
            modal.classList.add('hidden');
            showNotification('Phát hiện MetaMask thành công!', 'success');
            await initializeApp();
        } else {
            showNotification('Vẫn chưa phát hiện MetaMask. Vui lòng kiểm tra lại extension!', 'error');
        }
    };
    retryBtn.addEventListener('click', retryHandler);
    
    // Setup close button
    const closeBtn = document.getElementById('closeModal');
    const closeHandler = () => {
        modal.classList.add('hidden');
    };
    closeBtn.addEventListener('click', closeHandler);
    
    // Close khi click bên ngoài modal
    const modalClickHandler = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    };
    modal.addEventListener('click', modalClickHandler);
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
    document.getElementById('refreshMessages').addEventListener('click', loadMessages);
    
    // Character counter
    const messageContent = document.getElementById('messageContent');
    messageContent.addEventListener('input', (e) => {
        document.getElementById('charCount').textContent = e.target.value.length;
    });

    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            resetUI();
        } else {
            connectWallet();
        }
    });

    // Listen for network changes
    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });
}

// Kết nối ví MetaMask
async function connectWallet() {
    try {
        showLoading(true);

        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        userAddress = accounts[0];

        // Setup provider and signer (ethers v6)
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        // Get network info
        const network = await provider.getNetwork();

        // Initialize contract
        if (contractABI) {
            contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        }

        // Update UI
        document.getElementById('walletAddress').textContent = 
            `${userAddress.substring(0, 6)}...${userAddress.substring(38)}`;
        document.getElementById('networkName').textContent = network.name || `Chain ID: ${network.chainId}`;

        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('walletInfo').classList.remove('hidden');
        document.getElementById('messageForm').style.display = 'block';
        document.getElementById('stats').style.display = 'flex';
        document.getElementById('messagesSection').style.display = 'block';

        showNotification('Kết nối ví thành công!', 'success');

        // Load messages
        await loadMessages();
        await updateStats();

        showLoading(false);
    } catch (error) {
        console.error('Lỗi kết nối ví:', error);
        
        // Kiểm tra nếu user từ chối
        if (error.code === 4001 || error.message.includes('User rejected') || error.message.includes('User denied')) {
            showNotification('Bạn đã từ chối kết nối ví', 'info');
        } else {
            showNotification('Không thể kết nối ví: ' + error.message, 'error');
        }
        
        showLoading(false);
    }
}

// Gửi tin nhắn
async function sendMessage() {
    const content = document.getElementById('messageContent').value.trim();

    if (!content) {
        showNotification('Vui lòng nhập nội dung tin nhắn!', 'error');
        return;
    }

    if (content.length > 500) {
        showNotification('Nội dung quá dài (tối đa 500 ký tự)!', 'error');
        return;
    }

    try {
        showLoading(true);
        showNotification('Đang gửi tin nhắn...', 'info');

        // Gửi transaction
        const tx = await contract.sendMessage(content);
        showNotification('Đang xác nhận transaction...', 'info');
        
        // Đợi transaction được xác nhận
        await tx.wait();

        showNotification('Gửi tin nhắn thành công!', 'success');

        // Clear form
        document.getElementById('messageContent').value = '';
        document.getElementById('charCount').textContent = '0';

        // Reload messages and stats
        await loadMessages();
        await updateStats();

        showLoading(false);
    } catch (error) {
        console.error('Lỗi gửi tin nhắn:', error);
        
        // Kiểm tra nếu user từ chối transaction
        if (error.code === 'ACTION_REJECTED' || error.code === 4001 || 
            error.message.includes('User rejected') || 
            error.message.includes('User denied') ||
            error.message.includes('user rejected transaction')) {
            showNotification('Bạn đã hủy gửi tin nhắn', 'info');
        } else if (error.message.includes('insufficient funds')) {
            showNotification('Không đủ ETH để thực hiện giao dịch', 'error');
        } else {
            showNotification('Lỗi gửi tin nhắn: ' + error.message, 'error');
        }
        
        showLoading(false);
    }
}

// Load tất cả tin nhắn
async function loadMessages() {
    try {
        showLoading(true);

        const messages = await contract.getAllMessages();
        const messagesList = document.getElementById('messagesList');
        messagesList.innerHTML = '';

        if (messages.length === 0) {
            messagesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Chưa có tin nhắn nào. Hãy là người đầu tiên gửi tin nhắn! 🚀</p>';
        } else {
            // Hiển thị tin nhắn mới nhất trước
            for (let i = messages.length - 1; i >= 0; i--) {
                const message = messages[i];
                const messageCard = createMessageCard(message);
                messagesList.appendChild(messageCard);
            }
        }

        showLoading(false);
    } catch (error) {
        console.error('Lỗi load tin nhắn:', error);
        showNotification('Lỗi load tin nhắn: ' + error.message, 'error');
        showLoading(false);
    }
}

// Tạo message card
function createMessageCard(message) {
    const card = document.createElement('div');
    card.className = 'message-card';
    
    // Kiểm tra nếu là tin nhắn của người dùng hiện tại
    const isMyMessage = message.sender.toLowerCase() === userAddress.toLowerCase();
    if (isMyMessage) {
        card.classList.add('my-message');
    }

    // Format time (ethers v6)
    const timestamp = typeof message.timestamp === 'bigint' ? Number(message.timestamp) : message.timestamp;
    const date = new Date(timestamp * 1000);
    const timeString = date.toLocaleString('vi-VN');

    // Format address
    const senderAddress = message.sender;
    const shortAddress = `${senderAddress.substring(0, 6)}...${senderAddress.substring(38)}`;

    card.innerHTML = `
        <div class="message-header">
            <span class="message-sender">
                ${isMyMessage ? '👤 Bạn' : '👥 ' + shortAddress}
            </span>
            <span class="message-time">${timeString}</span>
        </div>
        <div class="message-content">${escapeHtml(message.content)}</div>
        <div class="message-id">#${message.id.toString()}</div>
    `;

    return card;
}

// Update thống kê
async function updateStats() {
    try {
        const totalMessages = await contract.getMessageCount();
        // Convert BigInt to string for display (ethers v6)
        document.getElementById('totalMessages').textContent = totalMessages.toString();

        const myMessages = await contract.getMessagesBySender(userAddress);
        document.getElementById('myMessages').textContent = myMessages.length;
    } catch (error) {
        console.error('Lỗi update stats:', error);
    }
}

// Hiển thị/ẩn loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

// Reset UI
function resetUI() {
    document.getElementById('connectWallet').style.display = 'block';
    document.getElementById('walletInfo').classList.add('hidden');
    document.getElementById('messageForm').style.display = 'none';
    document.getElementById('stats').style.display = 'none';
    document.getElementById('messagesSection').style.display = 'none';
    userAddress = null;
}

// Escape HTML để tránh XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
