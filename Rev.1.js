/* ===================================================================
 * 통합 자바스크립트 파일 (최종 확정본...)
 * ===================================================================
 */
document.addEventListener('DOMContentLoaded', function() {
(function() {
    const followerElement = document.getElementById('custom-mouse-follower');
    if (followerElement) document.body.appendChild(followerElement);
    // ===================================================================
    // 1. 상수 정의 및 요소 캐싱
    // ===================================================================
    const ANIMATION_DURATION = 3000; 
    const IS_MOBILE = window.innerWidth <= 768;
    
    // 최종 위치 및 크기
    const END_TOP_VALUE = IS_MOBILE ? 10 : 25; // 최종 위치 Y (vh)
    const END_LEFT_VALUE = 80; // 최종 위치 X (vw)
    const MOON_END_SCALE = 0.5; // 최종 축소 크기
    
    // 시작 위치 및 크기
    const START_TOP_VALUE = IS_MOBILE ? 47.5 : 50;
    const START_LEFT_VALUE = 50;
    const START_SCALE = 1;

    // 애니메이션 제어 비율
    const MOON_MOVE_DURATION_RATIO = 0.30; // ⭐️ 달 이동 완료 시점: 30% (0.9초)
    const LIGHT_SPREAD_START_POINT = 0.33; // ⭐️ 광원 확산 시작 시점: 33% (약 1.0초, 0.1초 지연)
    const SCROLL_DISTANCE_VH = 0.3;
    const SCROLL_INSET_START = 25;
    
    // ⭐️ 광원 투명도 설정
    const INITIAL_LIGHT_OPACITY = 0.1; // 초기 광원 투명도
    const MAX_LIGHT_OPACITY = 0.25; // 최대 광원 투명도


    const clickArea = document.querySelector('#click-trigger-area');
    const moon = document.querySelector('.moon');
    const sec2 = document.querySelector('.sec2');
    const textBox1_white = document.querySelector('#sec1-textbox1-white');
    const textBox1_reveal = document.querySelector('#sec1-textbox1-reveal');
    const textBox2_white = document.querySelector('#sec1-textbox2-white');
    const textBox2_reveal = document.querySelector('#sec1-textbox2-reveal');
    const progressDisplay = document.querySelector('#progress-display');
    const customMouseFollower = document.getElementById('custom-mouse-follower');
    const dDayValueSpan = customMouseFollower ? customMouseFollower.querySelector('.d-day-value') : null;
    const rotatingTextContainer = customMouseFollower ? customMouseFollower.querySelector('.follower-rotating-text') : null;
    const hiddenElementsContainer = document.querySelector('.hidden-elements-container');
    const moonlightEffect = document.querySelector('.moonlight-effect');

    if (!clickArea || !moon || !sec2 || !customMouseFollower || !hiddenElementsContainer || !moonlightEffect) {
        console.error("Critical elements missing. Script terminated.");
        return;
    }

    let isAnimating = false;
    let scrollAnimationStartPoint = null;
    let lastLightX = null;
    let lastLightY = null;
    let lastLightRadius = null;
    let lastMoonTransform = ''; 
    let lastSec2ClipPath = null;
    let lastProgressText = '';
    
    let frameCounter = 0;

    // ⭐️ Quad Ease-in-out 함수
    function easeInOutQuad(x) {
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }

    // ===================================================================
    // D-DAY 및 원형 텍스트
    // ===================================================================
    const TARGET_DATE = new Date('2025-10-18T00:00:00');

    function updateDDay() {
        if (!dDayValueSpan) return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffTime = TARGET_DATE.getTime() - today.getTime();
        const MS_PER_DAY = 86400000;
        const diffDays = Math.ceil(diffTime / MS_PER_DAY);

        if (diffDays > 0) {
            dDayValueSpan.textContent = `D-${diffDays}`;
        } else if (diffDays === 0) {
            dDayValueSpan.textContent = `D-DAY`;
        } else {
            dDayValueSpan.textContent = `D+${Math.abs(diffDays)}`;
        }
    }

    function setupCircularText() {
        if (!rotatingTextContainer) return;
        const textElement = rotatingTextContainer.querySelector('span');
        if (!textElement || textElement.textContent.trim() === '') return;

        const text = textElement.textContent;
        rotatingTextContainer.innerHTML = '';

        const totalChars = text.length;
        const spaceCount = 1;
        const finalTotalChars = totalChars + spaceCount;
        rotatingTextContainer.style.setProperty('--my-custom-total-chars', finalTotalChars, 'important');

        let charCount = 0;
        for (let i = 0; i < totalChars; i++) {
            const char = text[i];
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            if (char === ' ') {
                charSpan.classList.add('circular-space');
            }
            charSpan.style.setProperty('--char-index', charCount);
            rotatingTextContainer.appendChild(charSpan);
            charCount++;
        }

        for (let i = 0; i < spaceCount; i++) {
            const spaceSpan = document.createElement('span');
            spaceSpan.textContent = '\u00A0';
            spaceSpan.classList.add('circular-gap');
            spaceSpan.style.setProperty('--char-index', charCount);
            rotatingTextContainer.appendChild(spaceSpan);
            charCount++;
        }
    }

    // ===================================================================
    // 마우스 팔로워 제어 로직 (모바일 크기 조정 반영)
    // ===================================================================
    let mouseX = 0,
        mouseY = 0,
        followerX = 0,
        followerY = 0;
    const speed = 0.15;
    let isFollowerAnimating = false;
    
    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isAnimating) {
            if (!customMouseFollower.classList.contains('fade-out')) {
                customMouseFollower.style.opacity = '1';
                customMouseFollower.style.visibility = 'visible';
            }
            if (!isFollowerAnimating) {
                followerX = mouseX;
                followerY = mouseY;
                isFollowerAnimating = true;
                window.requestAnimationFrame(animateFollower);
            }
        }
    }

    function handleMouseLeave() {
        if (!customMouseFollower.classList.contains('fixed-bottom-right')) {
            customMouseFollower.style.opacity = '0';
            customMouseFollower.style.visibility = 'hidden';
            isFollowerAnimating = false;
        }
    }

    function animateFollower() {
        if (isAnimating || customMouseFollower.style.visibility === 'hidden' || customMouseFollower.classList.contains('fixed-bottom-right')) {
            isFollowerAnimating = false;
            return;
        }
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        
        // ⭐️ 모바일일 경우 transform에 scale(0.5)를 추가합니다.
        const scaleTransform = IS_MOBILE ? 'scale(0.5)' : '';

        customMouseFollower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%) ${scaleTransform}`;
        if (isFollowerAnimating) {
            window.requestAnimationFrame(animateFollower);
        }
    }

    function toggleMouseFollower(enable) {
        if (!customMouseFollower || !clickArea) return;
        if (enable) {
            clickArea.addEventListener('mousemove', handleMouseMove);
            clickArea.addEventListener('mouseleave', handleMouseLeave);
            customMouseFollower.style.pointerEvents = 'none';
        } else {
            clickArea.removeEventListener('mousemove', handleMouseMove);
            clickArea.removeEventListener('mouseleave', handleMouseLeave);
            isFollowerAnimating = false;
        }
    }
    
    // ===================================================================
    // 애니메이션 및 스크롤 로직 
    // ===================================================================
    function toggleScroll(enable) {
        document.body.classList.toggle('no-scroll', !enable);
        if (window.lenisInstance) {
            if (enable) {
                window.lenisInstance.start();
            } else {
                window.lenisInstance.stop();
            }
        } else {
            console.warn('Lenis instance not found on window object.');
        }
    }

    function startClickAnimation() {
        if (isAnimating) return;
        isAnimating = true;

        toggleMouseFollower(false);
        moon.classList.add('is-clicked');

        if (customMouseFollower) {
            customMouseFollower.classList.add('fade-out');
        }

        toggleScroll(false);
        clickArea.style.display = 'none';

        let startTime = null;

        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);
            
            // 💡 프레임 스킵 최적화: 2프레임당 1회만 DOM 업데이트 실행
            if (frameCounter % 2 === 0) {  
                updateLightAndTextAnimations(progress);
            }
            frameCounter++;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                
                // 클릭 핸들러의 무거운 후처리 작업을 setTimeout(0)으로 분할
                setTimeout(() => {
                    if (customMouseFollower) {
                        customMouseFollower.style.transform = '';
                        customMouseFollower.classList.remove('fade-out');
                        customMouseFollower.classList.add('fixed-bottom-right'); 
                    }

                    isAnimating = false;
                    scrollAnimationStartPoint = window.scrollY;
                    document.body.style.overflowX = 'hidden';
                    toggleScroll(true);

                    window.addEventListener('scroll', handleScrollTick, { passive: true });
                    requestAnimationFrame(scrollAnimationLoop);
                }, 0);
            }
        }
        requestAnimationFrame(animate);
    }

    function updateLightAndTextAnimations(progress) {
        // 달의 이동 진척도 계산
        const linearProgress = Math.min(1, progress / MOON_MOVE_DURATION_RATIO);
        
        // ⭐️ easeInOutQuad 함수를 적용하여 부드러운 움직임 보간
        const moonMoveProgress = easeInOutQuad(linearProgress);
        
        // 💡 달의 현재 위치 계산 (퍼센트 기준)
        const newLeft = START_LEFT_VALUE + (END_LEFT_VALUE - START_LEFT_VALUE) * moonMoveProgress;
        const newTop = START_TOP_VALUE + (END_TOP_VALUE - START_TOP_VALUE) * moonMoveProgress;
        const newScale = START_SCALE + (MOON_END_SCALE - START_SCALE) * moonMoveProgress;
        
        const lightX = newLeft;
        const lightY = newTop;
        
        // ----------------------------------------------------
        // 달의 transform 업데이트: 부드러운 위치/크기 변화 적용
        // ----------------------------------------------------
        const targetX_vw = (END_LEFT_VALUE - 50) * moonMoveProgress; 
        const targetY_vh = (END_TOP_VALUE - START_TOP_VALUE) * moonMoveProgress; 
        
        const newMoonTransform = `translate(-50%, -50%) translate(${targetX_vw}vw, ${targetY_vh}vh) scale(${newScale.toFixed(2)})`;
        
        // 💡 캐싱을 통한 불필요한 DOM 업데이트 방지
        if (newMoonTransform !== lastMoonTransform) {
             moon.style.transform = newMoonTransform;
             lastMoonTransform = newMoonTransform;
        }
        // ----------------------------------------------------
        
        // 텍스트 1 페이드 아웃
        const textBox1_opacity = (1 - moonMoveProgress).toFixed(2);
        if (textBox1_white && textBox1_white.style.opacity !== textBox1_opacity) {
            textBox1_white.style.opacity = textBox1_opacity;
            if (textBox1_reveal) textBox1_reveal.style.opacity = textBox1_opacity;
        }
        
        let lightRadius;
        let textBox2_opacity = '0'; 
        // ⭐️ 광원의 투명도를 제어하기 위한 변수
        let lightOpacity = INITIAL_LIGHT_OPACITY; 

        // 라이트 확산 및 텍스트 2 페이드 인 (LIGHT_SPREAD_START_POINT에서 시작)
        if (progress >= LIGHT_SPREAD_START_POINT) {
            const revealProgress = (progress - LIGHT_SPREAD_START_POINT) / (1 - LIGHT_SPREAD_START_POINT);
            
            // 확산 속도 조절
            lightRadius = 30 + (revealProgress * 220); 
            
            // ⭐️ 달빛의 투명도를 점진적으로 증가
            lightOpacity = INITIAL_LIGHT_OPACITY + (MAX_LIGHT_OPACITY - INITIAL_LIGHT_OPACITY) * revealProgress;
            
            textBox2_opacity = revealProgress.toFixed(2);

            if (textBox2_white && textBox2_white.style.opacity !== textBox2_opacity) {
                textBox2_white.style.opacity = textBox2_opacity;
                if (textBox2_reveal) textBox2_reveal.style.opacity = textBox2_opacity;
                if (sec2) sec2.style.opacity = revealProgress; 
            }
        } else {
            lightRadius = 30;
            // LIGHT_SPREAD_START_POINT 이전에는 초기 투명도(0.1) 유지
            lightOpacity = INITIAL_LIGHT_OPACITY;
            
            // 텍스트 2 투명도 0 유지
            if (textBox2_white && textBox2_white.style.opacity !== '0') {
                textBox2_white.style.opacity = '0';
                if (textBox2_reveal) textBox2_reveal.style.opacity = '0';
                if (sec2) sec2.style.opacity = '0';
            }
        }

        // CSS 변수 업데이트 배치
        const roundedLightX = lightX.toFixed(2);
        const roundedLightY = lightY.toFixed(2);
        const roundedRadius = lightRadius.toFixed(2);
        
        // ⭐️ 광원 투명도 업데이트 및 background 직접 설정
        const rootStyle = document.documentElement.style;
        
        const innerColorOpacity = lightOpacity;
        const outerColorOpacity = lightOpacity * 0.6; // 0.15/0.25 = 0.6 비율 유지
        
        const finalInnerColor = `rgba(245, 223, 133, ${innerColorOpacity.toFixed(3)})`;
        const finalOuterColor = `rgba(245, 223, 133, ${outerColorOpacity.toFixed(3)})`;

        // 💡 background 속성을 직접 설정하여 투명도 변화 반영
        moonlightEffect.style.background = `radial-gradient(circle at var(--light-x) var(--light-y), ${finalInnerColor} 0%, ${finalOuterColor} 10%, transparent var(--light-radius))`;

        // 💡 X, Y, Radius 모두 캐싱하여 최적화
        if (roundedLightX !== lastLightX || roundedLightY !== lastLightY || roundedRadius !== lastLightRadius) {
            rootStyle.setProperty('--light-x', `${roundedLightX}%`);
            rootStyle.setProperty('--light-y', `${roundedLightY}%`);
            rootStyle.setProperty('--light-radius', `${roundedRadius}%`);
            
            lastLightX = roundedLightX;
            lastLightY = roundedLightY;
            lastLightRadius = roundedRadius;
        }

        if (progressDisplay) {
            const currentProgressText = `Progress: ${Math.round(progress * 100)}%`;
            if (currentProgressText !== lastProgressText) {
                progressDisplay.textContent = currentProgressText;
                lastProgressText = currentProgressText;
            }
        }
    }

    let isScrollTicking = false;
    let animationFrameId = null;

    function handleScrollTick() {
        isScrollTicking = true;
    }
    
    function scrollAnimationLoop() {
        if (isScrollTicking) {
            if (scrollAnimationStartPoint !== null && !isAnimating) {
                const distanceScrolled = window.scrollY - scrollAnimationStartPoint;
                const scrollAnimationDistance = window.innerHeight * SCROLL_DISTANCE_VH;
                const scrollProgress = Math.max(0, Math.min(1, distanceScrolled / scrollAnimationDistance));

                const insetPercentage = SCROLL_INSET_START * (1 - scrollProgress);
                const newClipPath = `inset(0 ${insetPercentage.toFixed(3)}% 0 ${insetPercentage.toFixed(3)}% round 30px 30px 0 0)`;

                if (newClipPath !== lastSec2ClipPath) {
                    sec2.style.clipPath = newClipPath;
                    lastSec2ClipPath = newClipPath;
                }

                isScrollTicking = false;

                if (scrollProgress >= 1) {
                    window.removeEventListener('scroll', handleScrollTick);
                    cancelAnimationFrame(animationFrameId);
                    return;
                }
            }
        }
        animationFrameId = requestAnimationFrame(scrollAnimationLoop);
    }

    // ===================================================================
    // 초기 설정 및 이벤트 리스너
    // ===================================================================
    toggleScroll(false); 

    updateDDay();
    setupCircularText();
    toggleMouseFollower(true);

    clickArea.addEventListener('click', startClickAnimation);

    // ⭐️ 초기 상태 광원 투명도 설정
    const initialInnerColor = `rgba(245, 223, 133, ${INITIAL_LIGHT_OPACITY.toFixed(3)})`;
    const initialOuterColor = `rgba(245, 223, 133, ${(INITIAL_LIGHT_OPACITY * 0.6).toFixed(3)})`;
    moonlightEffect.style.background = `radial-gradient(circle at var(--light-x) var(--light-y), ${initialInnerColor} 0%, ${initialOuterColor} 10%, transparent var(--light-radius))`;
    
    // 초기 상태 CSS 변수 설정
    document.documentElement.style.setProperty('--light-x', '50%');
    document.documentElement.style.setProperty('--light-y', IS_MOBILE ? '47.5%' : '50%'); 
    document.documentElement.style.setProperty('--light-radius', '30%');
    
    // 초기 상태 텍스트 투명도 및 sec2 설정
    if (textBox2_white) textBox2_white.style.opacity = '0';
    if (textBox2_reveal) textBox2_reveal.style.opacity = '0';
    if (sec2) sec2.style.opacity = '0';
})();





	
	
// =================================================================== 
// SEC5 코드: 날짜/시간별 이벤트 정보 표시 로직 (배경 전환 기능 제거)
// =================================================================== 
// =================================================================== 
// SEC5 코드: 날짜/시간별 이벤트 정보 표시 로직 (배경 전환 기능 제거)
// =================================================================== 

(function() {
    'use strict';

    // 5-1. 데이터 (수정 없음)
    const COMMON_PLACEHOLDER_URL = 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/4sec_rkdrk.svg'; 
    const EVENT_DATA = {
        'day18': [
            { location: '전체', target: [{ id: 'image1', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/22.webp', text: ['만들기 및 전통놀이', '체험', '15:00~21:30'] }, { id: 'image2', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/111.webp', text: ['성웅의 자취를 걷다', '야간 경관', '18:00~21:30'] }, ] }, 
            { location: '고택', target: [{ id: 'image1', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/12.webp', text: ['이형환(거문고)', 'ART SPOT', '16:00~16:30'] }, { id: 'image2', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/13.webp', text: ['서울시무형유산 삼현육각', 'ART SPOT', '16:40~17:10'] }, ] }, 
            { location: '활터', target: [{ id: 'image1', backgroundUrl: 'https://asanmoonlight.com/wp-content/uploads/2025/10/3131-scaled.webp', text: ['베어트리체', '재즈밤', '17:30~18:00'] }, { id: 'image2', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/15.webp', text: ['노민수집시 트리오', '재즈밤', '18:20~18:50'] }, { id: 'image3', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/16.webp', text: ['전제덕 밴드', '재즈밤', '19:10~19:40'] }, { id: 'image4', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/33.webp', text: ['미디어아트', '미디어아트', '19:40~21:00'] }, ] }, 
            { location: '충무문', target: [{ id: 'image1', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/17.webp', text: ['서울예술대학교 한국음악단', 'ART SPOT', '18:00~18:30'] }, { id: 'image2', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/18.webp', text: ['은청', '퓨전국악', '18:40~19:10'] }, { id: 'image3', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/19.webp', text: ['중앙대학교 국악관현악단 x 오정해', 'ART SPOT', '19:30~20:20'] }, ] }, 
            { location: '잔디광장', target: [{ id: 'image1', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/20.webp', text: ['경기음악연구회', 'ART SPOT', '17:00~17:30'] }, { id: 'image2', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/21.webp', text: ['유미자 줄놀이 무용단', '장고춤, 살풀이', '17:40~18:10'] }, ] }, 
            { location: '곡교천 야영장', target: [{ id: 'image1', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/77.webp', text: ['푸드존', '푸드존', '15:00~22:00'] }, ] }, 
        ],
        'day19': [
            { location: '전체', target: [{ id: 'image1', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/55.webp', text: ['만들기 및 전통놀이', '체험', '15:00~21:30'] }, { id: 'image2', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/44.webp', text: ['성웅의 자취를 걷다', '야간 경관', '18:00~21:30'] }, ] }, 
            { location: '고택', target: [{ id: 'image1', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/1.webp', text: ['이용구(대금)', 'ART SPOT', '16:00~16:30'] }, { id: 'image2', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/2.webp', text: ['경기시나위보존회', 'ART SPOT', '16:40~17:10'] }, ] }, 
            { location: '활터', target: [{ id: 'image1', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/3.webp', text: ['장차니 트리오', '재즈밤', '17:30~18:00'] }, { id: 'image2', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/4.webp', text: ['올디 벗 구디', '재즈밤', '18:20~18:50'] }, { id: 'image3', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/5.webp', text: ['에오트리오', '재즈밤', '19:10~19:40'] }, { id: 'image4', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/33.webp', text: ['미디어아트', '미디어아트', '19:40~21:00'] }, ] }, 
            { location: '충무문', target: [{ id: 'image1', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/21.webp', text: ['유미자·출놀이 무용단', '무용', '18:00~18:20'] }, { id: 'image2', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/7.webp', text: ['선문대 태권도시범단', '태권검무', '18:20~18:50'] }, { id: 'image3', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/8.webp', text: ['임태경', '팝페라', '18:50~19:30'] }, { id: 'image4', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/9.webp', text: ['디스이즈잇', 'LED퍼포먼스', '19:30~20:00'] }, ] }, 
            { location: '잔디광장', target: [{ id: 'image1', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/10.webp', text: ['예인집단아재', '줄타기', '17:00~17:30'] }, { id: 'image2', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/11.webp', text: ['공간', 'ART SPOT', '17:40~18:10'] }, ] }, 
            { location: '곡교천 야영장', target: [{ id: 'image1', backgroundUrl: 'https://cdn.jsdelivr.net/gh/zzazeng30-sudo/asan@main/88.webp', text: ['푸드존', '푸드존', '15:00~22:00'] }, ] }, 
        ]
    };

    // 5-2. 초기 요소 및 상태 변수
    const TIME_BTN_SELECTOR = '.timebtncon .elementor-widget-button a'; 
    const HOVER_DEBOUNCE_TIME = 100; 
    
    let dayButtons = null; 
    let imageContainers = null; 
    let sec5 = null; 
    let activeDay = 'day18'; 
    let cleanupTimer = null; 
    let prevActiveContainerIds = []; 
    let currentlyActiveDayButton = null; 
    let hoverTimeout = null; 

    // ⚠️ window에 노출되는 전역 상태 변수 
    // 이 변수들은 RightBar 코드가 'activeDay'와 'activeLocation'을 결정하는 데 사용됩니다.
    window.activeDayStatus = 'day18';
    window.activeLocationStatus = '전체'; 

    // 5-3. 유틸리티 함수
    
    function isValidUrl(url) { 
        return url && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes('none'); 
    } 

    function calculateIndex(element) { 
        if (!element.parentNode) return -1; 
        const buttonWrappers = Array.from(element.parentNode.children).filter(child => child.classList.contains('elementor-widget-button')); 
        return buttonWrappers.indexOf(element.closest('.elementor-widget-button')); 
    } 

    function hideImageContainer(containerId) { 
        const con = document.getElementById(containerId); 
        if (con) { 
            con.classList.remove('is-visible', 'hover-overlay', 'config-1-item', 'config-2-item', 'config-3-item', 'config-4-item', 'is-loading', 'is-loaded'); 
            con.style.cssText = `display: none !important; background-image: none !important;`; 
            const imageNum = containerId.slice(-1); 
            for (let i = 1; i <= 3; i++) { 
                const heading = con.querySelector(`.image${imageNum}-${i} .elementor-heading-title`); 
                if (heading) heading.textContent = ''; 
            } 
            con.removeEventListener('mouseenter', handleMouseEnter); 
            con.removeEventListener('mouseleave', handleMouseLeave); 
        } 
    } 

    function updateImageContainer(targetImageId, backgroundUrl, textData) { 
        const targetCon = document.getElementById(targetImageId); 
        if (!targetCon) return; 

        const imageNum = targetImageId.slice(-1); 
        for (let i = 0; i < 3; i++) { 
            const heading = targetCon.querySelector(`.image${imageNum}-${i + 1} .elementor-heading-title`); 
            if (heading) heading.textContent = textData[i] || ''; 
        } 

        targetCon.style.cssText = `display: flex !important; background-image: url(${COMMON_PLACEHOLDER_URL}) !important;`; 
        targetCon.classList.add('is-visible', 'is-loading'); 
        targetCon.classList.remove('is-loaded');
        
        if (isValidUrl(backgroundUrl)) {
            const img = new Image();
            img.onload = () => {
                targetCon.style.cssText = `display: flex !important; background-image: url(${backgroundUrl}) !important;`; 
                targetCon.classList.remove('is-loading');
                targetCon.classList.add('is-loaded');
            };
            img.onerror = img.onabort = () => {
                targetCon.classList.remove('is-loading');
                targetCon.classList.add('is-loaded');
            };
            img.src = backgroundUrl;
        } else {
             targetCon.classList.remove('is-loading');
             targetCon.classList.add('is-loaded');
        }
    } 

    function injectPerformanceStyles() { 
        const style = document.createElement('style'); 
        style.textContent = `
            /* 배경 전환 로직 제거로 --new-bg-url 관련 스타일 제거 */
            #sec5::after { will-change: opacity; transition: opacity 0.7s ease; }
            .is-visible { will-change: transform, opacity; }
        `; 
        document.head.appendChild(style); 
    } 

    // 5-4. 이벤트 핸들러 (배경 전환 로직 삭제)
    
    // 호버 시 오버레이 클래스만 추가
    const handleMouseEnter = (event) => { 
        const hoveredImage = event.currentTarget; 
        if (!hoveredImage || !sec5) return; 
        
        if (hoverTimeout) clearTimeout(hoverTimeout); 
        
        // 기존 오버레이 제거 및 새 오버레이 추가
        document.querySelectorAll('.hover-overlay').forEach(el => el.classList.remove('hover-overlay')); 
        hoveredImage.classList.add('hover-overlay'); 

        // ❌ 배경 전환 관련 로직 삭제
    }; 

    // 호버 해제 시 오버레이 클래스만 제거
    const handleMouseLeave = (event) => { 
        if (!sec5) return; 
        
        if (hoverTimeout) clearTimeout(hoverTimeout); 

        if (event.currentTarget) { 
            event.currentTarget.classList.remove('hover-overlay'); 
        } 
        
        // ❌ 배경 전환 관련 cleanup 로직 삭제
    }; 

    function toggleAllImageHoverEffects(enable) { 
        const visibleImages = document.querySelectorAll('.is-visible'); 
        visibleImages.forEach(con => { 
            con.removeEventListener('mouseenter', handleMouseEnter); 
            con.removeEventListener('mouseleave', handleMouseLeave); 
            if (enable) { 
                con.addEventListener('mouseenter', handleMouseEnter); 
                con.addEventListener('mouseleave', handleMouseLeave); 
            } 
        }); 
        if (!enable && sec5) { 
            if (hoverTimeout) clearTimeout(hoverTimeout); 
            // ❌ 배경 전환 관련 클래스 제거 및 스타일 초기화 로직 삭제
        } 
    } 


    // 5-5. 핵심 로직 함수 
    function loadTimeButtonData(clickedBtnA) {
        const clickedWrapper = clickedBtnA.closest('.elementor-widget-button');
        if (!clickedWrapper) return;
        
        // 1. time-btn active 클래스 토글
        document.querySelectorAll(TIME_BTN_SELECTOR).forEach(btn => btn.classList.remove('active'));
        clickedBtnA.classList.add('active');
        
        // 2. 데이터 찾기
        const timeIndex = calculateIndex(clickedWrapper);
        const dayData = EVENT_DATA[activeDay];

        if (!dayData || timeIndex === -1 || !dayData[timeIndex] || !dayData[timeIndex].target) {
            toggleAllImageHoverEffects(false);
            prevActiveContainerIds.forEach(id => hideImageContainer(id));
            prevActiveContainerIds = [];

            window.activeLocationStatus = ''; 
            // 3. 라이트바 동기화를 위한 이벤트 발생
            document.dispatchEvent(new CustomEvent('sec5LocationUpdate', {
                detail: { activeDay: activeDay, activeLocation: '' }
            }));
            return;
        }

        const activeTargets = dayData[timeIndex].target;
        const activeLocationName = dayData[timeIndex].location; 
        window.activeLocationStatus = activeLocationName; 
        
        // 3. 라이트바 동기화를 위한 이벤트 발생 (성공 시)
        document.dispatchEvent(new CustomEvent('sec5LocationUpdate', {
            detail: { activeDay: activeDay, activeLocation: activeLocationName }
        }));

        // 4. 이미지 컨테이너 업데이트
        const newActiveContainerIds = activeTargets.map(data => data.id);
        
        prevActiveContainerIds.filter(id => !newActiveContainerIds.includes(id)).forEach(hideImageContainer);
        
        activeTargets.forEach(data => updateImageContainer(data.id, data.backgroundUrl, data.text)); 
        
        prevActiveContainerIds = newActiveContainerIds;
        
        // 5. 레이아웃 조정
        const itemCount = newActiveContainerIds.length;
        if (itemCount > 0) {
            const configClass = `config-${itemCount}-item`;
            newActiveContainerIds.forEach(id => {
                const con = document.getElementById(id);
                if (con) {
                    con.classList.remove('config-1-item', 'config-2-item', 'config-3-item', 'config-4-item');
                    con.classList.add(configClass);
                }
            });
            const imageCon = sec5?.querySelector('.imagecon');
            if (imageCon) {
                imageCon.style.gap = (itemCount === 4) ? '50px' : '100px';
            }
        }
        
        toggleAllImageHoverEffects(true);
    }

    function setActiveDay(clickedBtn) {
        if (currentlyActiveDayButton && currentlyActiveDayButton !== clickedBtn) {
            currentlyActiveDayButton.classList.remove('active');
            currentlyActiveDayButton.style.transform = 'scale(1)';

            const prevUnderline = currentlyActiveDayButton.querySelector('.js-underline');
            if (prevUnderline) {
                prevUnderline.remove();
            }

            const prevTextSpan = currentlyActiveDayButton.querySelector('.elementor-button-text');
            if (prevTextSpan) {
                prevTextSpan.style.setProperty('color', '#94a3b8', 'important');
            }
        }

        clickedBtn.classList.add('active');
        clickedBtn.style.transform = 'scale(1.2)';

        const activeTextSpan = clickedBtn.querySelector('.elementor-button-text');
        if (activeTextSpan) {
            activeTextSpan.style.setProperty('color', '#fef08a', 'important');
        }

        if (!clickedBtn.querySelector('.js-underline')) {
            const underline = document.createElement('span');
            underline.className = 'js-underline';
            underline.style.cssText = `
                content: ''; position: absolute; bottom: -8px; left: 50%;
                transform: translateX(-50%); width: 80%; height: 2px;
                background-color: #fef08a; box-shadow: 0 0 8px #fef08a;
                transition: width 0.3s ease;
            `;
            clickedBtn.appendChild(underline);
        }
        
        currentlyActiveDayButton = clickedBtn;

        const dayMatch = clickedBtn.id.match(/day(\d+)-btn/);
        activeDay = dayMatch ? `day${dayMatch[1]}` : 'day18';
        window.activeDayStatus = activeDay; 

        // 날짜 버튼 클릭 시, 기존 이미지 모두 숨기기
        prevActiveContainerIds.forEach(id => hideImageContainer(id));
        prevActiveContainerIds = [];
        toggleAllImageHoverEffects(false);
        
        // 라이트바 동기화를 위해 이벤트 발생 (날짜가 바뀌었음을 알림)
        document.dispatchEvent(new CustomEvent('sec5LocationUpdate', {
            detail: { activeDay: activeDay, activeLocation: '전체' }
        }));
    }

    // 5-6. 초기화 함수 (initialize)
    function initialize() {
        // 모든 day 버튼 ID를 명시적으로 나열하여 DOM 탐색
        dayButtons = document.querySelectorAll('#day18-btn, #day19-btn'); // 20~23일 버튼은 제거
        imageContainers = document.querySelectorAll('#image1, #image2, #image3, #image4');
        sec5 = document.getElementById('sec5');

        if (!sec5 || dayButtons.length === 0 || imageContainers.length === 0) {
            return;
        }

        injectPerformanceStyles();

        // 1. Day Button 이벤트 리스너
        dayButtons.forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                setActiveDay(this);
                
                // 날짜 버튼 클릭 시, 해당 날짜의 'timebtn1' (전체)를 자동으로 클릭
                const firstTimeButtonA = document.getElementById('timebtn1');
                if (firstTimeButtonA) {
                    // 주의: loadTimeButtonData를 직접 호출하여 실제 버튼 클릭 이벤트 버블링 방지
                    loadTimeButtonData(firstTimeButtonA); 
                    
                    // ⚠️ 라이트바 코드에서 이 이벤트를 직접 처리하므로, 여기서 updateRightBarForSec5 호출은 생략
                }
            });
        });

        // 2. Time Button 이벤트 리스너 (이벤트 위임)
        sec5.addEventListener('click', function(e) {
            const clickedBtnA = e.target.closest(TIME_BTN_SELECTOR);
            if (clickedBtnA) {
                e.preventDefault();
                loadTimeButtonData(clickedBtnA);
                
                // ⚠️ 라이트바 코드에서 이 이벤트를 직접 처리하므로, 여기서 updateRightBarForSec5 호출은 생략
            }
        });

        // 3. 초기 상태 설정
        imageContainers.forEach(con => {
            if (con.id) hideImageContainer(con.id);
        });

        let initialDayButton;
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDate = today.getDate();

        // 날짜 기준 초기 버튼 선택 (10월 19일 이후면 19일, 아니면 18일)
        if (currentMonth === 10 && currentDate >= 19) {
            initialDayButton = document.getElementById('day19-btn');
        } else {
            initialDayButton = document.getElementById('day18-btn');
        }
        
        if (!initialDayButton) {
            initialDayButton = document.getElementById('day18-btn') || dayButtons[0];
        }

        if (!initialDayButton) return;

        setActiveDay(initialDayButton);

        const firstTimeButtonA = document.getElementById('timebtn1');
        if (firstTimeButtonA) {
            // 초기 로딩 시 데이터 로드
            setTimeout(() => {
                loadTimeButtonData(firstTimeButtonA);
            }, 50); 
        }
    }

    // 최종 실행
    initialize();
})();

	
	
	
// =======================================================================
// 3. SEC6 CORE LOGIC (IFEE) - 수정된 코드
// =======================================================================

(function() {
    // 6-1. 필수 DOM 요소 캐싱
    const carousel = document.getElementById('cgcg');
    const main = document.getElementById('main-page-container');
    const t1Wrap = document.getElementById('main-title-element-1');
    const t2Wrap = document.getElementById('main-title-element-2');
    const btn = document.getElementById('slide-action-button');
    
    // 이 요소들은 상위 요소가 존재할 경우에만 탐색합니다.
    const slides = carousel?.querySelectorAll('.slide') || [];
    const t1 = t1Wrap?.querySelector('h2.elementor-heading-title');
    const t2 = t2Wrap?.querySelector('h2.elementor-heading-title');

    // --- 유효성 검사 시작 ---
    let isError = false; 

    if (!carousel) { console.warn("SEC6: 'cgcg' ID를 가진 캐러셀 요소를 찾을 수 없습니다."); isError = true; }
    if (!main) { console.warn("SEC6: 'main-page-container' ID를 가진 메인 컨테이너 요소를 찾을 수 없습니다."); isError = true; }
    if (!t1Wrap) { console.warn("SEC6: 'main-title-element-1' ID를 가진 제목 래퍼 요소를 찾을 수 없습니다."); isError = true; }
    if (!t2Wrap) { console.warn("SEC6: 'main-title-element-2' ID를 가진 제목 래퍼 요소를 찾을 수 없습니다."); isError = true; }
    if (!btn) { console.warn("SEC6: 'slide-action-button' ID를 가진 버튼 요소를 찾을 수 없습니다."); isError = true; }
    if (carousel && slides.length === 0) { console.warn("SEC6: 캐러셀 내부에 '.slide' 클래스를 가진 슬라이드 요소를 찾을 수 없습니다."); isError = true; }
    if (t1Wrap && !t1) { console.warn("SEC6: 'main-title-element-1' 내부에서 'h2.elementor-heading-title' 요소를 찾을 수 없습니다."); isError = true; }
    if (t2Wrap && !t2) { console.warn("SEC6: 'main-title-element-2' 내부에서 'h2.elementor-heading-title' 요소를 찾을 수 없습니다."); isError = true; }

    if (isError) {
        console.warn("SEC6: 캐러셀-마커 연동에 필요한 일부 요소를 찾지 못해 스크립트 실행을 중지합니다.");
        return;
    }

    // 6-2. 상태 객체 및 설정
    const state = {
        activeSlide: null,
        activeMarker: null
    }; 
    const USE_SAFE_LINEBREAK = true; 

    // 6-3. UI 업데이트 헬퍼 함수
    const setHeading = (el, htmlOrText) => {
        if (USE_SAFE_LINEBREAK) {
            const safe = (htmlOrText || '').replace(/\r\n|\r|\n/g, '<br>'); 
            el.innerHTML = safe;
        } else {
            el.innerHTML = htmlOrText || ''; 
        }
    };

    // ⭐️ 수정: ID를 받아 'place-01' 형식으로 마커를 찾도록 함
    const setActiveMarkerById = (formattedId) => {
        if (state.activeMarker) state.activeMarker.classList.remove('is-active-marker'); 
        if (!formattedId) {
            state.activeMarker = null;
            return;
        }
        // formattedId는 '01', '02' 형태의 두 자리 문자열로 가정
        const next = document.getElementById('place-' + formattedId); 
        if (next) {
            next.classList.add('is-active-marker');
            state.activeMarker = next;
        } else {
            state.activeMarker = null;
        } 
    };

    const preloadNext = (idx) => {
        const next = slides[idx + 1]; 
        if (!next) return;
        const u = next.dataset.backgroundUrl;
        if (u) {
            const im = new Image();
            im.src = u;
        } 
    };

    // 6-4. 모든 UI(배경, 텍스트, 버튼, 마커, RightBar)를 한 번에 업데이트하는 메인 함수
    const updateAll = (slideEl) => {
        const {
            backgroundUrl: bg,
            title1Text = '',
            title2Text = '',
            buttonUrl = '#',
            targetPlaceId 
        } = slideEl.dataset;
        
        // ⭐️ 핵심 수정: targetPlaceId를 항상 두 자리 문자열로 통일 ⭐️
        const formattedPlaceId = (targetPlaceId || '').padStart(2, '0');
        
        requestAnimationFrame(() => {
            if (bg) {
                main.style.backgroundImage = `url("${bg}")`;
                main.style.backgroundSize = 'cover'; 
                main.style.backgroundRepeat = 'no-repeat'; 
                main.style.backgroundPosition = 'center center'; 
            }
            setHeading(t1, title1Text);
            setHeading(t2, title2Text);
            btn.href = buttonUrl || '#';
            setActiveMarkerById(formattedPlaceId); // 포맷된 ID 사용
            
            // ⭐️ RightBar 동기화 호출 ⭐️
            if (window.updateRightBarForSec6) {
                window.updateRightBarForSec6(formattedPlaceId); // 포맷된 ID 전달
            }
        }); 
    };

    // 6-5. 슬라이드를 활성화하고 상태를 업데이트하는 함수
    const setActiveSlide = (next) => {
        if (!next || state.activeSlide === next) return; 

        if (state.activeSlide) state.activeSlide.classList.remove('is-active-slide');
        next.classList.add('is-active-slide');
        state.activeSlide = next;

        updateAll(next);

        const idx = Array.prototype.indexOf.call(slides, next);
        preloadNext(idx); 
    };

    // 6-6. Place ID와 슬라이드 요소를 매핑하는 맵(Map) 생성 (성능 최적화)
    const slideByPlaceId = (() => {
        const map = new Map();
        slides.forEach(s => {
            const pid = s.dataset.targetPlaceId;
            // ⭐️ 수정: Map에 저장할 때도 ID를 두 자리 문자열로 통일 ⭐️
            const formattedPid = (pid || '').padStart(2, '0');
            if (formattedPid) map.set(formattedPid, s); 
        });
        return map;
    })(); 

    // 6-7. 이벤트 리스너 바인딩
    const bindMarkerClicks = () => {
        const markers = document.querySelectorAll('.place-marker'); 
        markers.forEach(mk => {
            mk.addEventListener('click', () => {
                const id = mk.id?.replace(/^place-/, ''); 
                // ⭐️ 수정: 마커 클릭 시에도 ID를 두 자리 문자열로 통일 ⭐️
                const formattedId = (id || '').padStart(2, '0');
                const slide = formattedId ? slideByPlaceId.get(formattedId) : null;
                if (slide) setActiveSlide(slide);
            }, {
                passive: true
            }); 
        }); 
    };

    // 6-8. 초기화
    (function preloadCurrent() {
        const u = slides[0]?.dataset.backgroundUrl;
        if (u) {
            const im = new Image();
            im.src = u;
        } 
    })();

    setActiveSlide(slides[0]);

    // 6-8-3. 캐러셀 영역에 클릭 이벤트 위임 (슬라이드 클릭으로 전환)
    carousel?.addEventListener('click', (e) => {
        const target = e.target.closest('.slide');
        if (target && carousel.contains(target)) setActiveSlide(target);
    }, {
        passive: true
    }); 

    // 6-8-4. 마커와 슬라이드 연동 활성화
    bindMarkerClicks(); 
})();

	
	
	
	

    
  // ===================================================================
// SEC7 코드: Swiper.js 커스텀 페이지네이션 로직 (중첩 괄호 제거 및 범위 제한)
// ===================================================================
(function() {
    // 7-1. 필수 요소 조회 및 유효성 검사 (범위를 .ssec7로 제한)
    var containerEl = document.querySelector('.ssec7'); // 📌 범위 컨테이너 추가
    
    if (!containerEl) {
        console.warn('[Pagination] .ssec7 컨테이너를 찾지 못했습니다. SEC7 코드를 실행하지 않습니다.');
        return;
    }

    // 컨테이너 내부에서 요소 찾기
    var swiperEl = containerEl.querySelector('.swiper'); 
    var paginationContainer = containerEl.querySelector('.swiper-pagination');

    if (!swiperEl || !paginationContainer) {
        console.error('[Pagination] 필수 요소(.swiper, .swiper-pagination)를 .ssec7 내에서 찾지 못했습니다.');
        return;
    }

    // 7-2. 설정 및 상태 변수
    // :scope는 swiperEl 내부에서만 검색하도록 보장합니다.
    var originalSlides = swiperEl.querySelectorAll(':scope .swiper-slide:not(.swiper-slide-duplicate)');
    var originalSlideCount = originalSlides.length;
    var barsPerSlide = 5; // 슬라이드 1개당 표시할 막대 개수
    var lastRange = {
        start: -1,
        end: -1
    }; // 마지막 활성 범위를 캐싱하여 불필요한 DOM 업데이트 방지 

    // 7-3. 페이지네이션 막대(bar)를 동적으로 생성하는 함수 (변경 없음)
    function buildBars() {
        paginationContainer.innerHTML = ''; 

        // 웹 접근성 속성 설정
        paginationContainer.setAttribute('role', 'tablist');
        paginationContainer.setAttribute('aria-label', '콘텐츠 진행 상태');

        var totalBars = originalSlideCount * barsPerSlide;
        var frag = document.createDocumentFragment(); // DocumentFragment를 사용하여 DOM 추가 성능 최적화
        for (var i = 0; i < totalBars; i++) { 
            var bar = document.createElement('div');
            bar.className = 'pagination-bar'; 
            bar.setAttribute('role', 'tab');
            bar.setAttribute('tabindex', '-1');
            bar.setAttribute('aria-selected', 'false'); 

            // 각 막대에 클릭 시 해당 슬라이드로 이동하는 이벤트 추가
            (function(barIndex) {
                bar.addEventListener('click', function() {
                    var slideIndex = Math.floor(barIndex / barsPerSlide);
                    // 전역 변수 'swiper' 대신, 현재 스코프의 'swiper' 인스턴스를 사용합니다.
                    if (swiper && typeof swiper.slideToLoop === 'function') { 
                        swiper.slideToLoop(slideIndex, 300); 
                    }
                });
            })(i); 
            frag.appendChild(bar);
        }
        paginationContainer.appendChild(frag);
    }

    // 7-4. 모든 막대 요소를 가져오는 헬퍼 함수 (변경 없음)
    function getAllBars() {
        // paginationContainer 내부에서만 검색합니다.
        return paginationContainer.querySelectorAll('.pagination-bar'); 
    }

    // 7-5. 활성 막대를 업데이트하는 함수 (최소 변경 적용) (변경 없음)
    function updateBars(swiperInstance) {
        if (!swiperInstance) return;

        var allBars = getAllBars(); 
        if (!allBars.length) return;

        var activeIndex = swiperInstance.realIndex || 0; 
        var startIndex = activeIndex * barsPerSlide;
        var endIndex = startIndex + barsPerSlide - 1; 

        if (startIndex === lastRange.start) return; 

        // 이전 활성 범위의 클래스와 속성을 제거
        if (lastRange.start >= 0) {
            for (var j = lastRange.start; j <= lastRange.end; j++) {
                var prevBar = allBars[j]; 
                if (prevBar) {
                    prevBar.classList.remove('active', 'active-start');
                    prevBar.setAttribute('aria-selected', 'false');
                    prevBar.setAttribute('tabindex', '-1'); 
                }
            }
        }

        // 새로운 활성 범위에 클래스와 속성을 추가
        for (var i = 0; i < barsPerSlide; i++) {
            var currentBar = allBars[startIndex + i]; 
            if (currentBar) {
                currentBar.classList.add('active');
                if (i === 0) currentBar.classList.add('active-start'); 
                currentBar.setAttribute('aria-selected', 'true');
                // 첫 막대만 포커스 가능하게 하여 키보드 네비게이션 지원
                currentBar.setAttribute('tabindex', i === 0 ? '0' : '-1'); 
            }
        }

        lastRange.start = startIndex;
        lastRange.end = endIndex; 
    }

    // 7-6. Swiper 인스턴스 생성 및 설정
    // .swiper 대신 swiperEl 변수(DOM 요소)를 직접 전달하여 범위 제한을 유지합니다.
    var swiper = new Swiper(swiperEl, {
        effect: 'slide',
        loop: true,
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        breakpoints: { // 반응형 설정 
            320: {
                slidesPerView: 1.5
            },
            580: {
                slidesPerView: 2
            },
            767: {
                slidesPerView: 3
            },
            992: {
                slidesPerView: 3.5
            },
            1200: {
                slidesPerView: 4
            },
            1400: {
                slidesPerView: 4.5
            }
        },
        on: { // Swiper 이벤트 핸들러
            init: function() {
                // swiperEl 내부에서 다시 슬라이드 개수를 확인합니다.
                var freshOriginal = swiperEl.querySelectorAll(':scope .swiper-slide:not(.swiper-slide-duplicate)'); 
                originalSlideCount = freshOriginal.length;
                buildBars(); // 막대 생성
                updateBars(this); // 초기 활성 막대 업데이트
            },
            slideChange: function() {
                updateBars(this); // 슬라이드 변경 시 막대 업데이트
            },
            resize: function() {
                updateBars(this); // 창 크기 변경 시 막대 업데이트 
            }
        }
    });

    // 7-7. 키보드 접근성 향상 (화살표 키로 슬라이드 전환) (변경 없음)
    paginationContainer.addEventListener('keydown', function(e) {
        if (!swiper) return;
        if (e.key === 'ArrowRight') {
            swiper.slideNext();
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            swiper.slidePrev();
            e.preventDefault();
        }
  });
    })();


// =================================================================== 
// SEC8 코드: 날짜/시간별 이벤트 정보 표시 로직 (배경 전환 기능 제거)
// =================================================================== 
(function() {
    // ----------------------------------------------------------------------
    // 1. DOM 요소 캐싱 및 상태 변수 초기화
    // ----------------------------------------------------------------------
    const rightBar = document.getElementById('rightBar');
    const scrollableItems = rightBar.querySelectorAll('.nav-item[data-scroll-to]');
    
    const SECTION_MAP = {
        'sec1-wrapper': '1',
        'sec2-container': '2',
        'sec3334': '3',
        'sec4': '4',
        'sec6': '5', // 위치 안내 (Group 5)
        'sec7': '6'  // 아카이브 (Group 6)
    };
    const sections = document.querySelectorAll(Object.keys(SECTION_MAP).map(cls => `.${cls}`).join(', '));

    let currentActiveGroupId = null;
    let isScrollingByClick = false; 
    
    // ⭐️ 1초 동안 외부 강제 동기화 차단 플래그
    let allowExternalSync = false; 

    // ----------------------------------------------------------------------
    // 2. 중앙 집중식 네비게이션 업데이트 함수
    // ----------------------------------------------------------------------
    function updateActiveNav(targetGroupId, forceUpdate = false) {
        
        // ⭐️ 1초 차단 로직: Group 4 (targetGroupId === '4') 및 Group 5 강제 활성화 차단
        if (forceUpdate && !allowExternalSync && (targetGroupId === '4' || targetGroupId === '5')) {

            return;
        }

        if (!forceUpdate && targetGroupId === currentActiveGroupId) {
            // Group 3 호버 충돌 방지를 위해, Group 3 강제 업데이트 시에는 중복이어도 진행 허용
            if (targetGroupId !== '3') {
                return;
            }
        }


        // 이전 그룹 비활성화
        const prevGroup = rightBar.querySelector(`.nav-group[data-group="${currentActiveGroupId}"]`);
        prevGroup?.classList.remove('active');
        prevGroup?.querySelectorAll('.active, .active-sub').forEach(el => el.classList.remove('active', 'active-sub')); 

        // 새 그룹 활성화
        const targetGroup = rightBar.querySelector(`.nav-group[data-group="${targetGroupId}"]`);
        if (targetGroup) {
            targetGroup.classList.add('active');
            targetGroup.querySelector('.nav-item')?.classList.add('active');

            // 그룹 4 (프로그램 안내) 초기 활성화 (18일(토) 전체)
            if (targetGroupId === '4' && !forceUpdate) {
                const defaultDay = targetGroup.querySelector('.sub-nav-parent[data-sub-group="4-1"]');
                const defaultNestedItem = defaultDay?.querySelector('.sub-nav-nested-item:first-child');
                
                if(defaultDay) defaultDay.classList.add('active', 'active-sub');
                if(defaultNestedItem) defaultNestedItem.classList.add('active');
       
            }  
            // 그룹 5 (위치 안내) 초기 활성화
            else if (targetGroupId === '5' && !forceUpdate) {
                 targetGroup.querySelector('.sub-nav-item:first-child')?.classList.add('active');
            }
            // 그룹 3 (달빛야행 소개) 초기 활성화
            else if (targetGroupId === '3' && !forceUpdate) {
                targetGroup.querySelector('.sub-nav-item:first-child')?.classList.add('active');
            }
        }
        
        currentActiveGroupId = targetGroupId;
    }

    // ----------------------------------------------------------------------
    // 3. Intersection Observer 설정 (스크롤 스파이)
    // ----------------------------------------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -79% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        if (isScrollingByClick) return;
        
        // 스크롤이 100px 미만일 때는 Group 1 외의 다른 그룹으로 변경을 허용하지 않음 (스크롤 보호)
        if (window.scrollY < 100) { 
            if (currentActiveGroupId !== '1') {
                updateActiveNav('1');
            }
            return; 
        }

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const intersectingClass = Object.keys(SECTION_MAP).find(cls => entry.target.classList.contains(cls));
                if (intersectingClass) {
                    const groupId = SECTION_MAP[intersectingClass];
                    updateActiveNav(groupId);
                }
            }
        });
    }, observerOptions);
    
    // Observer 등록
    sections.forEach(section => sectionObserver.observe(section));


    // ----------------------------------------------------------------------
    // 4. 그룹별 외부 동기화 함수들 정의 및 이벤트 리스너
    // ----------------------------------------------------------------------
    
    // Group 5(위치 안내) 외부 동기화 (SEC6)
    window.updateRightBarForSec6 = (placeId) => {
     
        const group5 = rightBar.querySelector('.nav-group[data-group="5"]');
        if (!group5) return;
        updateActiveNav('5', true); 
        const safePlaceId = String(placeId).padStart(2, '0');
        group5.querySelectorAll('.sub-nav-item.active').forEach(item => item.classList.remove('active'));
        const targetItem = group5.querySelector(`.sub-nav-item[data-place-id="place-${safePlaceId}"]`);
        targetItem?.classList.add('active');
        const slideBtnId = targetItem?.dataset.slideBtn;
        if (slideBtnId) {
            document.getElementById(slideBtnId)?.click();
        }
    };

    /**
     * Group 4(프로그램 안내) 외부 동기화 핵심 함수 (SEC5).
     */
    window.updateRightBarForSec5 = (currentDay, locationName) => {
  
        
        const group4 = rightBar.querySelector('.nav-group[data-group="4"]');
        if (!group4) return;
        updateActiveNav('4', true); // 그룹 4를 강제 활성화

        group4.querySelectorAll('.sub-nav-parent.active, .sub-nav-nested-item.active').forEach(el => {
            el.classList.remove('active', 'active-sub');
        });
        
        const isDay18 = currentDay === 'day18';
        const daySubGroup = isDay18 ? '4-1' : '4-2';
        const dayParent = group4.querySelector(`.sub-nav-parent[data-sub-group="${daySubGroup}"]`);
        
        if (dayParent) {
            dayParent.classList.add('active', 'active-sub'); 
            const targetItem = Array.from(dayParent.querySelectorAll('.sub-nav-nested-item')).find(item => item.textContent.includes(locationName));
            
            if (targetItem) {
                targetItem.classList.add('active'); 
            }
        }
    }
    
    // ⭐️ Group 3 (달빛야행 소개) 본문 호버 시 좌측 메뉴 활성화 (수정됨)
    const subNavGroup3 = rightBar.querySelector('.nav-group[data-group="3"]');
    if (subNavGroup3) {
        const subNavItems = subNavGroup3.querySelectorAll('.sub-nav-item');
        const sec3Cards = [
            { selector: '.sec2-1-1', item: subNavItems[0] }, // 공연
            { selector: '.sec2-1-2', item: subNavItems[1] }, // 체험
            { selector: '.sec2-1-3', item: subNavItems[2] }  // 야행
        ];

        sec3Cards.forEach(card => {
            const cardElement = document.querySelector(card.selector);
            if (cardElement && card.item) {
                cardElement.addEventListener('mouseenter', () => {
                    // Group 3을 강제 활성화 (중복 호출되어도 진행, 중복 방지 로직 우회)
                    updateActiveNav('3', true); 
                    
                    // 모든 서브 아이템 비활성화 후 현재 호버한 아이템만 활성화
                    subNavItems.forEach(el => el.classList.remove('active'));
                    card.item.classList.add('active'); 
                });
                
                cardElement.addEventListener('mouseleave', () => {
                    // 마우스를 뗄 때 서브 아이템만 비활성화 (Group 3 자체는 활성 유지하여 깜빡임 방지)
                    card.item.classList.remove('active');
                });
            }
        });
    }

    // 7. SEC5 Custom Event 수신 및 동기화 처리
    document.addEventListener('sec5LocationUpdate', (event) => {
        const { activeDay, activeLocation } = event.detail;
        if (window.updateRightBarForSec5) {
            window.updateRightBarForSec5(activeDay, activeLocation);
        }
    });

    // ----------------------------------------------------------------------
    // 5. 대메뉴 클릭 이벤트 핸들러 (스크롤 이동만)
    // ----------------------------------------------------------------------
    scrollableItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const scrollTarget = parseInt(item.dataset.scrollTo);
            isScrollingByClick = true;
            const parentGroup = item.closest('.nav-group');
            const groupId = parentGroup?.dataset.group;

            if (groupId) {
                updateActiveNav(groupId, true);
                parentGroup.querySelector('.nav-item')?.classList.add('active');
            }

            window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
            // 스크롤이 끝난 후 isScrollingByClick 상태를 해제하여 Observer가 다시 작동하도록 허용
            setTimeout(() => { isScrollingByClick = false; }, 900);
        });
    });
    
    // ----------------------------------------------------------------------
    // 6. ⭐️ 페이지 로드 시 초기 상태 설정 및 1초 타이머
    // ----------------------------------------------------------------------
    // 1. 페이지 로드 시 무조건 Group 1 활성화
    updateActiveNav('1'); 


    // 2. 1초 후에 외부 동기화를 허용합니다. (Group 4/5 강제 활성화 차단 해제)
    setTimeout(() => {
        allowExternalSync = true;
   
    }, 1000); // 1초

    })();


         });
  
