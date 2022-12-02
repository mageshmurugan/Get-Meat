
const flash = document.getElementById('ns');
const js = document.getElementById('js');
const myformlogin = document.getElementById('myformlogin');
const username = document.getElementById('username');
const password = document.getElementById('password');
const stars1 = document.getElementById('star1');
const stars3 = document.getElementById('star3');
const jspara = document.getElementById('jspara')

function login_form() {
    if (username.value.length && password.value.length >= 6) {
        myformlogin.submit();
    } else if (!username.value.length) {
        username.style.border = "1.5px solid #E64848"
        jspara.innerText = 'Fill the required field';
        stars3.style.display = 'inline-block';
        stars1.style.display = 'inline-block';
        js.style.display = 'flex';
    }
    else if (!password.value.length) {
        password.style.border = "1.5px solid #E64848"
        stars1.style.display = 'inline-block';
        stars3.style.display = 'inline-block';
        jspara.innerText = 'Fill the required field';
        js.style.display = 'flex'
    } else if (password.value.length < 6) {
        password.style.border = "1.5px solid #E64848"
        stars1.style.display = 'inline-block';
        stars3.style.display = 'inline-block';
        jspara.innerText = 'Password length must be 6 or greater'
        js.style.display = 'flex'
    } else {
        stars1.style.display = 'inline-block';
        stars3.style.display = 'inline-block';

        password.style.border = "1.5px solid #E64848"
        jspara.innerText = 'Fill the required fields'

        js.style.display = 'flex'
        username.style.border = "1.5px solid #E64848"

    }
}







function closebtn() {
    flash.style.display = 'none';
}
function closejavas() {
    js.style.display = 'none';
}