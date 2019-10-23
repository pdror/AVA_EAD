//const SimpleMDE = require('simplemde');

//require('simplemde/dist/simplemde.min.css');

/*********
 * Events
 *********/
//Deletar notificação
// document.addEventListener('DOMContentLoaded', () => {
//     (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
//         $notification = $delete.parentNode;
//         $delete.addEventListener('click', () => {
//             $notification.parentNode.removeChild($notification);
//         });
//     });
// });

var aboutLink = window.document.getElementById('about-link')
var aboutModal = window.document.GetElementById('about-modal')

aboutLink.onclick = () => {
    modal.style.display('block')
}



// function simpleMarkdown() {
//     setTimeout(function () {
//         new SimpleMDE({
//             element: document.getElementById('text'),
//             forceSync: true,
//             indentWithTabs: false
//         });
//     }, 0);
// }