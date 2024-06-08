document.addEventListener('DOMContentLoaded', () => {
    const professorBack = document.getElementById('professorImage'); //교수님 뒷모습
    const professor = document.getElementById('professor');
    const professorBackUrl = professor.getAttribute('data-back-url');
    const professorSideUrl = professor.getAttribute('data-side-url');
    const professorPhotoUrl = professor.getAttribute('data-photo-url');

    const student1 = document.getElementById('student1');
    const student2 = document.getElementById('student2');
    const student4 = document.getElementById('student4');
    const studentImgs = [student1.querySelector('img'), student2.querySelector('img'), student4.querySelector('img')];
    const warningPopup = document.getElementById('warningPopup');
    const alert1 = document.getElementById('alert1');
    const alert2 = document.getElementById('alert2');

    const staticUrlStudent4 = student4.getAttribute('data-static-url');
    const staticUrlStudents1and2 = student1.getAttribute('data-static-url');
    const gifUrls = {
        catMusic: {
            student4: student4.getAttribute('data-cat-url'),
            students1and2: student1.getAttribute('data-cat-url'),
        },
        maratangMusic: {
            student4: student4.getAttribute('data-maratang-url'),
            students1and2: student1.getAttribute('data-maratang-url'),
        },
        koreaMusic: {
            student4: student4.getAttribute('data-korea-url'),
            students1and2: student1.getAttribute('data-korea-url'),
        },
    };

    const musicFiles = [
        { id: 'catMusic', gifs: gifUrls['catMusic'] },
        { id: 'maratangMusic', gifs: gifUrls['maratangMusic'] },
        { id: 'koreaMusic', gifs: gifUrls['koreaMusic'] },
    ];

    const randomIndex = Math.floor(Math.random() * musicFiles.length);
    const selectedMusic = musicFiles[randomIndex];
    const backgroundMusic = document.getElementById(selectedMusic.id);

    if (!backgroundMusic) {
        console.error('Background music element is missing');
        return;
    }

    let warningCount = 0;
    let canWarn = true;
    let maxTime = 5000;
    let minTime = 3000;
    let maxLookTime = 3000;
    let minLookTime = 1000;
    let professorLooking = false;
    let professorIntermediateLooking = false;
    let score = 0;
    let pressStart = null;
    const currentUsernameElement = document.getElementById('currentUsername');
    const currentUsername = currentUsernameElement.textContent || currentUsernameElement.innerText;

    function sendScore(score) {
        // window.location.href = '/ranking';

        fetch('/submit-score/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: currentUsername, score: score }),
        })
            .then((response) => response.json()) // 응답을 JSON으로 파싱
            .then((data) => {
                if (data.isSuccess === 'true') {
                    // 랭킹 페이지로 리디렉션
                    window.location.href = '/punish/';
                } else {
                    alert('Failed to submit score.');
                }
                console.log('Score submitted:', data);
            })
            .catch((error) => {
                console.error('Error submitting score:', error);
            });
    }

    function randomTime(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }

    function professorTurn() {
        professorIntermediateLooking = true; // 중간 상태 시작
        professor.style.backgroundColor = 'transparent'; // 배경색을 투명으로 설정
        professor.style.backgroundImage = `url(${professorSideUrl})`; // 중간 상태 이미지 설정
        professor.style.backgroundSize = 'cover'; // 이미지가 요소를 덮도록 설정
        professor.style.backgroundRepeat = 'no-repeat'; // 이미지 반복하지 않도록 설정
        updateStudentImages(); // 학생들의 이미지를 업데이트 (춤을 춤)

        const intermediateTime = 300; // 중간 상태 지속 시간 (0.5초에서 1.5초 사이)

        setTimeout(() => {
            professorIntermediateLooking = false; // 중간 상태 종료
            professorLooking = true; // 교수님이 학생들을 보고 있는 상태로 설정

            professor.style.backgroundImage = `url(${professorPhotoUrl})`; // 이미지를 제거하여 앞을 보는 상태로 설정
            updateStudentImages(); // 학생들의 이미지를 업데이트 (춤을 멈춤)

            const backTime = randomTime(500, 3000); // 교수님이 학생들을 돌아보는 시간 (0.5초에서 3초 사이)
            const lookTime = randomTime(minTime, maxTime); // 교수님이 뒤를 보고 있는 시간 (minTime과 maxTime 사이의 랜덤 값)
            checkStudents();
            setTimeout(() => {
                professorLooking = false; // 교수님이 뒤를 보고 있는 상태로 설정
                professor.style.backgroundColor = 'transparent'; // 배경색을 투명으로 설정
                professor.style.backgroundImage = `url(${professorBackUrl})`; // 뒤를 보는 상태 이미지 설정
                professor.style.backgroundSize = 'cover'; // 이미지가 요소를 덮도록 설정
                professor.style.backgroundRepeat = 'no-repeat'; // 이미지 반복하지 않도록 설정
                updateStudentImages(); // 학생들의 이미지를 업데이트 (춤을 춤)

                setTimeout(professorTurn, lookTime); // 일정 시간 후에 교수님이 다시 돌아보도록 설정
            }, backTime); // 교수님이 학생들을 돌아보는 시간을 설정
        }, intermediateTime); // 중간 상태 지속 시간을 설정
    }

    function checkStudents() {
        canWarn = true;
        if (professorLooking && canWarn) {
            if (pressStart !== null) {
                warningCount++;
                displayWarning();
                canWarn = false;
                if (warningCount >= 3) {
                    // window.location.href = 'ranking.html';
                    sendScore(score);
                }
                backgroundMusic.pause();
            }
        }
    }

    function displayWarning() {
        let message = '';
        switch (warningCount) {
            case 1:
                message = '자네 지금 뭐하는건가?';
                alert1.play();
                break;
            case 2:
                message = '계속 수업을 방해하면 낙제일세!';
                alert2.play();
                break;
            case 3:
                message = '자네 F야';
                break;
        }
        warningPopup.textContent = message;
        warningPopup.style.display = 'flex';
        setTimeout(() => {
            warningPopup.style.display = 'none';
        }, 2000);
    }

    function setGifImage(imgElement, gifUrl) {
        if (!imgElement) {
            console.error('Image element is null');
            return;
        }
        const gifImage = new Image();
        gifImage.src = gifUrl;
        gifImage.onload = () => {
            imgElement.src = gifImage.src;
        };
    }

    function updateStudentImages() {
        studentImgs.forEach((imgElement, index) => {
            if (professorLooking) {
                // 교수님이 학생들을 보고 있을 때
                imgElement.src = index < 2 ? staticUrlStudents1and2 : staticUrlStudent4; // student1, student2는 static 이미지, student4도 static 이미지
            } else {
                // 교수님이 뒤를 보고 있거나 중간 상태일 때
                if (index < 2) {
                    setGifImage(imgElement, selectedMusic.gifs.students1and2); // student1, student2는 춤추는 gif 이미지
                } else if (pressStart !== null) {
                    setGifImage(imgElement, selectedMusic.gifs.student4); // student4는 사용자 입력에 따라 춤추는 gif 이미지
                } else {
                    imgElement.src = staticUrlStudent4; // student4는 static 이미지
                }
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && pressStart === null) {
            if (professorLooking && canWarn) {
                warningCount++;
                displayWarning();
                canWarn = false;
                if (warningCount >= 3) {
                    // window.location.href = 'ranking.html';
                    sendScore(score);
                }
                backgroundMusic.pause();
            } else {
                pressStart = Date.now();
                updateStudentImages(); // GIF를 설정
                if (backgroundMusic.paused) {
                    backgroundMusic.play().catch((error) => {
                        console.error('Failed to play music:', error);
                    });
                }
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'Space') {
            if (pressStart !== null) {
                score += Date.now() - pressStart;
                pressStart = null;
                updateStudentImages();
                backgroundMusic.pause();
            }
        }
    });

    studentImgs[0].src = staticUrlStudents1and2;
    studentImgs[1].src = staticUrlStudents1and2;
    studentImgs[2].src = staticUrlStudent4;

    // 초기 상태 설정
    professor.style.backgroundColor = 'transparent';
    professor.style.backgroundImage = `url(${professorBackUrl})`;
    professor.style.backgroundSize = 'cover';
    professor.style.backgroundRepeat = 'no-repeat';

    setTimeout(professorTurn, randomTime(minTime, maxTime));
});
