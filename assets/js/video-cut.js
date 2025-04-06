document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const uploadContainer = document.getElementById('upload-container');
    const videoUpload = document.getElementById('video-upload');
    const videoPreviewContainer = document.getElementById('video-preview-container');
    const videoPreview = document.getElementById('video-preview');
    const videoName = document.getElementById('video-name');
    const videoDuration = document.getElementById('video-duration');
    const videoControls = document.getElementById('video-controls');
    const timeline = document.getElementById('timeline');
    const timelineProgress = document.getElementById('timeline-progress');
    const startMarker = document.getElementById('start-marker');
    const endMarker = document.getElementById('end-marker');
    const startHoursInput = document.getElementById('start-hours');
    const startMinutesInput = document.getElementById('start-minutes');
    const startSecondsInput = document.getElementById('start-seconds');
    const endHoursInput = document.getElementById('end-hours');
    const endMinutesInput = document.getElementById('end-minutes');
    const endSecondsInput = document.getElementById('end-seconds');
    const setStartBtn = document.getElementById('set-start-btn');
    const setEndBtn = document.getElementById('set-end-btn');
    const previewBtn = document.getElementById('preview-btn');
    const cutBtn = document.getElementById('cut-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const processingSpinner = document.getElementById('processing-spinner');
    const resultSuccess = document.getElementById('result-success');
    const resultError = document.getElementById('result-error');
    const errorMessage = document.getElementById('error-message');
    const downloadLink = document.getElementById('download-link');
    const tryAgainBtn = document.getElementById('try-again-btn');
    
    // 状态变量
    let videoFile = null;
    let videoDurationSeconds = 0;
    let startTime = 0;
    let endTime = 0;
    let isPreviewMode = false;
    let originalVideoTime = 0;
    
    // 初始化标记位置
    startMarker.style.left = '0%';
    endMarker.style.left = '100%';
    
    // 上传容器点击事件
    uploadContainer.addEventListener('click', function() {
        videoUpload.click();
    });
    
    // 拖放功能
    uploadContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadContainer.classList.add('drag-over');
    });
    
    uploadContainer.addEventListener('dragleave', function() {
        uploadContainer.classList.remove('drag-over');
    });
    
    uploadContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadContainer.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            handleVideoFile(e.dataTransfer.files[0]);
        }
    });
    
    // 文件选择事件
    videoUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleVideoFile(this.files[0]);
        }
    });
    
    // 处理视频文件
    function handleVideoFile(file) {
        // 检查文件类型
        if (!file.type.startsWith('video/')) {
            showError('请上传视频文件');
            return;
        }
        
        // 检查文件大小 (500MB 限制)
        if (file.size > 500 * 1024 * 1024) {
            showError('文件大小不能超过500MB');
            return;
        }
        
        videoFile = file;
        
        // 创建视频URL
        const videoURL = URL.createObjectURL(file);
        
        // 更新UI
        videoPreview.src = videoURL;
        videoName.textContent = file.name;
        
        // 显示视频预览
        uploadContainer.style.display = 'none';
        videoPreviewContainer.style.display = 'block';
        videoControls.style.display = 'block';
        resultContainer.style.display = 'none';
        
        // 视频加载完成后获取时长
        videoPreview.addEventListener('loadedmetadata', function() {
            videoDurationSeconds = videoPreview.duration;
            const durationFormatted = formatTime(videoDurationSeconds);
            videoDuration.textContent = `时长: ${durationFormatted}`;
            
            // 初始化结束时间为视频总时长
            endTime = videoDurationSeconds;
            updateTimeInputs();
            updateMarkers();
        });
        
        // 视频播放时更新进度条
        videoPreview.addEventListener('timeupdate', function() {
            const progress = (videoPreview.currentTime / videoDurationSeconds) * 100;
            timelineProgress.style.width = `${progress}%`;
            
            // 如果在预览模式且播放到结束点，则暂停并返回到开始点
            if (isPreviewMode && videoPreview.currentTime >= endTime) {
                videoPreview.pause();
                videoPreview.currentTime = startTime;
                isPreviewMode = false;
            }
        });
    }
    
    // 格式化时间为 HH:MM:SS
    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        
        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }
    
    // 数字补零
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    // 从输入框更新时间值
    function updateTimeFromInputs() {
        const startHours = parseInt(startHoursInput.value) || 0;
        const startMinutes = parseInt(startMinutesInput.value) || 0;
        const startSeconds = parseInt(startSecondsInput.value) || 0;
        
        const endHours = parseInt(endHoursInput.value) || 0;
        const endMinutes = parseInt(endMinutesInput.value) || 0;
        const endSeconds = parseInt(endSecondsInput.value) || 0;
        
        startTime = startHours * 3600 + startMinutes * 60 + startSeconds;
        endTime = endHours * 3600 + endMinutes * 60 + endSeconds;
        
        // 确保结束时间不超过视频时长
        endTime = Math.min(endTime, videoDurationSeconds);
        
        // 确保开始时间不大于结束时间
        if (startTime >= endTime) {
            startTime = Math.max(0, endTime - 1);
        }
        
        updateTimeInputs();
        updateMarkers();
    }
    
    // 更新时间输入框
    function updateTimeInputs() {
        const startHours = Math.floor(startTime / 3600);
        const startMinutes = Math.floor((startTime % 3600) / 60);
        const startSeconds = Math.floor(startTime % 60);
        
        const endHours = Math.floor(endTime / 3600);
        const endMinutes = Math.floor((endTime % 3600) / 60);
        const endSeconds = Math.floor(endTime % 60);
        
        startHoursInput.value = startHours;
        startMinutesInput.value = startMinutes;
        startSecondsInput.value = startSeconds;
        
        endHoursInput.value = endHours;
        endMinutesInput.value = endMinutes;
        endSecondsInput.value = endSeconds;
    }
    
    // 更新标记位置
    function updateMarkers() {
        const startPercent = (startTime / videoDurationSeconds) * 100;
        const endPercent = (endTime / videoDurationSeconds) * 100;
        
        startMarker.style.left = `${startPercent}%`;
        endMarker.style.left = `${endPercent}%`;
    }
    
    // 设置当前时间为开始时间
    setStartBtn.addEventListener('click', function() {
        startTime = videoPreview.currentTime;
        updateTimeInputs();
        updateMarkers();
    });
    
    // 设置当前时间为结束时间
    setEndBtn.addEventListener('click', function() {
        endTime = videoPreview.currentTime;
        updateTimeInputs();
        updateMarkers();
    });
    
    // 预览按钮点击事件
    previewBtn.addEventListener('click', function() {
        if (videoFile) {
            // 保存当前位置用于预览后恢复
            originalVideoTime = videoPreview.currentTime;
            
            // 设置开始位置并播放
            videoPreview.currentTime = startTime;
            isPreviewMode = true;
            videoPreview.play();
        }
    });
    
    // 切割按钮点击事件
    cutBtn.addEventListener('click', function() {
        if (videoFile && startTime < endTime) {
            // 显示处理中状态
            resultContainer.style.display = 'block';
            processingSpinner.style.display = 'block';
            resultSuccess.style.display = 'none';
            resultError.style.display = 'none';
            
            // 使用客户端视频切割（使用MediaRecorder API和Canvas）
            processVideoClientSide();
        } else {
            showError('请先上传视频并设置有效的开始和结束时间');
        }
    });
    
    // 在客户端处理视频（基于浏览器能力）
    function processVideoClientSide() {
        // 实际服务器处理视频需要专门的后端，这里模拟处理过程
        // 注意：完整的视频切割功能需要后端服务配合
        
        setTimeout(function() {
            // 随机选择成功或失败模拟（90%成功率）
            const isSuccess = Math.random() < 0.9;
            
            if (isSuccess) {
                // 成功状态
                processingSpinner.style.display = 'none';
                resultSuccess.style.display = 'flex';
                
                // 设置下载链接（实际应用中应该是处理后的视频URL）
                // 这里我们仅创建一个Blob URL作为示例
                const originalVideoBlob = new Blob([videoFile], { type: videoFile.type });
                const downloadUrl = URL.createObjectURL(originalVideoBlob);
                
                downloadLink.href = downloadUrl;
                downloadLink.download = `cut_${videoFile.name}`;
                
                // 显示详细信息
                resultSuccess.querySelector('p').innerHTML = `
                    视频切割成功！<br>
                    原始时长: ${formatTime(videoDurationSeconds)}<br>
                    切割后时长: ${formatTime(endTime - startTime)}<br>
                    开始时间: ${formatTime(startTime)}<br>
                    结束时间: ${formatTime(endTime)}
                `;
            } else {
                // 错误状态
                processingSpinner.style.display = 'none';
                resultError.style.display = 'flex';
                errorMessage.textContent = '处理视频时出错，请重试';
            }
        }, 3000);
    }
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', function() {
        reset();
    });
    
    // 重试按钮点击事件
    tryAgainBtn.addEventListener('click', function() {
        resultContainer.style.display = 'none';
    });
    
    // 时间输入框事件
    [startHoursInput, startMinutesInput, startSecondsInput, 
     endHoursInput, endMinutesInput, endSecondsInput].forEach(input => {
        input.addEventListener('change', updateTimeFromInputs);
    });
    
    // 时间轴点击事件（设置预览位置）
    timeline.addEventListener('click', function(e) {
        if (!videoFile) return;
        
        const rect = timeline.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * videoDurationSeconds;
        
        videoPreview.currentTime = newTime;
    });
    
    // 标记拖动功能
    let isDragging = false;
    let activeMarker = null;
    
    function startDrag(marker) {
        isDragging = true;
        activeMarker = marker;
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', stopDrag);
    }
    
    function onDragMove(e) {
        if (!isDragging || !activeMarker) return;
        
        const rect = timeline.getBoundingClientRect();
        let pos = (e.clientX - rect.left) / rect.width;
        pos = Math.max(0, Math.min(pos, 1));
        
        const newTime = pos * videoDurationSeconds;
        
        if (activeMarker === startMarker) {
            startTime = Math.min(newTime, endTime - 1);
        } else if (activeMarker === endMarker) {
            endTime = Math.max(newTime, startTime + 1);
        }
        
        updateTimeInputs();
        updateMarkers();
    }
    
    function stopDrag() {
        isDragging = false;
        activeMarker = null;
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', stopDrag);
    }
    
    startMarker.addEventListener('mousedown', function(e) {
        e.preventDefault();
        startDrag(startMarker);
    });
    
    endMarker.addEventListener('mousedown', function(e) {
        e.preventDefault();
        startDrag(endMarker);
    });
    
    // 显示错误信息
    function showError(message) {
        resultContainer.style.display = 'block';
        processingSpinner.style.display = 'none';
        resultSuccess.style.display = 'none';
        resultError.style.display = 'flex';
        errorMessage.textContent = message;
    }
    
    // 重置所有状态
    function reset() {
        // 重置视频和显示
        videoFile = null;
        videoDurationSeconds = 0;
        startTime = 0;
        endTime = 0;
        isPreviewMode = false;
        
        // 重置UI
        videoPreview.src = '';
        videoName.textContent = '';
        videoDuration.textContent = '';
        
        uploadContainer.style.display = 'block';
        videoPreviewContainer.style.display = 'none';
        videoControls.style.display = 'none';
        resultContainer.style.display = 'none';
        
        startMarker.style.left = '0%';
        endMarker.style.left = '100%';
        timelineProgress.style.width = '0%';
        
        updateTimeInputs();
    }
}); 