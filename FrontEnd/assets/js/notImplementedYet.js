document.addEventListener('DOMContentLoaded', () => {
    const notImplementedElements = document.getElementsByClassName('not-implemented');
    for (let i = 0; i < notImplementedElements.length; i++) {
        notImplementedElements[i].addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Not implemented yet');
            return false;
        });
    }
});