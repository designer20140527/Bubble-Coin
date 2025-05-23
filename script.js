document.addEventListener('DOMContentLoaded', () => {
  // 泡泡容器
  const gameBoard = document.querySelector('.gameboard');
  
  // 初始泡泡数量
  const initialBubbles = document.querySelectorAll('.label').length;
  let currentBubbleId = initialBubbles;
  
  // 添加更多泡泡的函数
  function addNewBubble() {
    // 创建新泡泡
    const checkboxId = `checkbox-${currentBubbleId}`;
    const bubbleId = `bubble-${currentBubbleId}`;
    
    // 创建复选框
    const checkbox = document.createElement('input');
    checkbox.className = 'checkbox';
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    
    // 创建标签
    const label = document.createElement('label');
    label.className = 'label';
    label.setAttribute('for', checkboxId);
    label.id = bubbleId;
    
    // 随机位置和动画
    const randomLeft = Math.random() * 90;
    const duration = 15 + Math.random() * 15;
    const delay = Math.random() * 2;
    
    label.style.left = `${randomLeft}%`;
    // 修改动画为无限循环，让泡泡一直上升
    label.style.animation = `floatUp ${duration}s ${delay}s linear infinite`;
    
    // 增大随机大小范围
    const size = 80 + Math.random() * 90; // 调整为80px-170px
    
    // 创建泡泡内容
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.borderRadius = '50%';
    
    // 随机决定是否为hover泡泡（约40%的泡泡是hover触发）
    if (Math.random() < 0.4) {
      bubble.classList.add('hover-bubble');
      
      // 为hover泡泡添加鼠标悬停事件
      label.addEventListener('mouseenter', function() {
        // 播放泡泡点击音效
        playPopSound();
        
        // 应用破裂动画
        bubble.style.animation = 'pop 250ms forwards';
        
        // 一定时间后移除泡泡
        setTimeout(() => {
          if (gameBoard.contains(checkbox)) {
            gameBoard.removeChild(checkbox);
          }
          if (gameBoard.contains(label)) {
            gameBoard.removeChild(label);
          }
        }, 300);
      });
    }
    
    // 组合泡泡
    label.appendChild(bubble);
    
    // 添加到游戏界面
    gameBoard.appendChild(checkbox);
    gameBoard.appendChild(label);
    
    // 添加点击事件（对非hover泡泡有效）
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        // 如果是hover泡泡，则不响应点击
        if (!bubble.classList.contains('hover-bubble')) {
          // 播放泡泡点击音效
          playPopSound();
          
          // 获取泡泡元素并应用破裂动画
          bubble.style.animation = 'pop 250ms forwards';
          
          // 一定时间后移除泡泡
          setTimeout(() => {
            if (gameBoard.contains(checkbox)) {
              gameBoard.removeChild(checkbox);
            }
            if (gameBoard.contains(label)) {
              gameBoard.removeChild(label);
            }
          }, 300);
        }
      }
    });
    
    currentBubbleId++;
  }
  
  // 为初始泡泡添加点击事件和无限循环动画
  const initialCheckboxes = document.querySelectorAll('.checkbox');
  const initialBubbleLabels = document.querySelectorAll('.label');
  
  initialBubbleLabels.forEach((label, index) => {
    const checkbox = initialCheckboxes[index];
    const bubbleElement = label.querySelector('.bubble');
    
    // 增大初始泡泡的尺寸
    if (bubbleElement) {
      const size = 80 + Math.random() * 90; // 调整为80px-170px
      bubbleElement.style.width = `${size}px`;
      bubbleElement.style.height = `${size}px`;
      
      // 随机决定是否为hover泡泡
      if (Math.random() < 0.4) {
        bubbleElement.classList.add('hover-bubble');
        
        // 为hover泡泡添加鼠标悬停事件
        label.addEventListener('mouseenter', function() {
          // 播放泡泡点击音效
          playPopSound();
          
          // 应用破裂动画
          bubbleElement.style.animation = 'pop 250ms forwards';
          
          // 一定时间后移除泡泡
          setTimeout(() => {
            if (label.parentNode) {
              label.parentNode.removeChild(label);
            }
            if (checkbox && checkbox.parentNode) {
              checkbox.parentNode.removeChild(checkbox);
            }
          }, 300);
        });
      }
    }
    
    // 为非hover泡泡添加点击事件
    if (checkbox) {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          // 如果是hover泡泡，则不响应点击
          if (bubbleElement && !bubbleElement.classList.contains('hover-bubble')) {
            // 播放泡泡点击音效
            playPopSound();
            
            // 应用破裂动画
            bubbleElement.style.animation = 'pop 250ms forwards';
            
            // 一定时间后移除泡泡
            setTimeout(() => {
              if (label.parentNode) {
                label.parentNode.removeChild(label);
              }
              if (this.parentNode) {
                this.parentNode.removeChild(this);
              }
            }, 300);
          }
        }
      });
    }
    
    // 设置无限循环动画
    const currentAnimation = window.getComputedStyle(label).animation;
    // 提取动画时间
    const durationMatch = currentAnimation.match(/(\d+(\.\d+)?)s/);
    const duration = durationMatch ? parseFloat(durationMatch[1]) : 20;
    
    // 设置无限循环动画
    label.style.animation = `floatUp ${duration}s 0s linear infinite`;
  });
  
  // 减少泡泡生成频率
  setInterval(addNewBubble, 3000); // 从1秒改为3秒
  
  // 初始生成一些泡泡，减少数量
  for (let i = 0; i < 5; i++) { // 从10个改为5个
    setTimeout(() => addNewBubble(), i * 600);
  }
  
  // 泡泡点击音效
  function playPopSound() {
    // 创建音频上下文
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 创建振荡器
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.exponentialRampToValueAtTime(
      987.77, audioContext.currentTime + 0.1 // B5
    );
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  }
}); 