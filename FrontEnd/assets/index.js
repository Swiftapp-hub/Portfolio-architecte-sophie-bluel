/*
 * Global variables
 */
const galleryItem = [];
const categories = [];

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
    // Delete item in gallery div
    const rootEL = document.getElementById('gallery-list');
    while (rootEL.firstChild) rootEL.removeChild(rootEL.lastChild);

    if (!isPopup) {
        if (category === -1) {
            // Refresh without new data
            if (items === null) galleryItem.forEach((item) => addItemInGallery(item, true))
            // Refresh with new data from DB
            else {
                addCategory({id: -1, name: 'Tous'}, true);
                items.forEach((item, index) => {
                    addItemInGallery(item);
                    if (index < 3) addCategory(item.category);
                });
            }
        } else {
            // Refresh with category filter
            galleryItem.forEach((item) => {
                if (item.categoryId === category) addItemInGallery(item, true);
            })
        }
    } else {
        // Refresh edit popup
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

/*
 * Functions for categories
 */
function addCategory(category, checked = false) {
    categories.push(category);

    const input = document.createElement('input');
    const label = document.createElement('label');

    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'filters');
    input.setAttribute('value', category.id);
    input.setAttribute('id', category.name);
    if (checked) input.checked = true;

    input.addEventListener('change', (e) => {
        refresh(false, null, Number(e.target.value));
    })

    label.setAttribute('for', category.name);
    label.textContent = category.name;

    document.getElementById('categories').appendChild(input);
    document.getElementById('categories').appendChild(label);
}