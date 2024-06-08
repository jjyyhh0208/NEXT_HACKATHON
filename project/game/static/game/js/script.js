document.addEventListener('DOMContentLoaded', () => {
    const professorBack = document.getElementById('professorImage');
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

    function randomTime(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }

    function professorTurn() {
        professorLooking = true;
        if (professorLooking) {
            professorBack.style.display = 'none';
            professor.style.backgroundImage = `url(${professorPhotoUrl})`;
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
                    window.location.href = 'ranking/';
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
                        window.location.href = 'ranking/';
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
