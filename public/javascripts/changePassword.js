const flash = document.getElementById('ns');
const js = document.getElementById('js');
const jspara = document.getElementById('jspara');
const myform = document.getElementById('myformlogin');
const username = document.getElementById('username');
// const names = document.getElementById('name');
const password = document.getElementById('password');
const confirmpassword = document.getElementById('confirmpassword');
const stars1 = document.getElementById('star1');
// const stars2 = document.getElementById('star2');
const stars3 = document.getElementById('star3');
const stars4 = document.getElementById('star4');


function login_form() {
    if (username.value.length && password.value.length >= 6 && confirmpassword.value.length >= 6 && password.value === confirmpassword.value) {
        myform.submit();
        // return true;
    } else if (!username.value.length) {
        // returntoPreviousPage();
        username.style.border = "1.5px solid #E64848"
        js.style.display = 'flex';
        jspara.innerText = 'Fill the required field';

        stars1.style.display = 'inline-block';
        // stars2.style.display = 'inline-block';
        stars3.style.display = 'inline-block';
        stars4.style.display = 'inline-block';
        // return false;
    } else if (!password.value.length) {
        // returntoPreviousPage();
        password.style.border = "1.5px solid #E64848"
        stars1.style.display = 'inline-block';
        stars2.style.display = 'inline-block';
        stars3.style.display = 'inline-block';
        stars4.style.display = 'inline-block';
        jspara.innerText = 'Fill the required field';

        // console.log('success')
        js.style.display = 'flex'
        // return false;
    } else if (!confirmpassword.value.length) {
        // returntoPreviousPage();
        confirmpassword.style.border = "1.5px solid #E64848"
        stars1.style.display = 'inline-block';
        // stars2.style.display = 'inline-block';
        stars3.style.display = 'inline-block';
        stars4.style.display = 'inline-block';
        jspara.innerText = 'Fill the required field';

        // console.log('success')
        js.style.display = 'flex'
        // return false;
    } else if (password.value.length < 6) {
        // returntoPreviousPage();
        password.style.border = "1.5px solid #E64848"
        stars1.style.display = 'inline-block';
        // stars2.style.display = 'inline-block';
        stars3.style.display = 'inline-block';
        stars4.style.display = 'inline-block';

        // console.log('success')
        jspara.innerText = 'Password length must be 6 or greater'
        js.style.display = 'flex'
        // return false;
    }
    else if (password.value !== confirmpassword.value) {
        // returntoPreviousPage();
        confirmpassword.style.border = "1.5px solid #E64848"
        stars1.style.display = 'inline-block';
        // stars2.style.display = 'inline-block';
        stars3.style.display = 'inline-block';
        stars4.style.display = 'inline-block';

        // console.log('success')
        js.style.display = 'flex'
        jspara.innerText = 'Password and Confirm password must be same'

        // return false;
    }
    else {
        confirmpassword.style.border = "1.5px solid #E64848"
        stars1.style.display = 'inline-block';
        // stars2.style.display = 'inline-block';
        stars3.style.display = 'inline-block';
        stars4.style.display = 'inline-block';

        password.style.border = "1.5px solid #E64848"
        jspara.innerText = 'Fill the required fields'

        js.style.display = 'flex'
        // names.style.border = "1.5px solid #E64848"
        username.style.border = "1.5px solid #E64848"

    }
}



function closebtn() {
    flash.style.display = 'none';
}
function closejs() {
    js.style.display = 'none';
}