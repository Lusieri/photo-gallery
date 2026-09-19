/**
 * 개인 사진 전시회 인터랙션 스크립트 (app.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 상태 관리 변수
    let currentCategory = 'all';
    let currentViewMode = 'masonry'; // 'masonry' | 'walkthrough'
    let currentPhotoIndex = 0;
    let filteredPhotos = [...EXHIBITION_DATA.photos];
    let isAmbientPlaying = false;
    let audioCtx = null;
    let ambientGain = null;

    // 2. DOM 요소 참조
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const ambientToggleBtn = document.getElementById('ambientToggleBtn');
    const categoryFiltersContainer = document.getElementById('categoryFilters');
    const masonryContainer = document.getElementById('masonryContainer');
    const walkthroughContainer = document.getElementById('walkthroughContainer');
    const walkthroughTrack = document.getElementById('walkthroughTrack');
    const viewBtns = document.querySelectorAll('.view-btn');

    // 모달 관련 요소
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
    const lightboxNextBtn = document.getElementById('lightboxNextBtn');
    const panelSeries = document.getElementById('panelSeries');
    const panelTitle = document.getElementById('panelTitle');
    const panelStory = document.getElementById('panelStory');
    const metaYear = document.getElementById('metaYear');
    const metaLocation = document.getElementById('metaLocation');
    const exifCamera = document.getElementById('exifCamera');
    const exifLens = document.getElementById('exifLens');
    const exifFocal = document.getElementById('exifFocal');
    const exifAperture = document.getElementById('exifAperture');
    const exifShutter = document.getElementById('exifShutter');
    const exifIso = document.getElementById('exifIso');
    const btnLike = document.getElementById('btnLike');
    const likeCountSpan = document.getElementById('likeCount');
    const btnShare = document.getElementById('btnShare');

    // 방명록 관련 요소
    const guestbookForm = document.getElementById('guestbookForm');
    const guestNameInput = document.getElementById('guestName');
    const guestMsgInput = document.getElementById('guestMsg');
    const guestbookList = document.getElementById('guestbookList');
    const stampChips = document.querySelectorAll('.stamp-chip');
    let selectedStamp = "✨ 감동적이에요";

    // 토스트 알림 요소
    const toastNotice = document.getElementById('toastNotice');

    // =========================================================================
    // 초기화 및 전시 정보 바인딩
    // =========================================================================
    function init() {
        // 테마 로드
        initTheme();

        // 텍스트 정보 동적 주입
        document.title = `${EXHIBITION_DATA.info.title} - ${EXHIBITION_DATA.info.artist}`;
        document.getElementById('headerLogoTitle').textContent = EXHIBITION_DATA.info.title;
        document.getElementById('heroSubtitle').textContent = EXHIBITION_DATA.info.subtitle;
        document.getElementById('heroTitle').textContent = EXHIBITION_DATA.info.title;
        document.getElementById('heroStatement').textContent = EXHIBITION_DATA.info.artistBio;
        document.getElementById('heroPeriod').textContent = EXHIBITION_DATA.info.period;
        document.getElementById('heroArtist').textContent = EXHIBITION_DATA.info.artist;

        document.getElementById('artistCardName').textContent = EXHIBITION_DATA.info.artist;
        document.getElementById('artistCardBio').textContent = EXHIBITION_DATA.info.artistBio;
        document.getElementById('artistEmail').textContent = EXHIBITION_DATA.info.email;
        document.getElementById('artistInstagram').textContent = EXHIBITION_DATA.info.instagram;

        // 카테고리 탭 렌더링
        renderCategoryFilters();

        // 갤러리 렌더링
        renderGallery();

        // 방명록 렌더링
        renderGuestbook();

        // 이벤트 리스너 등록
        setupEventListeners();
    }

    // =========================================================================
    // 테마 관리 (Dark / Light)
    // =========================================================================
    function initTheme() {
        const savedTheme = localStorage.getItem('gallery_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('gallery_theme', newTheme);
        updateThemeIcon(newTheme);
        showToast(newTheme === 'light' ? '화이트 큐브 갤러리 모드로 전환되었습니다.' : '다크 룸 갤러리 모드로 전환되었습니다.');
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        themeToggleBtn.innerHTML = theme === 'dark' 
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
        themeToggleBtn.setAttribute('title', theme === 'dark' ? '화이트 큐브 모드로 보기' : '다크 룸 모드로 보기');
    }

    // =========================================================================
    // 카테고리 필터 렌더링
    // =========================================================================
    function renderCategoryFilters() {
        categoryFiltersContainer.innerHTML = '';
        EXHIBITION_DATA.categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${cat.id === currentCategory ? 'active' : ''}`;
            btn.textContent = cat.label;
            btn.dataset.category = cat.id;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = cat.id;
                filterAndRender();
            });
            categoryFiltersContainer.appendChild(btn);
        });
    }

    function filterAndRender() {
        if (currentCategory === 'all') {
            filteredPhotos = [...EXHIBITION_DATA.photos];
        } else {
            filteredPhotos = EXHIBITION_DATA.photos.filter(p => p.category === currentCategory);
        }
        renderGallery();
    }

    // =========================================================================
    // 갤러리 렌더링 (그리드 vs 워크스루)
    // =========================================================================
    function renderGallery() {
        renderMasonryView();
        renderWalkthroughView();
    }

    function renderMasonryView() {
        masonryContainer.innerHTML = '';
        if (filteredPhotos.length === 0) {
            masonryContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">전시된 작품이 없습니다.</div>`;
            return;
        }

        filteredPhotos.forEach((photo, index) => {
            const card = document.createElement('div');
            card.className = 'photo-card';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `${photo.title} 작품 상세보기`);

            const categoryName = getCategoryLabel(photo.category);

            card.innerHTML = `
                <div class="photo-image-wrap">
                    <span class="card-overlay-badge">${categoryName}</span>
                    <img src="${photo.src}" alt="${photo.title}" loading="lazy" onerror="this.onerror=null; this.src='${createOfflineArtSvg(photo.title, photo.fallbackColor)}';">
                </div>
                <div class="card-label">
                    <div>
                        <div class="card-title">${photo.title}</div>
                        <div class="card-location">${photo.location}</div>
                    </div>
                    <div class="card-year">${photo.year}</div>
                </div>
            `;

            card.addEventListener('click', () => openLightbox(index));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });

            masonryContainer.appendChild(card);
        });
    }

    function renderWalkthroughView() {
        walkthroughTrack.innerHTML = '';
        filteredPhotos.forEach((photo, index) => {
            const frameItem = document.createElement('div');
            frameItem.className = 'museum-frame-item';
            frameItem.innerHTML = `
                <div class="frame-spotlight">
                    <img src="${photo.src}" alt="${photo.title}" loading="lazy" onerror="this.onerror=null; this.src='${createOfflineArtSvg(photo.title, photo.fallbackColor)}';">
                </div>
                <div class="wall-plaque">
                    <div class="wall-plaque-title">${photo.title}</div>
                    <div class="wall-plaque-meta">${photo.location} · ${photo.year}</div>
                </div>
            `;
            frameItem.addEventListener('click', () => openLightbox(index));
            walkthroughTrack.appendChild(frameItem);
        });
    }

    function getCategoryLabel(catId) {
        const cat = EXHIBITION_DATA.categories.find(c => c.id === catId);
        return cat ? cat.label.split(' ')[0] : 'Artwork';
    }

    // 오프라인/이미지 로드 실패 시 아름다운 실루엣 캔버스 생성 SVG
    function createOfflineArtSvg(title, bgHex) {
        const bg = bgHex || '#1e222a';
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${bg}" />
                    <stop offset="100%" stop-color="#0b0c0e" />
                </linearGradient>
            </defs>
            <rect width="800" height="600" fill="url(#grad)" />
            <circle cx="400" cy="240" r="140" fill="none" stroke="rgba(212,175,55,0.25)" stroke-width="1.5" />
            <circle cx="400" cy="240" r="80" fill="none" stroke="rgba(255,255,255,0.15)" stroke-dasharray="4,4" />
            <line x1="200" y1="420" x2="600" y2="420" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            <text x="400" y="470" fill="#f2f3f5" font-family="'Cormorant Garamond', serif" font-size="28" text-anchor="middle" letter-spacing="2">${title}</text>
            <text x="400" y="510" fill="#d4af37" font-family="sans-serif" font-size="14" text-anchor="middle" letter-spacing="4">EXHIBITION ARCHIVE</text>
        </svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    // =========================================================================
    // 라이트박스 모달
    // =========================================================================
    function openLightbox(index) {
        currentPhotoIndex = index;
        const photo = filteredPhotos[currentPhotoIndex];
        if (!photo) return;

        lightboxImg.src = photo.src;
        lightboxImg.alt = photo.title;
        lightboxImg.classList.remove('zoomed');

        panelSeries.textContent = getCategoryLabel(photo.category);
        panelTitle.textContent = photo.title;
        panelStory.textContent = photo.description || '작품 설명이 준비 중입니다.';
        metaYear.textContent = photo.year;
        metaLocation.textContent = photo.location;

        // EXIF 데이터
        if (photo.exif) {
            exifCamera.textContent = photo.exif.camera || '-';
            exifLens.textContent = photo.exif.lens || '-';
            exifFocal.textContent = photo.exif.focal || '-';
            exifAperture.textContent = photo.exif.aperture || '-';
            exifShutter.textContent = photo.exif.shutter || '-';
            exifIso.textContent = photo.exif.iso || '-';
        }

        // 좋아요 상태
        updateLikeStatus(photo.id);

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.classList.remove('zoomed');
    }

    function nextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % filteredPhotos.length;
        openLightbox(currentPhotoIndex);
    }

    function prevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
        openLightbox(currentPhotoIndex);
    }

    // 좋아요 관리
    function updateLikeStatus(photoId) {
        const isLiked = localStorage.getItem(`gallery_liked_${photoId}`) === 'true';
        let count = parseInt(localStorage.getItem(`gallery_like_count_${photoId}`) || '14', 10);
        
        if (isLiked) {
            btnLike.classList.add('liked');
            btnLike.querySelector('svg').setAttribute('fill', '#ff5e7e');
        } else {
            btnLike.classList.remove('liked');
            btnLike.querySelector('svg').setAttribute('fill', 'none');
        }
        likeCountSpan.textContent = count;
    }

    function toggleLike() {
        const photo = filteredPhotos[currentPhotoIndex];
        if (!photo) return;
        
        const isLiked = localStorage.getItem(`gallery_liked_${photo.id}`) === 'true';
        let count = parseInt(localStorage.getItem(`gallery_like_count_${photo.id}`) || '14', 10);
        
        if (isLiked) {
            localStorage.setItem(`gallery_liked_${photo.id}`, 'false');
            count = Math.max(0, count - 1);
        } else {
            localStorage.setItem(`gallery_liked_${photo.id}`, 'true');
            count += 1;
            showToast('작품에 따뜻한 응원을 보냈습니다 ❤️');
        }
        localStorage.setItem(`gallery_like_count_${photo.id}`, count.toString());
        updateLikeStatus(photo.id);
    }

    // 공유하기
    function shareArtwork() {
        const photo = filteredPhotos[currentPhotoIndex];
        if (!photo) return;

        if (navigator.share) {
            navigator.share({
                title: `${photo.title} - ${EXHIBITION_DATA.info.title}`,
                text: `${photo.title} (${photo.location}, ${photo.year}) - ${EXHIBITION_DATA.info.artist}`,
                url: window.location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('전시회 링크가 클립보드에 복사되었습니다.');
            });
        }
    }

    // =========================================================================
    // 감성 앰비언트 사운드 생성기 (Web Audio API)
    // 외부 파일 없이 순수 브라우저 음향 합성으로 부드러운 전시관 잔향 사운드 제공
    // =========================================================================
    function toggleAmbientSound() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (isAmbientPlaying) {
            // 정지
            if (ambientGain) {
                ambientGain.gain.setTargetAtTime(0.001, audioCtx.currentTime, 0.6);
            }
            ambientToggleBtn.classList.remove('active');
            isAmbientPlaying = false;
            showToast('배경 사운드를 껐습니다.');
        } else {
            // 재생 시작
            startSynthesizedPad();
            ambientToggleBtn.classList.add('active');
            isAmbientPlaying = true;
            showToast('전시관 앰비언트 사운드가 재생됩니다 🎶');
        }
    }

    function startSynthesizedPad() {
        ambientGain = audioCtx.createGain();
        ambientGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        ambientGain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 2.5);

        // 부드러운 저음 필터 (따뜻한 울림)
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, audioCtx.currentTime);

        // 평온한 코드: Cmaj9 화음 (C3, G3, B3, D4, E4)
        const freqs = [130.81, 196.00, 246.94, 293.66, 329.63];

        freqs.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), audioCtx.currentTime);

            // 각 음의 서서히 숨쉬는 듯한 LFO
            const lfo = audioCtx.createOscillator();
            lfo.frequency.setValueAtTime(0.15 + (i * 0.05), audioCtx.currentTime);
            const lfoGain = audioCtx.createGain();
            lfoGain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            lfo.connect(lfoGain.gain);

            osc.connect(filter);
            osc.start();
        });

        filter.connect(ambientGain);
        ambientGain.connect(audioCtx.destination);
    }

    // =========================================================================
    // 방명록 (Guestbook)
    // =========================================================================
    const INITIAL_GUESTBOOK = [
        {
            name: "민우",
            stamp: "✨ 감동적이에요",
            date: "2024.11.14",
            message: "빛을 다루는 섬세한 시선이 너무 인상적입니다. 특히 오후 4시의 빛 사진 앞에서 한참을 머물렀네요."
        },
        {
            name: "혜린",
            stamp: "📸 빛이 아름다워요",
            date: "2024.11.20",
            message: "온라인인데도 실제 도쿄와 교토의 골목길을 거닐고 온 듯한 여운이 남아요. 앞으로의 기록도 응원합니다!"
        },
        {
            name: "Curator K",
            stamp: "☕ 여운이 남아요",
            date: "2024.12.02",
            message: "정적인 침묵 속에서 느껴지는 온기. 멋진 개인전 잘 감상하고 갑니다 :)"
        }
    ];

    function getGuestbookEntries() {
        const stored = localStorage.getItem('gallery_guestbook');
        return stored ? JSON.parse(stored) : INITIAL_GUESTBOOK;
    }

    function renderGuestbook() {
        const entries = getGuestbookEntries();
        guestbookList.innerHTML = '';

        entries.forEach(entry => {
            const card = document.createElement('div');
            card.className = 'guest-card';
            card.innerHTML = `
                <div class="guest-card-header">
                    <span class="guest-name">${entry.name} <small style="color: var(--accent-gold); font-weight: normal; margin-left: 6px;">${entry.stamp || ''}</small></span>
                    <span class="guest-date">${entry.date}</span>
                </div>
                <div class="guest-message">${entry.message}</div>
            `;
            guestbookList.appendChild(card);
        });
    }

    function handleGuestbookSubmit(e) {
        e.preventDefault();
        const name = guestNameInput.value.trim();
        const msg = guestMsgInput.value.trim();

        if (!name || !msg) {
            showToast('성함과 메시지를 모두 입력해주세요.');
            return;
        }

        const today = new Date();
        const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

        const newEntry = {
            name: name,
            stamp: selectedStamp,
            date: dateStr,
            message: msg
        };

        const entries = getGuestbookEntries();
        entries.unshift(newEntry);
        localStorage.setItem('gallery_guestbook', JSON.stringify(entries));

        renderGuestbook();
        guestbookForm.reset();
        showToast('소중한 방명록이 남겨졌습니다. 감사합니다 ✨');
    }

    // =========================================================================
    // 토스트 알림 헬퍼
    // =========================================================================
    let toastTimeout = null;
    function showToast(message) {
        if (!toastNotice) return;
        toastNotice.textContent = message;
        toastNotice.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotice.classList.remove('show');
        }, 2800);
    }

    // =========================================================================
    // 이벤트 리스너 통합 설정
    // =========================================================================
    function setupEventListeners() {
        // 테마 토글
        themeToggleBtn.addEventListener('click', toggleTheme);

        // 앰비언트 사운드
        ambientToggleBtn.addEventListener('click', toggleAmbientSound);

        // 뷰 모드 전환 버튼
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentViewMode = btn.dataset.view;

                if (currentViewMode === 'masonry') {
                    masonryContainer.style.display = 'block';
                    walkthroughContainer.style.display = 'none';
                } else {
                    masonryContainer.style.display = 'none';
                    walkthroughContainer.style.display = 'block';
                }
            });
        });

        // 라이트박스 닫기 & 탐색
        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightboxPrevBtn.addEventListener('click', prevPhoto);
        lightboxNextBtn.addEventListener('click', nextPhoto);

        // 배경 클릭 시 닫기
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        });

        // 이미지 클릭 시 확대/축소
        lightboxImg.addEventListener('click', () => {
            lightboxImg.classList.toggle('zoomed');
        });

        // 키보드 단축키 지원 (좌/우 방향키, ESC)
        window.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextPhoto();
            } else if (e.key === 'ArrowLeft') {
                prevPhoto();
            }
        });

        // 좋아요 & 공유 버튼
        btnLike.addEventListener('click', toggleLike);
        btnShare.addEventListener('click', shareArtwork);

        // 방명록 스탬프 선택
        stampChips.forEach(chip => {
            chip.addEventListener('click', () => {
                stampChips.forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                selectedStamp = chip.dataset.stamp;
            });
        });

        // 방명록 제출
        guestbookForm.addEventListener('submit', handleGuestbookSubmit);

        // 수평 워크스루 휠 스크롤 편의 제공 (세로 휠을 가로 스크롤로 매핑)
        walkthroughContainer.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                walkthroughContainer.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }

    // 실행 시작
    init();
});
