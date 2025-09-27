(function() {
    // ----------------------------------------------------------------------
    // ★ 1. 통합된 데이터 구조 (EVENT_DATA) - 메모리 기반 데이터
    // ----------------------------------------------------------------------
    const COMMON_PLACEHOLDER_URL = 'http://asanmoonlight.com/wp-content/uploads/2025/09/자산-27250922.svg';

    const EVENT_DATA = {
        'day18': [
            // 버튼 1 (인덱스 0)
            {
                target: [
                    { id: 'image1', backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_잔디광장_전통국악_경기음악연구회-scaled.webp', text: ['경기음악연구회', '전통 국악', '17:40~18:10'] },
                    { id: 'image2', backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_잔디광장_장고춤살풀이_유미자무용단.webp', text: ['유미자무용단', '장고춤,살풀이', '17:40~18:10'] },
                    { id: 'image3', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['다도체험', '체험', '상시운영'] }
                ]
            },
            // 버튼 2 (인덱스 1)
            {
                target: [
                    { id: 'image1', backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_고택_전통국악_이형환-scaled.webp', text: ['이형환(거문고)', '전통 국악', '16:00~16:30'] },
                    { id: 'image2', backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_고택_전통국악_삼현육각-scaled.webp', text: ['삼현육각', '전통 국악', '16:40~17:10'] }
                ]
            },
            // 버튼 3 (인덱스 2)
            {
                target: [
                    { id: 'image1', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['만들기 및 전통놀이', '체험', '15:00~21:00'] }
                ]
            },
            // 버튼 4 (인덱스 3)
            {
                target: [
                    { id: 'image1', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['베어트리체', '재즈밤', '17:30~18:00'] },
                    { id: 'image2', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['김수유, 김지호 듀오', '재즈밤', '18:20~18:50'] },
                    { id: 'image3', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['에오 트리오', '재즈밤', '19:10~19:40'] },
                    { id: 'image4', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['미디어파사드', '미디어아트', '17:50~21:00'] }
                ]
            },
            // 버튼 5 (인덱스 4)
            {
                target: [
                    { id: 'image1', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['성웅의 자취를 걷다', '야간 경관', '18:00~21:30'] }
                ]
            },
            // 버튼 6 (인덱스 5)
            {
                target: [
                    { id: 'image1', backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_충무문_퓨전국악_서울예대-연회부.webp', text: ['서울예대 연희부', '퓨전 국악', '18:00~18:30'] },
                    { id: 'image2', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['지역 예술인', '퓨전 국악', '18:40~19:10'] },
                    { id: 'image3', backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/18일_충무문_퓨전국악_중앙대학교국악관현악단-scaled.webp', text: ['중앙대학교 국악관현악단x오정해', '퓨전 국악', '19:20~20:30'] }
                ]
            }
        ],
        'day19': [
            // 버튼 1 (인덱스 0)
            {
                target: [
                    { id: 'image1', backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/19일_잔디광장_줄타기_예인집단-아재-scaled.webp', text: ['예인집단 아재', '줄타기', '17:00~17:30'] },
                    { id: 'image2', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['공간', '퓨전국악', '17:40~18:10'] },
                    { id: 'image3', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['다도체험', '체험', '상시운영'] }
                ]
            },
            // 버튼 2 (인덱스 1)
            {
                target: [
                    { id: 'image1', backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/19일_고택_전통국악_이용구-scaled.webp', text: ['이용구(대금)', '전통 국악', '16:00~16:30'] },
                    { id: 'image2', backgroundUrl: 'http://asanmoonlight.com/wp-content/uploads/2025/09/19일_고택_전통국악_경기시나위-scaled.webp', text: ['경기 시나위', '전통 국악', '16:40~17:10'] }
                ]
            },
            // 버튼 3 (인덱스 2)
            {
                target: [
                    { id: 'image1', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['만들기 및 전통놀이', '체험', '15:00~21:00'] }
                ]
            },
            // 버튼 4 (인덱스 3)
            {
                target: [
                    { id: 'image1', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['장차니 트리오', '재즈밤', '17:30~18:00'] },
                    { id: 'image2', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['올디 벗 구디', '재즈밤', '18:20~18:50'] },
                    { id: 'image3', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['전제덕 밴드', '재즈밤', '19:10~19:40'] },
                    { id: 'image4', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['미디어파사드', '미디어아트', '17:50~21:00'] }
                ]
            },
            // 버튼 5 (인덱스 4)
            {
                target: [
                    { id: 'image1', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['성웅의 자취를 걷다', '야간 경관', '18:00~21:30'] }
                ]
            },
            // 버튼 6 (인덱스 5)
            {
                target: [
                    { id: 'image1', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['무용', '무용', '18:00~18:30'] },
                    { id: 'image2', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['선문대 태권도단', '태권 검무', '18:40~19:10'] },
                    { id: 'image3', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['팝페라 이태경', '팝페라', '19:20~20:00'] },
                    { id: 'image4', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['디스이스잇', 'LED퍼포먼스', '20:00~20:30'] }
                ]
            }
        ],
        'day20': Array(6).fill(0).map(() => ({
            target: [
                { id: 'image1', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['20일의 첫 번째 제목', '20일의 첫 번째 설명.', '20일의 첫 번째 추가 라인.'] },
                { id: 'image2', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['20일의 두 번째 제목', '20일의 두 번째 설명.', '20일의 두 번째 추가 라인.'] },
                { id: 'image3', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['20일의 세 번째 제목', '20일의 세 번째 설명.', '20일의 세 번째 추가 라인.'] },
                { id: 'image4', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['20일의 네 번째 제목', '20일의 네 번째 설명.', '20일의 네 번째 추가 라인.'] }
            ]
        })),
        'day21': Array(6).fill(0).map(() => ({
            target: [
                { id: 'image1', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['21일의 첫 번째 제목', '21일의 첫 번째 설명.', '21일의 첫 번째 추가 라인.'] },
                { id: 'image2', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['21일의 두 번째 제목', '21일의 두 번째 설명.', '21일의 두 번째 추가 라인.'] },
                { id: 'image3', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['21일의 세 번째 제목', '21일의 세 번째 설명.', '21일의 세 번째 추가 라인.'] },
                { id: 'image4', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['21일의 네 번째 제목', '21일의 네 번째 설명.', '21일의 네 번째 추가 라인.'] }
            ]
        })),
        'day22': Array(6).fill(0).map(() => ({
            target: [
                { id: 'image1', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['22일의 첫 번째 제목', '22일의 첫 번째 설명.', '22일의 첫 번째 추가 라인.'] },
                { id: 'image2', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['22일의 두 번째 제목', '22일의 두 번째 설명.', '22일의 두 번째 추가 라인.'] },
                { id: 'image3', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['22일의 세 번째 제목', '22일의 세 번째 설명.', '22일의 세 번째 추가 라인.'] },
                { id: 'image4', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['22일의 네 번째 제목', '22일의 네 번째 설명.', '22일의 네 번째 추가 라인.'] }
            ]
        })),
        'day23': Array(6).fill(0).map(() => ({
            target: [
                { id: 'image1', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['23일의 첫 번째 제목', '23일의 첫 번째 설명.', '23일의 첫 번째 추가 라인.'] },
                { id: 'image2', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['23일의 두 번째 제목', '23일의 두 번째 설명.', '23일의 두 번째 추가 라인.'] },
                { id: 'image3', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['23일의 세 번째 제목', '23일의 세 번째 설명.', '23일의 세 번째 추가 라인.'] },
                { id: 'image4', backgroundUrl: COMMON_PLACEHOLDER_URL, text: ['23일의 네 번째 제목', '23일의 네 번째 설명.', '23일의 네 번째 추가 라인.'] }
            ]
        })),
    };

    // --- 2. 초기 요소 찾기 및 변수 설정 (Constants) ---
    const TIME_BTN_SELECTOR = '.elementor-widget-button a';
    const dayButtons = document.querySelectorAll('#day18-btn, #day19-btn, #day20-btn, #day21-btn, #day22-btn, #day23-btn');
    const imageContainers = document.querySelectorAll('#image1, #image2, #image3, #image4');
    const sec5 = document.getElementById('sec5');
    const timeBtnCon = document.getElementById('timebtncon'); 

    // --- 3. 상태 변수 ---
    let activeDay = 'day18';
    let cleanupTimer = null;

    // --- 4. 유틸리티 함수 ---

    function isValidUrl(url) {
        // 플레이스홀더를 포함하여 유효한 URL로 간주
        return url && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes('none'); 
    }

    function calculateIndex(element) {
        if (!element.parentNode) return -1;
        let index = -1;
        const children = Array.from(element.parentNode.children);
        const buttonWrappers = children.filter(child => child.classList.contains('elementor-widget-button'));

        for (let i = 0; i < buttonWrappers.length; i++) {
            if (buttonWrappers[i] === element) {
                index = i;
                break;
            }
        }
        return index;
    }

    function updateImageContainer(targetImageId, backgroundUrl, textData) {
        const targetCon = document.getElementById(targetImageId);
        if (!targetCon) return;

        targetCon.classList.remove('is-visible');
        targetCon.removeAttribute('style'); // 이전 인라인 스타일 제거

        const bgStyle = isValidUrl(backgroundUrl) ? `url(${backgroundUrl})` : 'none';
        
        targetCon.style.cssText = `
            display: flex !important;
            background-image: ${bgStyle};
            /* 배경 크기 관련 스타일은 CSS 파일에서만 제어함 (cover, no-repeat 등) */
        `;

        const imageNum = targetImageId.slice(-1);
        for (let i = 0; i < 3; i++) {
            const heading = targetCon.querySelector(`.image${imageNum}-${i + 1} .elementor-heading-title`);
            if (heading) {
                heading.textContent = textData[i] || '';
            }
        }
        targetCon.offsetHeight;
        targetCon.classList.add('is-visible');
    }

    function resetAllImageContainers() {
        imageContainers.forEach(con => {
            const id = con.id;
            const num = id.slice(-1);

            con.classList.remove('is-visible', 'hover-overlay', 'config-1-item', 'config-2-item', 'config-3-item', 'config-4-item');
            con.removeAttribute('style');
            
            con.style.cssText = 'display: none !important;';

            for (let i = 1; i <= 3; i++) {
                const heading = con.querySelector(`.image${num}-${i} .elementor-heading-title`);
                if (heading) {
                    heading.textContent = '';
                }
            }
        });

        if (cleanupTimer) {
            clearTimeout(cleanupTimer);
            cleanupTimer = null;
        }
        sec5.classList.remove('cross-fade');
    }

    const handleMouseEnter = (event) => {
        const hoveredImage = event.currentTarget;
        if (!hoveredImage || !sec5) return;

        if (cleanupTimer) {
            clearTimeout(cleanupTimer);
            cleanupTimer = null;
        }
        document.querySelectorAll('.hover-overlay').forEach(el => el.classList.remove('hover-overlay'));
        hoveredImage.classList.add('hover-overlay');

        const bgStyle = hoveredImage.style.backgroundImage;
        const urlMatch = bgStyle.match(/url\(['"]?(.*?)['"]?\)/i);
        const imageUrl = urlMatch ? urlMatch[1] : null;

        if (imageUrl && isValidUrl(imageUrl)) {
            sec5.style.setProperty('--new-bg-url', `url(${imageUrl})`);
            sec5.classList.add('cross-fade');
        }
    };

    const handleMouseLeave = (event) => {
        const hoveredImage = event.currentTarget;
        if (!hoveredImage || !sec5) return;

        hoveredImage.classList.remove('hover-overlay');
        
        // 700ms 딜레이 유지 (부드러운 전환)
        cleanupTimer = setTimeout(() => {
            sec5.classList.remove('cross-fade');
            sec5.style.setProperty('--new-bg-url', 'none');
            cleanupTimer = null;
        }, 700); // CSS transition 0.7s와 일치
    };

    function toggleAllImageHoverEffects(enable) {
        const currentImageContainers = document.querySelectorAll('#image1, #image2, #image3, #image4');

        currentImageContainers.forEach(con => {
            con.removeEventListener('mouseenter', handleMouseEnter);
            con.removeEventListener('mouseleave', handleMouseLeave);
            con.classList.remove('hover-overlay');
        });

        if (enable) {
            currentImageContainers.forEach(con => {
                if (con.classList.contains('is-visible') && con.style.backgroundImage !== 'none') {
                    con.addEventListener('mouseenter', handleMouseEnter);
                    con.addEventListener('mouseleave', handleMouseLeave);
                }
            });
        }

        if (!enable && sec5) {
            sec5.classList.remove('cross-fade');
            sec5.style.setProperty('--new-bg-url', 'none');
            if (cleanupTimer) {
                clearTimeout(cleanupTimer);
                cleanupTimer = null;
            }
        }
    }


    /**
     * 시간 버튼이 클릭되었을 때 데이터 로드를 처리하는 핵심 함수
     */
    function loadTimeButtonData(clickedBtnA) {

        const clickedWrapper = clickedBtnA.closest('.elementor-widget-button');
        if (!clickedWrapper) return;

        // 1. 버튼 활성화 및 SVG 애니메이션 제어
        document.querySelectorAll(TIME_BTN_SELECTOR).forEach(btn => {
            btn.classList.remove('active');

            const btnId = btn.id;
            const rAnim = document.getElementById(`anim-r-${btnId}`);
            const opacityAnim = document.getElementById(`anim-opacity-${btnId}`);
            if (rAnim && rAnim.beginElementAt) rAnim.beginElementAt(0);
            if (opacityAnim && opacityAnim.beginElementAt) opacityAnim.beginElementAt(0);
        });

        clickedBtnA.classList.add('active');

        const activeBtnId = clickedBtnA.id;
        const activeRAnim = document.getElementById(`anim-r-${activeBtnId}`);
        const activeOpacityAnim = document.getElementById(`anim-opacity-${activeBtnId}`);

        if (activeRAnim && activeOpacityAnim) {
            activeRAnim.beginElement();
            activeOpacityAnim.beginElement();
        }

        resetAllImageContainers();

        const timeIndex = calculateIndex(clickedWrapper);
        const dayData = EVENT_DATA[activeDay];

        if (!dayData || timeIndex === -1 || !dayData[timeIndex] || !dayData[timeIndex].target) {
            console.error(`[RUNTIME ERROR] Data loading failed. Day: ${activeDay}, Index: ${timeIndex}.`);
            toggleAllImageHoverEffects(false);
            return;
        }

        const activeTargets = dayData[timeIndex].target;
        let activeContainerIds = [];

        // 4. 데이터 추출 및 이미지 컨테이너 업데이트
        activeTargets.forEach(data => {
            updateImageContainer(data.id, data.backgroundUrl, data.text);
            activeContainerIds.push(data.id);
        });

        // 5. 로드된 항목 수에 따른 레이아웃 클래스 및 GAP 적용 (요청하신 핵심 로직)
        const itemCount = activeContainerIds.length;
        if (itemCount > 0) {
            const configClass = `config-${itemCount}-item`;

            imageContainers.forEach(con => { con.classList.remove('config-1-item', 'config-2-item', 'config-3-item', 'config-4-item'); });

            activeContainerIds.forEach(id => {
                const con = document.getElementById(id);
                if (con) {
                    con.classList.add(configClass);
                }
            });

            const imageCon = sec5.querySelector('.imagecon');
            if (imageCon) {
                // 💥💥💥 4개일 때 50px, 그 외 (3개 이하)일 때 100px 적용 💥💥💥
                if (itemCount === 4) {
                    imageCon.style.gap = '50px';
                } else {
                    imageCon.style.gap = '100px';
                }
            }
        }

        toggleAllImageHoverEffects(true);
    }


    /**
     * 일자 버튼 클릭 시 실행되며, 활성화 일자를 설정하고 UI를 정리합니다.
     */
    function setActiveDay(clickedBtn) {
        dayButtons.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');

        const dayMatch = clickedBtn.id.match(/day(\d+)-btn/);
        activeDay = (dayMatch && dayMatch[1]) ? 'day' + dayMatch[1] : 'day18';

        resetAllImageContainers();
        toggleAllImageHoverEffects(false);

        document.querySelectorAll(TIME_BTN_SELECTOR).forEach(btn => {
            btn.classList.remove('active');
            const btnId = btn.id;
            const rAnim = document.getElementById(`anim-r-${btnId}`);
            const opacityAnim = document.getElementById(`anim-opacity-${btnId}`);
            if (rAnim && rAnim.beginElementAt) rAnim.beginElementAt(0);
            if (opacityAnim && opacityAnim.beginElementAt) opacityAnim.beginElementAt(0);
        });
    }

    // --- 5. 이벤트 리스너 및 초기화 ---

    // 1. '일자' 버튼 클릭 이벤트 리스너
    dayButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            setActiveDay(this);

            const firstTimeButtonA = document.getElementById('timebtn1');
            if (firstTimeButtonA) {
                loadTimeButtonData(firstTimeButtonA);
            } else {
                console.warn("[INIT WARNING] Initial time button (ID #timebtn1) not found for auto-load.");
            }
        });
    });


    // 2. '시간' 버튼 클릭 이벤트 - 이벤트 위임
    if (sec5) {
        sec5.addEventListener('click', function(e) {
            const clickedBtnA = e.target.closest(TIME_BTN_SELECTOR);
            if (clickedBtnA) {
                e.preventDefault();
                loadTimeButtonData(clickedBtnA);
            }
        });
    }

    // 3. 초기화 실행 (IIFE 내부에서 바로 실행)
    (function initialize() {
        console.log("★★★★ JS Code Running Immediately (FINAL REVISION - Cover/Overflow) ★★★★");

        const performInitialSetup = () => {
            const initialDayButton = document.getElementById('day18-btn') || dayButtons[0];

            if (initialDayButton) {
                setActiveDay(initialDayButton);

                const firstTimeButtonA = document.getElementById('timebtn1');
                if (firstTimeButtonA) {
                    loadTimeButtonData(firstTimeButtonA);
                } else {
                    console.error("[INIT ERROR] Initial time button (ID #timebtn1) not found. Check HTML structure.");
                }
            } else {
                console.error("[INIT ERROR] Initial day button (#day18-btn) not found.");
            }
        };

        if (document.readyState === 'complete' || document.readyState !== 'loading') {
            performInitialSetup();
        } else {
            document.addEventListener('DOMContentLoaded', performInitialSetup);
        }
    })();
})();
