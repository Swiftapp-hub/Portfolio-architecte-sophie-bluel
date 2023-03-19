document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login').addEventListener("submit", (event) => {
        event.preventDefault();

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: event.target.email.value,
                password: event.target.password.value,
            })
        }).then((response) => {
            switch (response.status) {
                case 401:
                    console.log("Erreur, veuillez verifier vos identifiants");
                    break;
                case 404:
                    console.log("Erreur, veuillez verifier vos identifiants");
                    break;
                case 500:
                    alert("Erreur du serveur");
                    break;
                case 503:
                    alert("Erreur, service non disponible");
                    break;
            }
            return response.json();
        }).then((data) => {
            if (data.token === undefined) {
                document.getElementById('login').querySelector('span').setAttribute('class', 'error');
            } else {
                sessionStorage.setItem("token", data.token);
                window.location.href = "index.html";
            }
        }).catch((error) => {
            console.log(error);
        })
    })
})
