function openPopup() {
    document.getElementById("popup").classList.add("active");
}

function closePopup() {
    document.getElementById("popup").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", function () {

    const addBtn = document.querySelector(".add-property-btn");
    const popup = document.getElementById("popup");

    if (addBtn) {
        addBtn.addEventListener("click", function (e) {
            e.preventDefault();
            openPopup();
        });
    }

    if (popup) {
        popup.addEventListener("click", function (e) {
            if (e.target === popup) {
                closePopup();
            }
        });
    }

});
