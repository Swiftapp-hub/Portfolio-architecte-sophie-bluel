/*
 * Global variables
 */
const galleryItem = [];
const categories = [];

/*
 * Events listener
 */
document.addEventListener("DOMContentLoaded", () => {
    // Initialize portfolio section
    fetch("http://localhost:5678/api/works")
        .then((res) => res.json())
        .then((res) => {
            refresh(false, res);
        })
        .catch((error) => console.log(error));

    // Add event listener to logout button
    const navSpan = document.querySelector('nav span');
    navSpan.addEventListener('click', () => {
        localStorage.removeItem('token');
        document.body.classList.remove('logged-in');
    });

    // Add event listener to popup buttons
    const editButton = document.querySelector('#portfolio .edit-button');
    editButton.addEventListener('click', () => {
        document.getElementById('edit-popup').classList.add('view-page-1');
        refresh(true);
    })

    const closeButton = document.querySelector('#edit-popup .fa-xmark');
    closeButton.addEventListener('click', () => {
        document.getElementById('edit-popup').classList.remove('view-page-1');
        document.getElementById('edit-popup').classList.remove('view-page-2');
    })

    // Check if user is logged in and add class to body
    if (localStorage.getItem("token")) document.body.classList.add('logged-in');
});

/*
 * Functions for gallery items
 */
function refresh(isPopup, items = null, category = -1) {
    if (!isPopup) {
        // Delete items in gallery div
        document.getElementById('gallery-list').textContent = "";

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
        document.getElementById('gallery-popup').textContent = "";
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

    fig.appendChild(img);
    fig.appendChild(figcap);

    document.getElementById('gallery-list').appendChild(fig);
}

/*
 * Functions for popup
 */
function addItemInGalleryPopup(item) {
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('i');
    const moveButton = document.createElement('i');

    deleteButton.classList.add('fa-solid', 'fa-trash-can');
    moveButton.classList.add('fa-solid', 'fa-arrows-up-down-left-right');

    deleteButton.addEventListener('click', () => {
        console.log(item.id);
    })

    moveButton.addEventListener('click', () => {
        console.log('Not implemented yet');
    })

    img.setAttribute('src', item.imageUrl);
    img.setAttribute('alt', item.title);

    editButton.textContent = "éditer";
    editButton.addEventListener('click', () => {
        console.log('Not implemented yet');
    })

    fig.appendChild(img);
    fig.appendChild(editButton);
    fig.appendChild(moveButton);
    fig.appendChild(deleteButton);

    document.getElementById('gallery-popup').appendChild(fig);
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