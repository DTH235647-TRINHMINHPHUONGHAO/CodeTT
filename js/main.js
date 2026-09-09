$(document).ready(function() {
    // Process bar / loading
    setTimeout(function() {
        firstQuestion();
        $('.spinner').fadeOut();
        $('#preloader').delay(350).fadeOut('slow');
        $('body').delay(350).css({
            'overflow': 'visible'
        });
    }, 600);
});

function init() {
    $('#title').text(CONFIG.title);
    $('#desc').text(CONFIG.desc);
    $('#yes').text(CONFIG.btnYes);
    $('#no').text(CONFIG.btnNo);
}

// Play background romantic music
function playAudio() {
    var audio = document.getElementById('soundAudio');
    if (audio) {
        audio.play().catch(function(err) {
            console.log("Audio play blocked:", err);
        });
    }
}

// Fallback: unlock audio on first user touch / click anywhere on page
$(document).one('click touchstart', function() {
    playAudio();
});

function firstQuestion() {
    $('.content').hide();
    Swal.fire({
        title: CONFIG.introTitle,
        text: CONFIG.introDesc,
        imageUrl: 'img/lookMe.jpg',
        imageWidth: 300,
        imageHeight: 300,
        background: '#fff url("img/iput-bg.jpg")',
        imageAlt: 'Custom image',
        confirmButtonText: CONFIG.btnIntro,
        allowOutsideClick: false
    }).then(function() {
        playAudio();
        $('.content').show(200);
    });
}

// Switch button positions
function switchButton() {
    var audio = new Audio('sound/duck.mp3');
    audio.play().catch(function() {});
    var leftNo = $('#no').css("left");
    var topNo = $('#no').css("top");
    var leftY = $('#yes').css("left");
    var topY = $('#yes').css("top");
    $('#no').css("left", leftY);
    $('#no').css("top", topY);
    $('#yes').css("left", leftNo);
    $('#yes').css("top", topNo);
}

// Move 'No' button randomly on screen
function moveButton() {
    var audio = new Audio('sound/Swish1.mp3');
    audio.play().catch(function() {});
    var maxX = $(window).width() - $('#no').outerWidth() - 30;
    var maxY = $(window).height() - $('#no').outerHeight() - 50;
    var x = Math.max(20, Math.floor(Math.random() * maxX));
    var y = Math.max(120, Math.floor(Math.random() * maxY));
    $('#no').css({
        left: x + 'px',
        top: y + 'px'
    });
}

init();

// Dodge button logic
var n = 0;
function dodgeNo() {
    if (n < 1) {
        switchButton();
    } else {
        moveButton();
    }
    n++;
}

// Handle both desktop mouse hover and mobile touchscreen tap
$('#no').on('mouseenter touchstart', function(e) {
    dodgeNo();
});

$('#no').on('click', function(e) {
    e.preventDefault();
    dodgeNo();
});

// Auto-generate text character by character as user types on keyboard
function textGenerate() {
    var reply = CONFIG.reply || '';
    var inputVal = $('#txtReason').val() || '';
    var count = inputVal.length;
    if (count > 0) {
        var result = '';
        for (var i = 0; i < count; i++) {
            if (i < reply.length) {
                result += reply[i];
            } else {
                result = reply;
                break;
            }
        }
        $('#txtReason').val(result);
    }
}

// Listen to keyboard and input events on desktop & mobile
$(document).on('input keyup', '#txtReason', function() {
    textGenerate();
});

// Show question popup when clicking 'Yes'
$('#yes').click(function() {
    var audio = new Audio('sound/tick.mp3');
    audio.play().catch(function() {});
    Swal.fire({
        title: CONFIG.question,
        width: 900,
        padding: '3em',
        html: "<input type='text' class='form-control' id='txtReason' placeholder='Whyyy'>",
        background: '#fff url("img/iput-bg.jpg")',
        backdrop: `
              rgba(0,0,123,0.4)
              url("img/giphy2.gif")
              left top
              no-repeat
            `,
        confirmButtonColor: '#fe8a71',
        confirmButtonText: CONFIG.btnReply,
        allowOutsideClick: false
    }).then((result) => {
        if (result.value || result.isConfirmed) {
            Swal.fire({
                width: 900,
                confirmButtonText: CONFIG.btnAccept,
                background: '#fff url("img/iput-bg.jpg")',
                title: CONFIG.mess,
                text: CONFIG.messDesc,
                confirmButtonColor: '#83d0c9',
                allowOutsideClick: false,
                onClose: () => {
                    window.location.href = CONFIG.messLink;
                }
            }).then(() => {
                window.location.href = CONFIG.messLink;
            });
        }
    });
});

