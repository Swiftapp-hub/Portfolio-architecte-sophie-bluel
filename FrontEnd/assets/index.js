/*
 * Global variables
 */
var galleryItem;

/*
 * Events listener
 */
document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:5678/api/works")
        .then((res) => res.json())
        .then((res) => {
            refresh(false, res);
        })
        .catch((error) => console.log(error));
});

/*
 * Functions for gallery items
 */
function refresh(isPopup, items = null, category = -1) {
    const rootEL = document.getElementById('gallery-list');
    while (rootEL.firstChild) rootEL.removeChild(rootEL.lastChild);

    if (!isPopup) {
        if (category === -1) {
            if (items === null) galleryItem.forEach((item) => addItemInGallery(item))
            else {
                galleryItem = [];
                items.forEach((item) => addItemInGallery(item));
            }
        } else {
            galleryItem.forEach((item) => {
                if (item.categoryId === category) addItemInGallery(item, true);
            })
        }
    } else {
        galleryItem.forEach((item) => addItemInGalleryPopup(item))
    }
}

function addItemInGallery(item, isWithCategory = false) {
    if (!isWithCategory) galleryItem.push(item);

    const fig = document.createElement('figure');
    const img = document.createElement('img');
    const figcap = document.createElement('figcaption');

    img.setAttribute('src', item.imageUrl);
    img.setAttribute('alt', item.title);

    figcap.textContent = item.title;

    fig.appendChild(img); fig.appendChild(figcap);

    document.getElementById('gallery-list').appendChild(fig);
}

function addItemInGalleryPopup(item) {
}