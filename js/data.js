/**
 * 개인 사진 전시회 데이터 설정 파일
 * 
 * 사진을 추가하거나 수정하고 싶을 때 이 파일의 내용을 편집하거나,
 * 함께 제공되는 admin.html (큐레이터 도구)을 사용하여 손쉽게 생성할 수 있습니다.
 */

const EXHIBITION_DATA = {
    // 전시회 기본 정보
    info: {
        title: "기억의 틈, 빛의 결",
        subtitle: "A Record of Gaze & Solitude",
        artist: "Jieun (지은)",
        artistBio: "일상을 스쳐 지나가는 무수한 빛과 그림자, 그리고 그 찰나의 순간에 깃든 감정의 온도를 렌즈에 담습니다. 빠르게 흘러가는 세상 속에서 잠시 멈추어 서서 바라본 시선의 조각들을 여기에 조용히 펼쳐놓습니다.",
        period: "2024 - 2026 ARCHIVE",
        location: "Virtual Gallery Hall",
        email: "jieun.photo@example.com",
        instagram: "@jieun_captures"
    },

    // 전시 테마 / 카테고리
    categories: [
        { id: "all", label: "전체 작품 (All)" },
        { id: "light", label: "빛과 그림자 (Light & Shadow)" },
        { id: "urban", label: "도시의 숨결 (Urban Solitude)" },
        { id: "nature", label: "자연의 여백 (Nature's Stillness)" },
        { id: "film", label: "필름의 시선 (Analog Moments)" }
    ],

    // 전시 작품 목록
    photos: [
        {
            id: 1,
            title: "오후 4시의 기울어진 빛",
            category: "light",
            year: "2024",
            location: "Seoul, South Korea",
            src: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=85",
            fallbackColor: "#2b2a27",
            aspectRatio: "3:4",
            description: "창가를 비스듬히 비추는 늦은 오후의 볕. 하루 중 빛이 가장 길어지고 따뜻한 온도를 품는 이 찰나의 공기가 언제나 마음을 차분하게 가라앉힙니다.",
            exif: {
                camera: "Sony A7 IV",
                lens: "FE 35mm F1.4 GM",
                focal: "35mm",
                aperture: "f/2.0",
                shutter: "1/640s",
                iso: "100"
            }
        },
        {
            id: 2,
            title: "푸른 밤의 침묵",
            category: "urban",
            year: "2024",
            location: "Tokyo, Japan",
            src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85",
            fallbackColor: "#171c26",
            aspectRatio: "16:10",
            description: "화려한 네온사인이 서서히 잦아들고 도시가 잠드는 시간. 빌딩 숲 사이로 부는 서늘한 바람 속에서 묘한 해방감과 고요함을 마주했습니다.",
            exif: {
                camera: "Leica Q2",
                lens: "Summilux 28mm f/1.7 ASPH",
                focal: "28mm",
                aperture: "f/1.7",
                shutter: "1/40s",
                iso: "800"
            }
        },
        {
            id: 3,
            title: "안개 덮인 숲의 호흡",
            category: "nature",
            year: "2023",
            location: "Jeju Island, Korea",
            src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=85",
            fallbackColor: "#1d261e",
            aspectRatio: "4:5",
            description: "새벽녘 이슬을 머금은 원시림. 나무들이 서로의 어깨를 짚고 조용히 숨 쉬는 소리가 귓가를 맴돌던 신비로운 아침이었습니다.",
            exif: {
                camera: "Fujifilm X-T5",
                lens: "XF 23mm F1.4 R LM WR",
                focal: "23mm (35mm 환산)",
                aperture: "f/4.0",
                shutter: "1/125s",
                iso: "250"
            }
        },
        {
            id: 4,
            title: "필름으로 건져올린 바다",
            category: "film",
            year: "2023",
            location: "Gangneung, Korea",
            src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
            fallbackColor: "#223544",
            aspectRatio: "3:2",
            description: "Kodak Portra 400 필름 특유의 부드러운 입자감과 바다의 파스텔톤 윤슬. 디지털에서는 미처 느끼지 못했던 시간의 결이 한 컷에 맺혀 있습니다.",
            exif: {
                camera: "Contax T2",
                lens: "Carl Zeiss Sonnar 38mm f/2.8",
                focal: "38mm",
                aperture: "f/5.6",
                shutter: "1/500s",
                iso: "Kodak Portra 400"
            }
        },
        {
            id: 5,
            title: "기하학과 그림자의 경계",
            category: "light",
            year: "2024",
            location: "Museum San, Wonju",
            src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
            fallbackColor: "#33312f",
            aspectRatio: "1:1",
            description: "빛이 콘크리트 벽면에 부딪혀 만들어낸 날카롭고도 우아한 선. 건축과 빛이 나누는 무언의 대화를 프레임에 가두어 보았습니다.",
            exif: {
                camera: "Sony A7 IV",
                lens: "FE 24-70mm F2.8 GM II",
                focal: "50mm",
                aperture: "f/8.0",
                shutter: "1/1000s",
                iso: "100"
            }
        },
        {
            id: 6,
            title: "비 내리는 교차로의 궤적",
            category: "urban",
            year: "2024",
            location: "Osaka, Japan",
            src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85",
            fallbackColor: "#1d1921",
            aspectRatio: "3:4",
            description: "젖은 아스팔트에 반사된 도시의 불빛들. 각자의 목적지를 향해 걸음을 재촉하는 사람들의 실루엣 속에 서정적인 리듬이 흐릅니다.",
            exif: {
                camera: "Fujifilm X-T5",
                lens: "XF 33mm F1.4 R LM WR",
                focal: "33mm",
                aperture: "f/1.4",
                shutter: "1/160s",
                iso: "640"
            }
        },
        {
            id: 7,
            title: "여름의 녹음과 메아리",
            category: "nature",
            year: "2023",
            location: "Damyang, Korea",
            src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=85",
            fallbackColor: "#182b1c",
            aspectRatio: "16:9",
            description: "바람이 지나갈 때마다 사각거리던 초록의 물결. 한여름 햇살이 잎사귀를 통과해 내려앉을 때의 청량한 온도.",
            exif: {
                camera: "Sony A7 IV",
                lens: "FE 85mm F1.4 GM",
                focal: "85mm",
                aperture: "f/2.2",
                shutter: "1/800s",
                iso: "100"
            }
        },
        {
            id: 8,
            title: "골목길의 오래된 자전거",
            category: "film",
            year: "2024",
            location: "Kyoto, Japan",
            src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
            fallbackColor: "#2d2925",
            aspectRatio: "4:5",
            description: "수십 년 동안 같은 자리를 지켜온 것만 같은 녹슨 자전거와 목조 가옥의 나뭇결. 빠르게 변하지 않는 것들에 대한 다정한 애정을 담아.",
            exif: {
                camera: "Canon New F-1",
                lens: "FD 50mm f/1.4",
                focal: "50mm",
                aperture: "f/2.8",
                shutter: "1/250s",
                iso: "Fujifilm C200"
            }
        },
        {
            id: 9,
            title: "노을이 머무는 창가",
            category: "light",
            year: "2024",
            location: "Home, Seoul",
            src: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=85",
            fallbackColor: "#39251b",
            aspectRatio: "3:2",
            description: "특별할 것 없던 하루의 끝자락, 거실 한구석을 붉게 물들이던 해질녘의 황금빛. 가장 소중한 장면은 언제나 일상의 가장 가까운 곳에 있습니다.",
            exif: {
                camera: "Leica Q2",
                lens: "Summilux 28mm f/1.7 ASPH",
                focal: "28mm",
                aperture: "f/2.8",
                shutter: "1/400s",
                iso: "160"
            }
        }
    ]
};
