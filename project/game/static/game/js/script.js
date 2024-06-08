document.addEventListener('DOMContentLoaded', () => {
    const professorBack = document.getElementById('professorImage'); //교수님 뒷모습
    const professor = document.getElementById('professor');
    const professorPhotoUrl = professor.getAttribute('data-photo-url');

    const students = [
        document.getElementById('student1'),
        document.getElementById('student2'),
        document.getElementById('student3'),
        document.getElementById('student4'),
    ];
    const warningPopup = document.getElementById('warningPopup');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const alert1 = document.getElementById('alert1');
    const alert2 = document.getElementById('alert2');

    let warningCount = 0;
    let canWarn = true;
    let maxTime = 5000;
    let minTime = 3000;
    let maxLookTime = 3000;
    let minLookTime = 1000;
    let professorLooking = false;
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
        professorLooking = true;
        if (professorLooking) {
            professorBack.style.display = 'none';
            professor.style.backgroundImage = `url(${professorPhotoUrl})`; //교수님이 뒤 돌았을 때 얼굴을 보여주는 이미지
            professor.style.backgroundSize = 'cover';
            professor.style.display = 'block';
        } else {
            professor.style.display = 'none';
        }
        checkStudents();

        const backTime = randomTime(500, 1000); // 교수님이 돌아보는 시간 랜덤 설정 0.5-1초

        setTimeout(() => {
            professorLooking = false;
            professor.style.backgroundImage = '';
            professorBack.style.display = 'block';
            professor.style.display = 'block';
            const lookTime = randomTime(3000, 5000);
            setTimeout(professorTurn, lookTime);
        }, backTime);
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
            students.forEach((student, index) => {
                if (index < 3) {
                    student.style.backgroundColor = 'blue';
                } else {
                    student.style.backgroundColor = pressStart ? 'green' : 'blue';
                }
            });
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

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
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
            } else {
                if (pressStart === null) {
                    pressStart = Date.now();
                }
                students[3].style.backgroundColor = 'green';
                if (backgroundMusic.paused) {
                    backgroundMusic
                        .play()
                        .then(() => {
                            console.log('Music started playing');
                        })
                        .catch((error) => {
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
                students[3].style.backgroundColor = 'blue';
                backgroundMusic.pause();
            }
        }
    });

    setTimeout(professorTurn, randomTime(minTime, maxTime));
});
