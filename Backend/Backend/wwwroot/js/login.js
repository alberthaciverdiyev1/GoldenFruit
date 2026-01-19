document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorDiv = document.getElementById("errorMessages");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const token = formData.get("__RequestVerificationToken");
        const data = {
            Username: formData.get("Username"),
            Password: formData.get("Password"),
            __RequestVerificationToken: token
        };

        try {
            const response = await fetch("/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "RequestVerificationToken": token
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    window.location.href = "/";
                } else {
                    errorDiv.innerText = result.message;
                }
            } else {
                errorDiv.innerText = "API error";
            }
        } catch (err) {
            console.error(err);
            errorDiv.innerText = "An Error Occured";
        }
    });
});