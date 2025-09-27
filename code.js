/**
 * ===================================================================
 * 통합 자바스크립트 파일
 * -------------------------------------------------------------------
 * 이 파일은 여러 섹션(sec1, sec4, sec5, sec6, sec7)에서 사용되는
 * 모든 JavaScript 코드를 하나로 통합한 버전입니다.
 * DOM 콘텐츠가 모두 로드된 후 스크립트가 실행되도록
 * 'DOMContentLoaded' 이벤트 리스너로 전체를 감쌌습니다.
 * ===================================================================
 */
document.addEventListener('DOMContentLoaded', function() {

    // ===================================================================
    // SEC1 코드: 메인 인터랙티브 애니메이션 (달 이동 및 빛 확산)
    // ===================================================================
    (function() {
        // 1-1. 애니메이션 흐름을 제어하는 상수들을 정의합니다.
        const ANIMATION_DURATION = 2000; // 전체 클릭 애니메이션 지속 시간 (ms)
        const END_TOP_VALUE = 25; // 달의 최종 top 위치 (%)
        const END_LEFT_VALUE = 80; // 달의 최종 left 위치 (%)
        const MOON_MOVE_DURATION_RATIO = 0.5; // 전체 애니메이션 중 달이 움직이는 시간의 비율 (50%)
        const LIGHT_SPREAD_START_POINT = 0.6; // 빛 확산이 시작되는 시점 (전체 애니메이션의 60%)
        const SCROLL_DISTANCE_VH = 0.3; // 스크롤 애니메이션이 일어나는 스크롤 거리 (화면 높이의 30%)
        const SCROLL_INSET_START = 25; // 스크롤 애니메이션 시작 시 clip-path의 inset 값 (%)

        // 1-2. 애니메이션에 사용될 DOM 요소들을 미리 찾아 변수에 할당(캐싱)합니다.
        //      - 이는 매번 DOM을 탐색하는 비용을 줄여 성능을 향상시킵니다.
        const clickArea = document.querySelector('#click-trigger-area');
        const moon = document.querySelector('.moon');
        const sec2 = document.querySelector('.sec2');
        const textBox1_white = document.querySelector('#sec1-textbox1-white');
        const textBox1_reveal = document.querySelector('#sec1-textbox1-reveal');
        const textBox2_white = document.querySelector('#sec1-textbox2-white');
        const textBox2_reveal = document.querySelector('#sec1-textbox2-reveal');
        const progressDisplay = document.querySelector('#progress-display');

        // 1-3. 필수 요소 검사 (널 가드)
        //      - 스크립트 실행에 반드시 필요한 요소가 없는 경우, 에러를 출력하고 즉시 실행을 중단합니다.
        if (!clickArea || !moon || !sec2) {
            console.error("SEC1: 필수 요소 중 일부를 찾을 수 없습니다.");
            return; // 
        }

        // 1-4. 애니메이션의 현재 상태를 추적하는 변수들입니다.
        let isAnimating = false; // 현재 클릭 애니메이션이 실행 중인지 여부
        let scrollAnimationStartPoint = null; // 스크롤 애니메이션이 시작되는 y-offset 위치 

        // 1-5. 이전 스타일 값을 저장하는 변수들 (성능 최적화)
        //      - 스타일을 업데이트하기 전에 이전 값과 비교하여, 실제 변경이 있을 때만 DOM에 접근합니다.
        //      - 이는 불필요한 리플로우/리페인트를 방지합니다.
        let lastMoonTop = null;
        let lastLightX = null; // 
        let lastLightRadius = null;
        let lastSec2ClipPath = null;
        let lastProgressText = '';

        // 1-6. 스크롤 제어 함수
        //      - 애니메이션 중 사용자의 스크롤을 막거나 허용하기 위해 body에 'no-scroll' 클래스를 토글합니다.
        function toggleScroll(enable) {
            document.body.classList.toggle('no-scroll', !enable); // 
        }

        // 1-7. 클릭 기반 애니메이션 시작 함수
        function startClickAnimation() {
            if (isAnimating) return; // 이미 애니메이션 중이면 중복 실행 방지
            isAnimating = true; // 

            toggleScroll(false); // 애니메이션 시작 시 스크롤 비활성화 
            clickArea.style.display = 'none';

            let startTime = null;

            function animate(currentTime) {
                if (!startTime) startTime = currentTime;
                const elapsedTime = currentTime - startTime; // 
                const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1); // 진행률 (0.0 ~ 1.0) 

                // 모든 시각적 업데이트를 이 함수 내에서 일괄 처리합니다.
                updateAnimations(progress);

                if (progress < 1) {
                    requestAnimationFrame(animate); // 애니메이션이 끝나지 않았으면 다음 프레임 요청 
                } else {
                    isAnimating = false; // 
                    scrollAnimationStartPoint = window.scrollY; // 스크롤 애니메이션 시작점 기록 
                    toggleScroll(true); // 애니메이션 종료 후 스크롤 활성화 
                    // 스크롤 애니메이션을 위한 이벤트 리스너를 '이 시점'에 등록합니다.
                    window.addEventListener('scroll', handleScrollAnimation); // 
                }
            }
            requestAnimationFrame(animate);
        }

        // 1-8. 스크롤 기반 애니메이션 처리 함수
        function handleScrollAnimation() {
            if (scrollAnimationStartPoint === null) return; // 

            // 읽기 작업: 현재 스크롤 위치와 목표 거리를 계산합니다.
            const distanceScrolled = window.scrollY - scrollAnimationStartPoint; // 
            const scrollAnimationDistance = window.innerHeight * SCROLL_DISTANCE_VH;

            // 스크롤 진행률을 0과 1 사이로 제한하여 계산합니다.
            const scrollProgress = Math.max(0, Math.min(1, distanceScrolled / scrollAnimationDistance)); // 

            // 쓰기 작업: 계산된 진행률에 따라 sec2의 clip-path 스타일을 업데이트합니다.
            const insetPercentage = SCROLL_INSET_START * (1 - scrollProgress); // 
            const roundedInset = insetPercentage.toFixed(3); // 미세한 값 변화로 인한 잦은 업데이트 방지 
            const newClipPath = `inset(0 ${roundedInset}% 0 ${roundedInset}% round 30px 30px 0 0)`; // 

            // 이전 값과 비교하여 변경되었을 때만 DOM을 업데이트합니다.
            if (newClipPath !== lastSec2ClipPath) {
                sec2.style.clipPath = newClipPath; // 
                lastSec2ClipPath = newClipPath;
            }
        }

        // 1-9. 모든 애니메이션 요소의 스타일을 업데이트하는 통합 함수
        //      - requestAnimationFrame 내에서 호출되어 모든 DOM 변경을 한 프레임에 처리합니다.
        function updateAnimations(progress) {
            const moonMoveProgress = Math.min(1, progress / MOON_MOVE_DURATION_RATIO); // 
            const startTop = 50,
                startLeft = 50;

            // 1-9-1. 달의 위치와 크기 업데이트
            const newTop = startTop + (END_TOP_VALUE - startTop) * moonMoveProgress; // 
            const newLeft = startLeft + (END_LEFT_VALUE - startLeft) * moonMoveProgress; // 
            if (newTop !== lastMoonTop) {
                moon.style.top = `${newTop}%`; // 
                moon.style.left = `${newLeft}%`;
                const newScale = 1 - (moonMoveProgress * 0.5);
                moon.style.transform = `translate(-50%, -50%) scale(${newScale})`;
                lastMoonTop = newTop; // 
            }

            // 1-9-2. 첫 번째 텍스트 상자(textBox1)의 투명도 업데이트
            const textBox1_opacity = 1 - moonMoveProgress; // 
            if (textBox1_white && textBox1_white.style.opacity != textBox1_opacity) {
                textBox1_white.style.opacity = textBox1_opacity; // 
                if (textBox1_reveal) textBox1_reveal.style.opacity = textBox1_opacity;
            }

            // 1-9-3. 빛 확산 효과 및 관련 요소(textBox2, sec2) 업데이트
            let lightX, lightY, lightRadius;
            if (progress >= 0.5) { // 달 이동이 끝나면 빛의 중심을 최종 위치에 고정
                lightX = END_LEFT_VALUE; // 
                lightY = END_TOP_VALUE;
            } else { // 달이 움직이는 동안은 빛의 중심이 달을 따라감
                lightX = newLeft; // 
                lightY = newTop;
            }

            if (progress >= LIGHT_SPREAD_START_POINT) { // 빛 확산 시작 시점 이후
                const revealProgress = (progress - LIGHT_SPREAD_START_POINT) / (1 - LIGHT_SPREAD_START_POINT); // 
                lightRadius = 30 + (revealProgress * 220); // 빛의 반지름을 점차 확대

                const textBox2_opacity = revealProgress; // 
                if (textBox2_white && textBox2_white.style.opacity != textBox2_opacity) {
                    textBox2_white.style.opacity = textBox2_opacity; // 
                    if (textBox2_reveal) textBox2_reveal.style.opacity = textBox2_opacity;
                    if (sec2) sec2.style.opacity = revealProgress; // 
                }
            } else { // 빛 확산 시작 시점 이전
                lightRadius = 30; // 
                if (textBox2_white && textBox2_white.style.opacity != 0) {
                    textBox2_white.style.opacity = 0; // 
                    if (textBox2_reveal) textBox2_reveal.style.opacity = 0;
                    if (sec2) sec2.style.opacity = 0; // 
                }
            }

            // 1-9-4. 계산된 빛의 위치와 반지름을 CSS 변수에 적용
            const roundedLightX = lightX.toFixed(2); // 
            const roundedLightY = lightY.toFixed(2);
            const roundedRadius = lightRadius.toFixed(2);

            if (roundedLightX !== lastLightX || roundedRadius !== lastLightRadius) {
                document.documentElement.style.setProperty('--light-x', `${roundedLightX}%`); // 
                document.documentElement.style.setProperty('--light-y', `${roundedLightY}%`);
                document.documentElement.style.setProperty('--light-radius', `${roundedRadius}%`);
                lastLightX = roundedLightX; // 
                lastLightRadius = roundedRadius;
            }

            // 1-9-5. 진행률 텍스트 업데이트 (1% 단위로 변경될 때만 갱신하여 성능 저하 방지)
            if (progressDisplay) {
                const currentProgressText = `Progress: ${Math.round(progress * 100)}%`; // 
                if (currentProgressText !== lastProgressText) {
                    progressDisplay.textContent = currentProgressText; // 
                    lastProgressText = currentProgressText;
                }
            }
        }

        // 1-10. 초기 설정 및 이벤트 리스너 등록
        clickArea.addEventListener('click', startClickAnimation); // 
        updateAnimations(0); // 페이지 로드 시 초기 상태(progress: 0)로 렌더링 
    })();


    // ===================================================================
    // SEC4 코드: 스크롤 기반 슬라이드 활성화 애니메이션
    // ===================================================================
    (function() {
        // 4-1. 애니메이션에 필요한 핵심 DOM 요소들을 선택합니다.
        const sectionContainer = document.querySelector('.scroll-container');
        const textBbContainer = document.querySelector('.text-bb');

        if (!sectionContainer) {
            console.warn('SEC4: 스크롤 애니메이션에 필요한 .scroll-container 요소를 찾을 수 없습니다.');
            return;
        }

        // 4-2. 상태 변수 및 설정을 정의합니다.
        let slides, textContents;
        let lastActiveIndex = -1; // 
        let ticking = false; // requestAnimationFrame 중복 실행 방지 플래그 
        let textBbHasActive = false;
        let vh, animationStart, animationEnd, animationDuration;

        // 4-3. 애니메이션 관련 값 계산 및 DOM 요소 재캐싱 함수
        //      - 창 크기가 변경될 때마다 호출되어 반응형으로 동작하도록 합니다.
        function setupAnimationDimensions() {
            vh = window.innerHeight;
            animationStart = vh; // 애니메이션 시작점 (화면 높이의 1배) 
            animationEnd = vh * 4; // 애니메이션 종료점 (화면 높이의 4배) 
            animationDuration = animationEnd - animationStart;

            slides = sectionContainer.querySelectorAll('.light-slide');
            textContents = document.querySelectorAll('.light-slide-content'); // 
            lastActiveIndex = -1;

            if (slides.length === 0) {
                console.warn('SEC4: .light-slide 요소를 찾을 수 없습니다.'); // 
            }
            if (slides.length !== textContents.length) {
                console.warn('SEC4: .light-slide와 .light-slide-content 요소의 개수가 일치하지 않습니다.'); // 
            }
        }

        // 4-4. 스크롤 위치에 따라 현재 활성화되어야 할 슬라이드를 결정하는 함수
        function handleAnimation() {
            const scrollY = -sectionContainer.getBoundingClientRect().top; // 
            let activeIndex = -1;

            if (scrollY > animationStart && scrollY < animationEnd) {
                const progress = (scrollY - animationStart) / animationDuration; // 
                activeIndex = Math.floor(progress * slides.length);
                activeIndex = Math.max(0, Math.min(activeIndex, slides.length - 1)); // 인덱스 범위를 벗어나지 않도록 보정 
            } else if (scrollY <= animationStart) {
                activeIndex = -1; // 
            } else if (scrollY >= animationEnd) {
                activeIndex = slides.length - 1; // 
            }

            // 활성 인덱스가 변경되었을 때만 DOM 업데이트를 수행합니다.
            if (activeIndex !== lastActiveIndex) {
                updateSlidesDOM(activeIndex); // 
                lastActiveIndex = activeIndex;
            }
        }

        // 4-5. 계산된 활성 인덱스에 따라 실제 DOM의 클래스를 변경하는 함수
        function updateSlidesDOM(activeIndex) {
            slides.forEach((slide, index) => {
                const content = textContents[index];
                const shouldBeActive = index <= activeIndex;

                if (shouldBeActive !== slide.classList.contains('is-active')) { // 
                    slide.classList.toggle('is-active', shouldBeActive);
                    if (content) {
                        content.classList.toggle('is-active', shouldBeActive);
                    }
                }
            }); // 

            const shouldBbBeActive = activeIndex >= 0;
            if (textBbContainer && shouldBbBeActive !== textBbHasActive) {
                textBbContainer.classList.toggle('has-active-slide', shouldBbBeActive); // 
                textBbHasActive = shouldBbBeActive;
            }
        }

        // 4-6. 스크롤 이벤트를 최적화하는 래퍼 함수
        //      - requestAnimationFrame을 사용하여 스크롤 이벤트가 과도하게 발생하는 것을 방지합니다.
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleAnimation();
                    ticking = false;
                }); // 
                ticking = true;
            }
        };

        // 4-7. 창 크기 변경 이벤트에 대응하는 디바운스된 핸들러
        //      - 리사이즈 이벤트가 끝난 후 한 번만 실행되도록 하여 성능을 확보합니다.
        let resizeTimer;
        const onResize = () => {
            clearTimeout(resizeTimer); // 
            resizeTimer = setTimeout(() => {
                setupAnimationDimensions();
                handleAnimation();
            }, 150); // 
        };

        // 4-8. 페이지 이탈 시 등록된 이벤트 리스너를 정리하는 함수
        //      - 메모리 누수를 방지합니다.
        function cleanup() {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onScroll); // 
            if (observer) {
                observer.disconnect(); // 
            }
        }

        // 4-9. 초기화 및 이벤트 리스너 설정
        setupAnimationDimensions();
        window.addEventListener('resize', onResize); // 
        window.addEventListener('beforeunload', cleanup);

        // 4-10. Intersection Observer를 사용하여 섹션이 화면에 보일 때만 스크롤 이벤트를 감지
        //       - 불필요한 스크롤 계산을 줄여 성능을 크게 향상시킵니다.
        const observerOptions = {
            rootMargin: '100px 0px 100px 0px',
            threshold: 0.01
        }; // 
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { // 섹션이 보일 때
                    window.addEventListener('scroll', onScroll, {
                        passive: true
                    });
                } else { // 섹션이 보이지 않을 때
                    window.removeEventListener('scroll', onScroll);
                }
            }); // 
        }, observerOptions);

        observer.observe(sectionContainer); // 
    })();


    // ===================================================================
    // SEC5 코드: 날짜/시간별 이벤트 정보 표시 로직
    // ===================================================================
    (function() {
        'use strict';

        // 5-1. 통합 데이터 구조 (EVENT_DATA)
        //      - 날짜별, 시간대별 이벤트 정보를 객체 형태로 중앙에서 관리합니다.
        const COMMON_PLACEHOLDER_URL = 'http://asanmoonlight.com/wp-content/uploads/2025/09/자산-27250922.svg';
       
    const EVENT_DATA = {
        'day18': [{
            target: [{
                id: 'image1',
                backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_잔디광장_전통국악_경기음악연구회-scaled.webp',
                text: ['경기음악연구회', '전통 국악', '17:40~18:10']
            }, {
                id: 'image2',
                backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_잔디광장_장고춤살풀이_유미자무용단.webp',
                text: ['유미자무용단', '장고춤,살풀이', '17:40~18:10']
            }, {
                id: 'image3',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['다도체험', '체험', '상시운영']
            }, ],
        }, {
            target: [{
                id: 'image1',
                backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_고택_전통국악_이형환-scaled.webp',
                text: ['이형환(거문고)', '전통 국악', '16:00~16:30']
            }, {
                id: 'image2',
                backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_고택_전통국악_삼현육각-scaled.webp',
                text: ['삼현육각', '전통 국악', '16:40~17:10']
            }, ],
        }, {
            target: [{
                id: 'image1',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['만들기 및 전통놀이', '체험', '15:00~21:00']
            }, ],
        }, {
            target: [{
                id: 'image1',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['베어트리체', '재즈밤', '17:30~18:00']
            }, {
                id: 'image2',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['김수유, 김지호 듀오', '재즈밤', '18:20~18:50']
            }, {
                id: 'image3',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['에오 트리오', '재즈밤', '19:10~19:40']
            }, {
                id: 'image4',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['미디어파사드', '미디어아트', '17:50~21:00']
            }, ],
        }, {
            target: [{
                id: 'image1',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['성웅의 자취를 걷다', '야간 경관', '18:00~21:30']
            }, ],
        }, {
            target: [{
                id: 'image1',
                backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_충무문_퓨전국악_서울예대-연회부.webp',
                text: ['서울예대 연희부', '퓨전 국악', '18:00~18:30']
            }, {
                id: 'image2',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['지역 예술인', '퓨전 국악', '18:40~19:10']
            }, {
                id: 'image3',
                backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_충무문_퓨전국악_중앙대학교국악관현악단-scaled.webp',
                text: ['중앙대학교 국악관현악단x오정해', '퓨전 국악', '19:20~20:30']
            }, ],
        }, ],
        'day19': [{
            target: [{
                id: 'image1',
                backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/19일_잔디광장_줄타기_예인집단-아재-scaled.webp',
                text: ['예인집단 아재', '줄타기', '17:00~17:30']
            }, {
                id: 'image2',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['공간', '퓨전국악', '17:40~18:10']
            }, {
                id: 'image3',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['다도체험', '체험', '상시운영']
            }, ],
        }, {
            target: [{
                id: 'image1',
                backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/19일_고택_전통국악_이용구-scaled.webp',
                text: ['이용구(대금)', '전통 국악', '16:00~16:30']
            }, {
                id: 'image2',
                backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/19일_고택_전통국악_경기시나위-scaled.webp',
                text: ['경기 시나위', '전통 국악', '16:40~17:10']
            }, ],
        }, {
            target: [{
                id: 'image1',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['만들기 및 전통놀이', '체험', '15:00~21:00']
            }, ],
        }, {
            target: [{
                id: 'image1',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['장차니 트리오', '재즈밤', '17:30~18:00']
            }, {
                id: 'image2',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['올디 벗 구디', '재즈밤', '18:20~18:50']
            }, {
                id: 'image3',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['전제덕 밴드', '재즈밤', '19:10~19:40']
            }, {
                id: 'image4',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['미디어파사드', '미디어아트', '17:50~21:00']
            }, ],
        }, {
            target: [{
                id: 'image1',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['성웅의 자취를 걷다', '야간 경관', '18:00~21:30']
            }, ],
        }, {
            target: [{
                id: 'image1',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['무용', '무용', '18:00~18:30']
            }, {
                id: 'image2',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['선문대 태권도단', '태권 검무', '18:40~19:10']
            }, {
                id: 'image3',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['팝페라 이태경', '팝페라', '19:20~20:00']
            }, {
                id: 'image4',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['디스이스잇', 'LED퍼포먼스', '20:00~20:30']
            }, ],
        }, ],
        'day20': Array(6).fill(0).map(() => ({
            target: [{
                id: 'image1',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['20일의 첫 번째 제목', '20일의 첫 번째 설명.', '20일의 첫 번째 추가 라인.']
            }, {
                id: 'image2',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['20일의 두 번째 제목', '20일의 두 번째 설명.', '20일의 두 번째 추가 라인.']
            }, {
                id: 'image3',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['20일의 세 번째 제목', '20일의 세 번째 설명.', '20일의 세 번째 추가 라인.']
            }, {
                id: 'image4',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['20일의 네 번째 제목', '20일의 네 번째 설명.', '20일의 네 번째 추가 라인.']
            }, ],
        })),
        'day21': Array(6).fill(0).map(() => ({
            target: [{
                id: 'image1',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['21일의 첫 번째 제목', '21일의 첫 번째 설명.', '21일의 첫 번째 추가 라인.']
            }, {
                id: 'image2',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['21일의 두 번째 제목', '21일의 두 번째 설명.', '21일의 두 번째 추가 라인.']
            }, {
                id: 'image3',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['21일의 세 번째 제목', '21일의 세 번째 설명.', '21일의 세 번째 추가 라인.']
            }, {
                id: 'image4',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['21일의 네 번째 제목', '21일의 네 번째 설명.', '21일의 네 번째 추가 라인.']
            }, ],
        })),
        'day22': Array(6).fill(0).map(() => ({
            target: [{
                id: 'image1',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['22일의 첫 번째 제목', '22일의 첫 번째 설명.', '22일의 첫 번째 추가 라인.']
            }, {
                id: 'image2',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['22일의 두 번째 제목', '22일의 두 번째 설명.', '22일의 두 번째 추가 라인.']
            }, {
                id: 'image3',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['22일의 세 번째 제목', '22일의 세 번째 설명.', '22일의 세 번째 추가 라인.']
            }, {
                id: 'image4',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['22일의 네 번째 제목', '22일의 네 번째 설명.', '22일의 네 번째 추가 라인.']
            }, ],
        })),
        'day23': Array(6).fill(0).map(() => ({
            target: [{
                id: 'image1',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['23일의 첫 번째 제목', '23일의 첫 번째 설명.', '23일의 첫 번째 추가 라인.']
            }, {
                id: 'image2',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['23일의 두 번째 제목', '23일의 두 번째 설명.', '23일의 두 번째 추가 라인.']
            }, {
                id: 'image3',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['23일의 세 번째 제목', '23일의 세 번째 설명.', '23일의 세 번째 추가 라인.']
            }, {
                id: 'image4',
                backgroundUrl: COMMON_PLACEHOLDER_URL,
                text: ['23일의 네 번째 제목', '23일의 네 번째 설명.', '23일의 네 번째 추가 라인.']
            }, ],
        })),
    };

        // 5-2. 초기 요소 및 상태 변수
        const TIME_BTN_SELECTOR = '.elementor-widget-button a'; // 
        let dayButtons = null;
        let imageContainers = null;
        let sec5 = null;
        let activeDay = 'day18'; // 현재 활성화된 날짜
        let cleanupTimer = null; // 호버 효과 정리 타이머
        let prevActiveContainerIds = []; // 이전에 활성화되었던 컨테이너 ID 목록 

        // 5-3. 유틸리티 함수
        // 5-3-1. URL 유효성 검사 함수
        function isValidUrl(url) {
            return url && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes('none'); // 
        }

        // 5-3-2. 클릭된 시간 버튼의 인덱스를 계산하는 함수
        function calculateIndex(element) {
            if (!element.parentNode) return -1; // 
            const buttonWrappers = Array.from(element.parentNode.children)
                .filter(child => child.classList.contains('elementor-widget-button'));
            return buttonWrappers.indexOf(element); // 
        }

        // 5-3-3. 특정 이미지 컨테이너를 숨기고 초기화하는 함수
        function hideImageContainer(containerId) {
            const con = document.getElementById(containerId); // 
            if (con) {
                con.classList.remove('is-visible', 'hover-overlay', 'config-1-item', 'config-2-item', 'config-3-item', 'config-4-item'); // 
                con.style.cssText = 'display: none !important;'; // 레이아웃에서 완전히 제거 
                // 텍스트 내용 초기화
                for (let i = 1; i <= 3; i++) {
                    const heading = con.querySelector(`.image${containerId.slice(-1)}-${i} .elementor-heading-title`); // 
                    if (heading) heading.textContent = ''; // 
                }
                // 등록된 이벤트 리스너 제거
                con.removeEventListener('mouseenter', handleMouseEnter); // 
                con.removeEventListener('mouseleave', handleMouseLeave);
            }
        }

        // 5-3-4. 데이터에 따라 이미지 컨테이너를 업데이트하고 표시하는 함수
        function updateImageContainer(targetImageId, backgroundUrl, textData) {
            const targetCon = document.getElementById(targetImageId); // 
            if (!targetCon) return;

            const bgStyle = isValidUrl(backgroundUrl) ? `url(${backgroundUrl})` : 'none'; // 
            targetCon.style.cssText = `display: flex !important; background-image: ${bgStyle};`; // 

            const imageNum = targetImageId.slice(-1);
            for (let i = 0; i < 3; i++) {
                const heading = targetCon.querySelector(`.image${imageNum}-${i + 1} .elementor-heading-title`); // 
                if (heading) heading.textContent = textData[i] || ''; // 
            }

            targetCon.offsetHeight; // 리플로우 강제 (CSS 트랜지션 활성화)
            targetCon.classList.add('is-visible'); // 
        }

        // 5-4. 이벤트 핸들러
        // 5-4-1. 이미지 컨테이너 마우스 진입(mouseenter) 핸들러
        const handleMouseEnter = (event) => {
            const hoveredImage = event.currentTarget; // 
            if (!hoveredImage || !sec5) return;

            if (cleanupTimer) clearTimeout(cleanupTimer); // 

            document.querySelectorAll('.hover-overlay').forEach(el => el.classList.remove('hover-overlay'));
            hoveredImage.classList.add('hover-overlay'); // 

            const bgStyle = hoveredImage.style.backgroundImage;
            const urlMatch = bgStyle.match(/url\(['"]?(.*?)['"]?\)/i); // 
            const imageUrl = urlMatch ? urlMatch[1] : null;

            if (imageUrl && isValidUrl(imageUrl)) {
                sec5.style.setProperty('--new-bg-url', `url(${imageUrl})`);
                sec5.classList.add('cross-fade'); // 
            }
        };

        // 5-4-2. 이미지 컨테이너 마우스 이탈(mouseleave) 핸들러
        const handleMouseLeave = () => {
            if (!sec5) return;
            // 
            cleanupTimer = setTimeout(() => {
                sec5.classList.remove('cross-fade');
                sec5.style.setProperty('--new-bg-url', 'none');
                cleanupTimer = null;
            }, 700); // 
        };

        // 5-4-3. 모든 이미지 호버 효과를 켜거나 끄는 함수
        function toggleAllImageHoverEffects(enable) {
            if (enable) {
                document.querySelectorAll('.is-visible').forEach(con => {
                    con.removeEventListener('mouseenter', handleMouseEnter); // 중복 등록 방지
                    con.removeEventListener('mouseleave', handleMouseLeave);
                    if (isValidUrl(con.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/i)?.[1])) { // 
                        con.addEventListener('mouseenter', handleMouseEnter);
                        con.addEventListener('mouseleave', handleMouseLeave);
                    }
                }); // 
            } else { // 호버 효과 비활성화
                if (sec5) {
                    sec5.classList.remove('cross-fade'); // 
                    sec5.style.setProperty('--new-bg-url', 'none');
                    if (cleanupTimer) clearTimeout(cleanupTimer); // 
                }
            }
        }

        // 5-5. 핵심 로직 함수
        // 5-5-1. 시간 버튼 클릭 시 데이터를 로드하고 화면을 갱신하는 함수
        function loadTimeButtonData(clickedBtnA) {
            const clickedWrapper = clickedBtnA.closest('.elementor-widget-button'); // 
            if (!clickedWrapper) return;

            // 모든 시간 버튼 비활성화 후 클릭된 버튼만 활성화
            document.querySelectorAll(TIME_BTN_SELECTOR).forEach(btn => btn.classList.remove('active')); // 
            clickedBtnA.classList.add('active');
            // (SVG 애니메이션 관련 코드는 원본 유지) 

            const timeIndex = calculateIndex(clickedWrapper); // 
            const dayData = EVENT_DATA[activeDay];

            // 데이터 로드 실패 시 예외 처리
            if (!dayData || timeIndex === -1 || !dayData[timeIndex]?.target) {
                console.error(`SEC5: Data loading failed. Day: ${activeDay}, Index: ${timeIndex}.`); // 
                toggleAllImageHoverEffects(false);
                prevActiveContainerIds.forEach(id => hideImageContainer(id)); // 이전 컨테이너 모두 숨김 
                prevActiveContainerIds = [];
                return;
            }

            const activeTargets = dayData[timeIndex].target;
            const newActiveContainerIds = activeTargets.map(data => data.id); // 

            // 효율적인 업데이트:
            // 1. 사라질 컨테이너 숨기기
            prevActiveContainerIds.filter(id => !newActiveContainerIds.includes(id)).forEach(hideImageContainer); // 
            // 2. 새 컨테이너 업데이트/표시
            activeTargets.forEach(data => updateImageContainer(data.id, data.backgroundUrl, data.text)); // 
            // 3. 현재 활성 컨테이너 ID 목록 갱신
            prevActiveContainerIds = newActiveContainerIds; // 

            // 활성화된 아이템 개수에 따라 레이아웃 클래스 및 스타일 적용
            const itemCount = newActiveContainerIds.length; // 
            if (itemCount > 0) {
                const configClass = `config-${itemCount}-item`; // 
                imageContainers.forEach(con => con.classList.remove('config-1-item', 'config-2-item', 'config-3-item', 'config-4-item')); // 
                newActiveContainerIds.forEach(id => document.getElementById(id)?.classList.add(configClass)); // 

                const imageCon = sec5?.querySelector('.imagecon'); // 
                if (imageCon) {
                    imageCon.style.gap = (itemCount === 4) ? '50px' : '100px'; // 아이템이 4개일 때만 간격 조정 
                }
            }
            toggleAllImageHoverEffects(true); // 
        }

        // 5-5-2. 날짜 버튼 클릭 시 상태를 변경하는 함수
        function setActiveDay(clickedBtn) {
            if (!dayButtons) return;

            dayButtons.forEach(btn => btn.classList.remove('active')); // 
            clickedBtn.classList.add('active');

            const dayMatch = clickedBtn.id.match(/day(\d+)-btn/);
            activeDay = dayMatch ? `day${dayMatch[1]}` : 'day18'; // 

            // 날짜 변경 시, 이전에 표시되던 모든 컨테이너를 숨깁니다.
            prevActiveContainerIds.forEach(id => hideImageContainer(id)); // 
            prevActiveContainerIds = [];

            toggleAllImageHoverEffects(false);

            // 시간 버튼들을 모두 비활성화 상태로 초기화합니다.
            document.querySelectorAll(TIME_BTN_SELECTOR).forEach(btn => btn.classList.remove('active')); // 
        }

        // 5-6. 초기화 함수
        function initialize() {
            console.log("★★★★ SEC5 JS Code Running ★★★★"); // 
            // DOM 요소 캐싱
            dayButtons = document.querySelectorAll('#day18-btn, #day19-btn, #day20-btn, #day21-btn, #day22-btn, #day23-btn'); // 
            imageContainers = document.querySelectorAll('#image1, #image2, #image3, #image4');
            sec5 = document.getElementById('sec5');

            if (!sec5 || dayButtons.length === 0 || imageContainers.length === 0) {
                console.error("SEC5: 초기화에 필요한 DOM 요소를 찾지 못했습니다."); // 
                return;
            }

            // 5-6-1. '날짜' 버튼 클릭 이벤트 리스너 설정
            dayButtons.forEach(btn => {
                btn.addEventListener('click', function(event) {
                    event.preventDefault();
                    setActiveDay(this); // 
                    const firstTimeButtonA = document.getElementById('timebtn1');
                    if (firstTimeButtonA) {
                        loadTimeButtonData(firstTimeButtonA); // 날짜 변경 후 첫 시간대 자동 로드 
                    }
                });
            });

            // 5-6-2. '시간' 버튼 클릭 이벤트 설정 (이벤트 위임)
            sec5.addEventListener('click', function(e) {
                const clickedBtnA = e.target.closest(TIME_BTN_SELECTOR);
                if (clickedBtnA) {
                    e.preventDefault();
                    loadTimeButtonData(clickedBtnA); // 
                }
            });

            // 5-6-3. 페이지 로드 시 초기 상태 설정
            // 모든 이미지 컨테이너를 강제로 숨긴 후 시작합니다.
            imageContainers.forEach(con => { // 
                if (con.id) hideImageContainer(con.id); // 
            });

            const initialDayButton = document.getElementById('day18-btn') || dayButtons[0];
            if (!initialDayButton) return; // 

            initialDayButton.classList.add('active'); // 첫 날짜를 활성화 

            const firstTimeButtonA = document.getElementById('timebtn1');
            if (firstTimeButtonA) {
                loadTimeButtonData(firstTimeButtonA); // 첫 날짜의 첫 시간대 데이터 로드 
            } else {
                console.error("SEC5: 초기 시간 버튼(#timebtn1)을 찾지 못했습니다."); // 
            }
        }

        initialize(); // 초기화 함수 실행
    })();


    // ===================================================================
    // SEC6 코드: 캐러셀과 지도 마커 연동 로직
    // ===================================================================
    (function() {
        // 6-1. 필수 DOM 요소 캐싱 및 유효성 검사
        const carousel = document.getElementById('cgcg');
        const main = document.getElementById('main-page-container');
        const t1Wrap = document.getElementById('main-title-element-1');
        const t2Wrap = document.getElementById('main-title-element-2');
        const btn = document.getElementById('slide-action-button');
        const slides = carousel?.querySelectorAll('.slide') || [];
        const t1 = t1Wrap?.querySelector('h2.elementor-heading-title');
        const t2 = t2Wrap?.querySelector('h2.elementor-heading-title');

        if (!carousel || !main || !t1 || !t2 || !btn || slides.length === 0) { // 
            console.warn("SEC6: 캐러셀-마커 연동에 필요한 요소를 찾을 수 없습니다.");
            return;
        }

        // 6-2. 상태 객체 및 설정
        const state = {
            activeSlide: null,
            activeMarker: null
        }; // 활성 슬라이드와 마커를 추적
        const USE_SAFE_LINEBREAK = true; // true일 경우, \n을 <br>로 안전하게 치환 

        // 6-3. UI 업데이트 헬퍼 함수
        // 6-3-1. 제목 텍스트 설정 함수 (줄바꿈 처리 포함)
        const setHeading = (el, htmlOrText) => {
            if (USE_SAFE_LINEBREAK) {
                const safe = (htmlOrText || '').replace(/\r\n|\r|\n/g, '<br>'); // 
                el.innerHTML = safe;
            } else {
                el.innerHTML = htmlOrText || ''; // 
            }
        };

        // 6-3-2. 지도 마커 활성화 함수 (성능 최적화: 이전 마커만 비활성화)
        const setActiveMarkerById = (id) => {
            if (state.activeMarker) state.activeMarker.classList.remove('is-active-marker'); // 
            if (!id) {
                state.activeMarker = null;
                return;
            }
            const next = document.getElementById('place-' + id);
            if (next) {
                next.classList.add('is-active-marker');
                state.activeMarker = next;
            } else {
                state.activeMarker = null;
            } // 
        };

        // 6-3-3. 다음 슬라이드의 배경 이미지를 미리 로드하는 함수
        const preloadNext = (idx) => {
            const next = slides[idx + 1]; // 
            if (!next) return;
            const u = next.dataset.backgroundUrl;
            if (u) {
                const im = new Image();
                im.src = u;
            } // 
        };

        // 6-4. 모든 UI(배경, 텍스트, 버튼, 마커)를 한 번에 업데이트하는 메인 함수
        //      - requestAnimationFrame으로 묶어 리페인트를 최소화합니다. 
        const updateAll = (slideEl) => {
            const {
                backgroundUrl: bg,
                title1Text = '',
                title2Text = '',
                buttonUrl = '#',
                targetPlaceId
            } = slideEl.dataset; // 
            requestAnimationFrame(() => {
                if (bg) main.style.backgroundImage = `url("${bg}")`;
                setHeading(t1, title1Text);
                setHeading(t2, title2Text);
                btn.href = buttonUrl || '#';
                setActiveMarkerById(targetPlaceId);
            }); // 
        };

        // 6-5. 슬라이드를 활성화하고 상태를 업데이트하는 함수
        const setActiveSlide = (next) => {
            if (!next || state.activeSlide === next) return; // 중복/무효 호출 방지 

            if (state.activeSlide) state.activeSlide.classList.remove('is-active-slide');
            next.classList.add('is-active-slide');
            state.activeSlide = next;

            updateAll(next);

            const idx = Array.prototype.indexOf.call(slides, next);
            preloadNext(idx); // 
        };

        // 6-6. Place ID와 슬라이드 요소를 매핑하는 맵(Map) 생성 (성능 최적화)
        //      - 마커 클릭 시 해당 슬라이드를 O(1) 시간 복잡도로 즉시 찾을 수 있습니다. 
        const slideByPlaceId = (() => {
            const map = new Map();
            slides.forEach(s => {
                const pid = s.dataset.targetPlaceId;
                if (pid) map.set(String(pid), s);
            });
            return map;
        })(); // 

        // 6-7. 이벤트 리스너 바인딩
        // 6-7-1. 모든 지도 마커에 클릭 이벤트를 바인딩하는 함수
        const bindMarkerClicks = () => {
            const markers = document.querySelectorAll('.place-marker'); // 
            markers.forEach(mk => {
                mk.addEventListener('click', () => {
                    const id = mk.id?.replace(/^place-/, '');
                    const slide = id ? slideByPlaceId.get(String(id)) : null;
                    if (slide) setActiveSlide(slide);
                }, {
                    passive: true
                });
            }); // 
        };

        // 6-8. 초기화
        // 6-8-1. 첫 번째 슬라이드 배경 이미지 우선 로드
        (function preloadCurrent() {
            const u = slides[0].dataset.backgroundUrl;
            if (u) {
                const im = new Image();
                im.src = u;
            } // 
        })();

        // 6-8-2. 첫 번째 슬라이드를 활성 상태로 표시
        setActiveSlide(slides[0]);

        // 6-8-3. 캐러셀 영역에 클릭 이벤트 위임 (슬라이드 클릭으로 전환)
        carousel.addEventListener('click', (e) => {
            const target = e.target.closest('.slide');
            if (target && carousel.contains(target)) setActiveSlide(target);
        }, {
            passive: true
        }); // 

        // 6-8-4. 마커와 슬라이드 연동 활성화
        bindMarkerClicks(); // 
    })();


    // ===================================================================
    // SEC7 코드: Swiper.js 커스텀 페이지네이션 로직
    // ===================================================================
    (function() {
        // 7-1. 필수 요소 조회 및 유효성 검사
        var swiperEl = document.querySelector('.swiper');
        var paginationContainer = document.querySelector('.swiper-pagination');

        if (!swiperEl || !paginationContainer) {
            console.error('[Pagination] 필수 요소(.swiper, .swiper-pagination)를 찾지 못했습니다.');
            return;
        }

        // 7-2. 설정 및 상태 변수
        var originalSlides = swiperEl.querySelectorAll(':scope .swiper-slide:not(.swiper-slide-duplicate)');
        var originalSlideCount = originalSlides.length;
        var barsPerSlide = 5; // 슬라이드 1개당 표시할 막대 개수
        var lastRange = {
            start: -1,
            end: -1
        }; // 마지막 활성 범위를 캐싱하여 불필요한 DOM 업데이트 방지 

        // 7-3. 페이지네이션 막대(bar)를 동적으로 생성하는 함수
        function buildBars() {
            paginationContainer.innerHTML = ''; // 

            // 웹 접근성 속성 설정
            paginationContainer.setAttribute('role', 'tablist');
            paginationContainer.setAttribute('aria-label', '콘텐츠 진행 상태');

            var totalBars = originalSlideCount * barsPerSlide;
            var frag = document.createDocumentFragment(); // DocumentFragment를 사용하여 DOM 추가 성능 최적화
            for (var i = 0; i < totalBars; i++) { // 
                var bar = document.createElement('div');
                bar.className = 'pagination-bar'; // 
                bar.setAttribute('role', 'tab');
                bar.setAttribute('tabindex', '-1');
                bar.setAttribute('aria-selected', 'false'); // 

                // 각 막대에 클릭 시 해당 슬라이드로 이동하는 이벤트 추가
                (function(barIndex) {
                    bar.addEventListener('click', function() {
                        var slideIndex = Math.floor(barIndex / barsPerSlide);
                        if (swiper && typeof swiper.slideToLoop === 'function') {
                            swiper.slideToLoop(slideIndex, 300); // 
                        }
                    });
                })(i); // 
                frag.appendChild(bar);
            }
            paginationContainer.appendChild(frag);
        }

        // 7-4. 모든 막대 요소를 가져오는 헬퍼 함수
        function getAllBars() {
            return paginationContainer.querySelectorAll('.pagination-bar'); // 
        }

        // 7-5. 활성 막대를 업데이트하는 함수 (최소 변경 적용)
        function updateBars(swiperInstance) {
            if (!swiperInstance) return;

            var allBars = getAllBars(); // 
            if (!allBars.length) return;

            var activeIndex = swiperInstance.realIndex || 0; // 'loop' 모드에서도 실제 인덱스를 가져옴 
            var startIndex = activeIndex * barsPerSlide;
            var endIndex = startIndex + barsPerSlide - 1; // 

            if (startIndex === lastRange.start) return; // 변경이 없으면 함수 종료

            // 이전 활성 범위의 클래스와 속성을 제거
            if (lastRange.start >= 0) {
                for (var j = lastRange.start; j <= lastRange.end; j++) {
                    var prevBar = allBars[j]; // 
                    if (prevBar) {
                        prevBar.classList.remove('active', 'active-start');
                        prevBar.setAttribute('aria-selected', 'false');
                        prevBar.setAttribute('tabindex', '-1'); // 
                    }
                }
            }

            // 새로운 활성 범위에 클래스와 속성을 추가
            for (var i = 0; i < barsPerSlide; i++) {
                var currentBar = allBars[startIndex + i]; // 
                if (currentBar) {
                    currentBar.classList.add('active');
                    if (i === 0) currentBar.classList.add('active-start'); // 첫 막대에 특별 클래스 추가 
                    currentBar.setAttribute('aria-selected', 'true');
                    // 첫 막대만 포커스 가능하게 하여 키보드 네비게이션 지원
                    currentBar.setAttribute('tabindex', i === 0 ? '0' : '-1'); // 
                }
            }

            lastRange.start = startIndex;
            lastRange.end = endIndex; // 마지막 활성 범위 갱신 
        }

        // 7-6. Swiper 인스턴스 생성 및 설정
        var swiper = new Swiper('.swiper', {
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
                    var freshOriginal = swiperEl.querySelectorAll(':scope .swiper-slide:not(.swiper-slide-duplicate)'); // 
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

        // 7-7. 키보드 접근성 향상 (화살표 키로 슬라이드 전환)
        paginationContainer.addEventListener('keydown', function(e) {
            if (!swiper) return;
            if (e.key === 'ArrowRight') {
                swiper.slideNext();
                e.preventDefault();
            } else if (e.key === 'ArrowLeft') {
                swiper.slidePrev();
                e.preventDefault();
            }
        }); // 
    })();

}); // End of 'DOMContentLoaded'