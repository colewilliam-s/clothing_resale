// please PLEASE catch the south park reference
export function verify(email, password) {
    let emailCheck = "email123@gmail.com";
    let passCheck = "password123";
    if (emailCheck == email && passCheck == password){
        alert("Donde esta mi fimilia? Bien gracias, y tu?")
    } else {
        alert("Email and/or password is incorrect. Please try again");
    }
}