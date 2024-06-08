document.addEventListener('DOMContentLoaded', () => {
    const professor = document.getElementById('professor');
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
    let canWarn = true; // 플래그 추가
    let maxTime = 5000; // max time for professor to turn around (adjusted to be 3 to 5 seconds)
    let minTime = 3000; // min time for professor to turn around
    let maxLookTime = 3000; // max time professor looks forward
    let minLookTime = 1000; // min time professor looks forward
    let professorLooking = false;
    let score = 0;
    let pressStart = null;

    function randomTime(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }

    function professorTurn() {
        professorLooking = true;
        canWarn = true; // 교수님이 뒤를 볼 때 경고 가능 상태 초기화
        professor.style.backgroundColor = 'green'; // Professor looking back
        checkStudents();

        // Professor looks back for a random time, then looks forward for a random time
        const backTime = randomTime(500, 1000); // Random time professor looks back (0.5s to 1s)
        setTimeout(() => {
            professorLooking = false;
            professor.style.backgroundColor = 'red'; // Professor looking away
            const lookTime = randomTime(3000, 9000); // Random time professor looks forward
            setTimeout(professorTurn, lookTime); // Set the next turn
        }, backTime); // Professor looks back for a random time
    }

    function checkStudents() {
        if (professorLooking && canWarn) {
            if (pressStart !== null) {
                warningCount++;
                displayWarning();
                canWarn = false; // 경고 후 경고 가능 상태 비활성화
                if (warningCount >= 3) {
                    window.location.href = 'punish.html';
                }
                backgroundMusic.pause(); // Stop music when warning is given
            }
            students.forEach((student, index) => {
                if (index < 3) {
                    student.style.backgroundColor = 'blue'; // Automatic students stop dancing
                } else {
                    student.style.backgroundColor = pressStart ? 'green' : 'blue'; // User controlled student
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
            console.log('Space key down event detected');
            if (professorLooking && canWarn) {
                if (pressStart !== null) {
                    warningCount++;
                    displayWarning();
                    canWarn = false; // 경고 후 경고 가능 상태 비활성화
                    if (warningCount >= 3) {
                        window.location.href = 'punish.html';
                    }
                    backgroundMusic.pause(); // Stop music when warning is given
                }
            } else {
                if (pressStart === null) {
                    pressStart = Date.now();
                }
                students[3].style.backgroundColor = 'green'; // User controlled student starts dancing
                if (backgroundMusic.paused) {
                    backgroundMusic
                        .play()
                        .then(() => {
                            console.log('Music started playing');
                        })
                        .catch((error) => {
                            console.error('Failed to play music:', error);
                        }); // Start or resume music
                }
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'Space') {
            console.log('Space key up event detected');
            if (pressStart !== null) {
                score += Date.now() - pressStart;
                pressStart = null;
                students[3].style.backgroundColor = 'blue'; // User controlled student stops dancing
                backgroundMusic.pause(); // Pause music
                console.log('Music paused');
                console.log('Total score:', score); // Score logging
            }
        }
    });

    setTimeout(professorTurn, randomTime(minTime, maxTime)); // Initial call to start the loop
});
