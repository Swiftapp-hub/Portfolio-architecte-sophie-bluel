/*
 * Global variables
 */
const galleryItem = [];
const categories = [];

/*
 * Events listener
 */
document.addEventListener("DOMContentLoaded", () => {
    //Get all the categories
    fetch("http://localhost:5678/api/categories")
        .then((res) => res.json())
        .then((res) => {
            categories.push({'id': -1, 'name': 'Tous'});
            res.forEach((category) => {
                categories.push(category);
            })
            refreshCategories();
        })
        .catch((error) => console.log(error));

    // Initialize portfolio section
    fetch("http://localhost:5678/api/works")
        .then((res) => res.json())
        .then((res) => {
            refreshWorks(false, res);
        })
        .catch((error) => console.log(error));

    // Add event listener to logout button
    const navSpan = document.querySelector('nav span');
    navSpan.addEventListener('click', () => {
        sessionStorage.removeItem('token');
        document.body.classList.remove('logged-in');
    });

    // Close popup when clicking outside
    const popup = document.querySelector('#edit-popup');
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    })

    // Add image event listener
    const addImage = document.querySelector('#edit-popup form div div .add-image');
    const inputFile = document.getElementById('file');
    const ct = document.querySelector('#edit-popup form > div')
    addImage.addEventListener('click', () => {
        inputFile.click();
    })
    inputFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        ct.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
        ct.classList.add('view-file');
    })

    const btnSubmit = document.querySelector('#edit-popup form > button');
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        var formData = new FormData();

        formData.append('image', document.getElementById('file').files[0]);
        formData.append('title', document.getElementById('title-edit').value);
        formData.append('category', document.getElementById('category-edit').value);

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token"),
            },
            body: formData
        }).then((response) => {
            return response.json();
        }).then((data) => {
            galleryItem.push(data);
            galleryItem.at(galleryItem.length - 1).categoryId = parseInt(data.categoryId, 10);
            refreshWorks(false);
            closePopup();
        }).catch((error) => {
            console.log(error);
        })
    })

    // Check if user is logged in
    if (sessionStorage.getItem("token")) {
        document.body.classList.add('logged-in');

        // Add event listener to popup buttons
        const editButton = document.querySelector('#portfolio .edit-button');
        editButton.addEventListener('click', () => {
            document.getElementById('edit-popup').classList.add('view-page-1');
            refreshWorks(true);
        })

        const closeButton = document.querySelector('#edit-popup .fa-xmark');
        closeButton.addEventListener('click', () => closePopup())

        const addButton = document.querySelector('#edit-popup .add');
        addButton.addEventListener('click', () => {
            document.getElementById('edit-popup').classList.remove('view-page-1');
            document.getElementById('edit-popup').classList.add('view-page-2');
            refreshCategories(true);
        })

        const backButton = document.querySelector('#edit-popup .fa-arrow-left');
        backButton.addEventListener('click', () => {
            document.getElementById('edit-popup').classList.remove('view-page-2');
            document.getElementById('edit-popup').classList.add('view-page-1');
            document.getElementById('reset').click();
            ct.style.backgroundImage = "none";
            ct.classList.remove('view-file');
        })
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') closePopup();
});

/*
 * Functions for gallery items
 */
function refreshWorks(isPopup, items = null, category = -1) {
    if (!isPopup) {
        // Delete items in gallery div
        document.getElementById('gallery-list').textContent = "";

        if (category === -1) {
            // Refresh without new data
            if (items === null) galleryItem.forEach((item) => addItemInGallery(item, true))
            // Refresh with new data from DB
            else {
                items.forEach((item, index) => {
                    addItemInGallery(item);
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
        fetch("http://localhost:5678/api/works/" + item.id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token"),
            }
        }).then((response) => {
            if (response.ok) {
                galleryItem.forEach((i, index) => {
                    if (item.id === i.id) galleryItem.splice(index, 1);
                })
                refreshWorks(true);
                refreshWorks(false);
            }
        }).catch((error) => {
            console.log(error);
        })
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

function closePopup() {
    document.getElementById('edit-popup').classList.remove('view-page-1');
    document.getElementById('edit-popup').classList.remove('view-page-2');
    document.getElementById('reset').click();
    const ct = document.querySelector('#edit-popup form > div')
    ct.style.backgroundImage = "none";
    ct.classList.remove('view-file');
}

/*
 * Functions for categories
 */
function refreshCategories(isPopup = false) {
    if (!isPopup) {
        const categoriesHome = document.getElementById('categories');
        categoriesHome.textContent = "";

        categories.forEach((category, index) => {
            const input = document.createElement('input');
            const label = document.createElement('label');

            input.setAttribute('type', 'radio');
            input.setAttribute('name', 'filters');
            input.setAttribute('value', category.id);
            input.setAttribute('id', category.name);
            if (index === 0) input.checked = true;

            input.addEventListener('change', (e) => {
                refreshWorks(false, null, Number(e.target.value));
            })

            label.setAttribute('for', category.name);
            label.textContent = category.name;

            categoriesHome.appendChild(input);
            categoriesHome.appendChild(label);
        });
    } else {
        const categoriyEdit = document.getElementById('category-edit');
        categoriyEdit.textContent = "";

        categories.forEach((category, index) => {
            if (index !== 0) {
                const option = document.createElement('option');

                option.setAttribute('value', category.id);
                option.textContent = category.name;

                categoriyEdit.appendChild(option);
            }
        });
    }
}