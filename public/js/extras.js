const emailLabel=document.getElementById('emailLabel')
const emailInput=document.getElementById('emailInput')
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordLabel=document.getElementById('passwordLabel')
const passwordInput=document.getElementById('passwordInput')
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

emailInput.onblur=()=>{
    if(!emailPattern.test(emailInput.value)){
        emailLabel.innerHTML='Invalid email'
        emailLabel.classList.add('redLabel')
    }
    else{
        emailLabel.innerHTML='email'
        emailLabel.classList.remove('redLabel')
    }
}

passwordInput.onblur=()=>{
    if(!passwordPattern.test(passwordInput.value)){
        passwordLabel.innerHTML='Invalid password'
        passwordLabel.classList.add('redLabel')
    }
    else{
        passwordLabel.innerHTML='password'
        passwordLabel.classList.remove('redLabel')
    }
}
