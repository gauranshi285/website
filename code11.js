let mydiv=document.querySelector('#mydiv');
let newElement=document.createElement('span');
newElement.textContent ="gauranshi agarwal"
mydiv.insertAdjacentElement('afterbegin',newElement);
let parent=child.parentElement;
let child=document.querySelector('#fpara');
parent.removeChild(child);