const emailLabel=document.getElementById('email')
const emailInput=document.getElementById('email')
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordLabel=document.getElementById('password')
const passwordInput=document.getElementById('password')
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

emailInput.onblur=()=>{
    if(!emailPattern.test(emailInput.value)){
        emailLabel.innerHTML='Invalid email'
        emailLabel.classList.add('redLabel')
    }
    else{
        emailLabel.innerHTML='Email'
        emailLabel.classList.remove('redLabel')
    }
}

passwordInput.onblur=()=>{
    if(!passwordPattern.test(passwordInput.value)){
        passwordLabel.innerHTML='Invalid password'
        passwordLabel.classList.add('redLabel')
    }
    else{
        passwordLabel.innerHTML='Password'
        passwordLabel.classList.remove('redLabel')
    }
}
